<template>
	<Popover placement="right-start" class="flex w-full">
		<template #target="{ togglePopover }">
			<button
				:class="[
					'group w-full flex h-7 items-center justify-between rounded px-2 text-base text-ink-gray-8 hover:bg-surface-gray-2',
				]"
				@click.prevent="togglePopover()"
			>
				<div class="flex gap-2">
					<LayoutGrid class="size-4 stroke-1.5" />
					<span class="whitespace-nowrap">
						{{ __('Apps') }}
					</span>
				</div>
				<ChevronRight class="h-4 w-4 stroke-1.5" />
			</button>
		</template>
		<template #body>
			<div
				class="grid grid-cols-2 justify-between mx-3 p-2 rounded-lg border border-gray-100 bg-surface-white shadow-xl sm:grid-cols-3"
			>
				<div v-for="app in apps.data" :key="app.name">
					<a
						:href="app.route"
						@click="navigateToApp($event, app.route)"
						class="flex flex-col gap-1.5 rounded justify-center items-center py-2 px-3 hover:bg-surface-gray-2"
					>
						<img class="size-8" :src="app.logo" />
						<div class="text-sm text-ink-gray-7">
							{{ app.title }}
						</div>
					</a>
				</div>
			</div>
		</template>
	</Popover>
</template>
<script setup>
import { Popover, createResource } from 'frappe-ui'
import { LayoutGrid, ChevronRight } from 'lucide-vue-next'

const apps = createResource({
	url: 'frappe.apps.get_apps',
	cache: 'apps',
	auto: true,
	transform: (data) => {
		let _apps = [
			{
				name: 'frappe',
				logo: '/assets/lms/images/desk.png',
				title: __('Desk'),
				route: '/app',
			},
		]
		data.map((app) => {
			if (app.name === 'lms') return
			const route = normaliseRoute(app.route)
			// Do not render an unusable app link. Some Frappe versions return a
			// route object rather than a path string.
			if (!route) return
			_apps.push({
				name: app.name,
				logo: app.logo,
				title: __(app.title),
				route,
			})
		})
		return _apps
	},
})

// Desk and installed Frappe apps live outside the LMS Vue router. Use a
// document navigation rather than router.push(), and keep the link's href as
// a no-JavaScript fallback.
function normaliseRoute(route) {
	if (typeof route === 'string') return route
	if (!route || typeof route !== 'object') return null

	// `frappe.apps.get_apps` has returned both a string and an object across
	// Frappe versions. Only accept an actual URL/path field, never stringify
	// the object (which would create /[object%20Object]).
	for (const key of ['route', 'path', 'url', 'href']) {
		if (typeof route[key] === 'string') return route[key]
	}
	return null
}

const navigateToApp = (event, route) => {
	event.preventDefault()
	const destination = normaliseRoute(route)
	if (!destination) return
	window.location.assign(new URL(destination, window.location.origin).href)
}
</script>
