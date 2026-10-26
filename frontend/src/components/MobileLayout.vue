<template>
	<div class="flex h-[100dvh] overflow-hidden flex-col bg-surface-white">
		<main class="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain pb-[calc(4.5rem+env(safe-area-inset-bottom))]" id="scrollContainer">
			<slot />
		</main>
		<div
			v-if="showMoreMenu"
			class="fixed inset-0 z-30 bg-black/20"
			aria-hidden="true"
			@click="showMoreMenu = false"
		></div>
		<div
			v-if="showMoreMenu"
			class="fixed inset-x-3 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-xl border border-outline-gray-2 bg-surface-white p-2 shadow-xl"
			role="menu"
		>
			<button
				v-for="link in moreLinks"
				:key="link.label"
				class="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-base text-ink-gray-8 active:bg-surface-gray-2"
				role="menuitem"
				@click="handleMoreClick(link)"
			>
				<component
					v-if="link.icon"
					:is="icons[link.icon]"
					class="h-5 w-5 shrink-0 stroke-1.5 text-ink-gray-5"
				/>
				<span class="min-w-0 flex-1 truncate">{{ __(link.label) }}</span>
			</button>
		</div>
		<div
			v-if="sidebarSettings.data"
			class="fixed inset-x-0 bottom-0 z-20 flex min-h-14 items-center justify-around border-t border-outline-gray-2 bg-surface-white px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_14px_rgba(15,23,42,0.06)]"
		>
			<button
				v-for="tab in primaryLinks"
				:key="tab.label"
				:class="isVisible(tab) ? 'block' : 'hidden'"
				class="flex min-w-0 flex-1 flex-col items-center justify-center py-2.5 transition active:scale-95"
				@click="handleClick(tab)"
			>
				<component
					:is="icons[tab.icon]"
					class="h-6 w-6 stroke-1.5"
					:class="[isActive(tab) ? 'text-ink-gray-9' : 'text-ink-gray-5']"
				/>
			</button>
			<button
				class="flex min-h-11 min-w-11 items-center justify-center"
				:aria-expanded="showMoreMenu"
				:aria-label="__('More navigation options')"
				@click="showMoreMenu = !showMoreMenu"
			>
				<component
					:is="icons['List']"
					class="h-6 w-6 stroke-1.5 text-ink-gray-5"
				/>
			</button>
		</div>
		<SettingsModal
			v-if="userResource.data?.is_moderator"
			v-model="showSettingsModal"
		/>
	</div>
</template>
<script setup>
import { getSidebarLinks } from '../utils'
import { useRouter } from 'vue-router'
import { computed, watch, ref, onMounted } from 'vue'
import { sessionStore } from '@/stores/session'
import { usersStore } from '@/stores/user'
import SettingsModal from '@/components/Modals/Settings.vue'
import * as icons from 'lucide-vue-next'

const { logout, user, sidebarSettings } = sessionStore()
let { isLoggedIn } = sessionStore()
const router = useRouter()
let { userResource } = usersStore()
const sidebarLinks = ref(getSidebarLinks())
const otherLinks = ref([])
const showMoreMenu = ref(false)
const showSettingsModal = ref(false)
const theme = ref('light')

const primaryLinks = computed(() => {
	return sidebarLinks.value.filter(isVisible).slice(0, 4)
})

const moreLinks = computed(() => {
	return [...sidebarLinks.value.filter(isVisible).slice(4), ...otherLinks.value]
})

onMounted(() => {
	theme.value = document.documentElement.dataset.theme || localStorage.getItem('theme') || 'light'
	if (['light', 'dark'].includes(theme.value)) {
		document.documentElement.setAttribute('data-theme', theme.value)
	}
	addOtherLinks()
	if (userResource.data?.is_moderator || userResource.data?.is_instructor) {
		addRoleLinks()
	}
	sidebarSettings.reload(
		{},
		{
			onSuccess(data) {
				Object.keys(data).forEach((key) => {
					if (!parseInt(data[key])) {
						sidebarLinks.value = sidebarLinks.value.filter(
							(link) => link.label.toLowerCase().split(' ').join('_') !== key
						)
					}
				})

				addOtherLinks()
			},
		}
	)
})

const addOtherLinks = () => {
	const links = []
	if (user) {
		links.push({
			label: 'Notifications',
			icon: 'Bell',
			to: 'Notifications',
		})
		links.push({
			label: 'Profile',
			icon: 'UserRound',
		})
		links.push({
			label: 'Toggle Theme',
			icon: theme.value === 'dark' ? 'Sun' : 'Moon',
		})
		if (userResource.data?.is_system_manager) {
			links.push({ label: 'Desk', icon: 'LayoutGrid', href: '/app' })
		}
		if (userResource.data?.is_moderator) {
			links.push({ label: 'Settings', icon: 'Settings' })
		}
		links.push({
			label: 'Log out',
			icon: 'LogOut',
		})
	} else {
		links.push({
			label: 'Log in',
			icon: 'LogIn',
		})
	}
	otherLinks.value = links
}

watch(userResource, () => {
	addOtherLinks()
	if (
		userResource.data &&
		(userResource.data.is_moderator || userResource.data.is_instructor)
	) {
		addRoleLinks()
	}
})

const addRoleLinks = () => {
	const roleLinks = [
		{
			label: 'Programs',
			icon: 'Route',
			to: 'Programs',
			activeFor: ['Programs', 'ProgramForm'],
		},
		{
			label: 'Quizzes',
			icon: 'CircleHelp',
			to: 'Quizzes',
			activeFor: ['Quizzes', 'QuizForm'],
		},
		{
			label: 'Assignments',
			icon: 'Pencil',
			to: 'Assignments',
			activeFor: ['Assignments', 'AssignmentForm'],
		},
	]

	roleLinks.forEach((link, index) => {
		if (sidebarLinks.value.some((item) => item.label === link.label)) return
		// Keep the learner's most-used administration actions visible in the
		// bottom bar. Remaining links are still available through More.
		sidebarLinks.value.splice(index + 1, 0, link)
	})
}

let isActive = (tab) => {
	return tab.activeFor?.includes(router.currentRoute.value.name)
}

const handleClick = (tab) => {
	if (tab.href) {
		// Desk is outside the LMS Vue router. Use a full document navigation so
		// it also works after an orientation change in a mobile WebView.
		window.location.assign(new URL(tab.href, window.location.origin).href)
	}
	else if (tab.label == 'Toggle Theme') {
		theme.value = theme.value === 'dark' ? 'light' : 'dark'
		document.documentElement.setAttribute('data-theme', theme.value)
		localStorage.setItem('theme', theme.value)
		addOtherLinks()
	}
	else if (tab.label == 'Settings') showSettingsModal.value = true
	else if (tab.label == 'Log in') window.location.href = '/login'
	else if (tab.label == 'Log out')
		logout.submit().then(() => {
			isLoggedIn = false
		})
	else if (tab.label == 'Profile')
		router.push({
			name: 'Profile',
			params: {
				username: userResource.data?.username,
			},
		})
	else router.push({ name: tab.to })
}

const handleMoreClick = (tab) => {
	showMoreMenu.value = false
	handleClick(tab)
}

const isVisible = (tab) => {
	if (tab.label == 'Log in') return !isLoggedIn
	else if (tab.label == 'Log out') return isLoggedIn
	else return true
}
</script>
