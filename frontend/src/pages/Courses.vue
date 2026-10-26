<template>
        <header
                :class="[
                        'petcon-topbar sticky top-0 z-10 flex items-center justify-between px-3 py-2.5 sm:px-5',
                        { 'petcon-theme-dark': isDarkTheme },
                ]"
        >
                <Breadcrumbs :items="breadcrumbs" />

                <router-link
                        v-if="user.data?.is_moderator"
                        class="petcon-create-link"
                        :to="{
                                name: 'CourseForm',
                                params: { courseName: 'new' },
                        }"
                >
                        <Button variant="solid" class="petcon-create-btn">
                                <template #prefix>
                                        <Plus class="h-4 w-4 stroke-2" />
                                </template>
				<span class="hidden sm:inline">{{ __('Create new Course') }}</span>
				<span class="sm:hidden">{{ __('Create') }}</span>
                        </Button>
                </router-link>
        </header>

        <main :class="['petcon-courses-page', { 'petcon-theme-dark': isDarkTheme }]">
                <section class="petcon-academy-hero">
                        <div class="petcon-industrial-grid" aria-hidden="true"></div>
                        <div class="petcon-gold-beam" aria-hidden="true"></div>
                        <div class="petcon-hazard-mark" aria-hidden="true"></div>

                        <div class="petcon-hero-copy">
                                <div class="petcon-brand-lockup">
                                        <span class="petcon-brand-rule"></span>
                                        <div>
                                                <span class="petcon-brand-name">PETCON</span>
                                                <span class="petcon-brand-subtitle">
                                                        {{ __('Learning & Competency Hub') }}
                                                </span>
                                        </div>
                                </div>

                                <div class="petcon-eyebrow">
                                        {{ __('Oil & Gas Training Catalogue') }}
                                </div>

                                <h1 class="petcon-title">
                                        <span>{{ __('Train for the field.') }}</span>
                                        <strong>{{ __('Perform with confidence.') }}</strong>
                                </h1>

                                <p class="petcon-subtitle">
                                        {{
                                                __(
                                                        'Explore accredited, technical, safety, and professional learning designed for real oil and gas operations.'
                                                )
                                        }}
                                </p>

                                <div class="petcon-capability-row">
                                        <div class="petcon-capability">
                                                <span class="petcon-capability-icon">
                                                        <ShieldCheck class="h-4 w-4" />
                                                </span>
                                                <span>{{ __('Safety Focused') }}</span>
                                        </div>

                                        <div class="petcon-capability">
                                                <span class="petcon-capability-icon">
                                                        <Wrench class="h-4 w-4" />
                                                </span>
                                                <span>{{ __('Field Relevant') }}</span>
                                        </div>

                                        <div class="petcon-capability">
                                                <span class="petcon-capability-icon">
                                                        <Award class="h-4 w-4" />
                                                </span>
                                                <span>{{ __('Certification Ready') }}</span>
                                        </div>
                                </div>
                        </div>

                        <aside class="petcon-discovery-panel">
                                <div class="petcon-panel-heading">
                                        <div>
                                                <span class="petcon-panel-kicker">
                                                        {{ __('Course Finder') }}
                                                </span>
                                                <h2>{{ __('Choose your learning path') }}</h2>
                                        </div>

                                        <div class="petcon-live-indicator">
                                                <span></span>
                                                {{ __('Catalogue Live') }}
                                        </div>
                                </div>

                                <div class="petcon-tabs-wrap">
                                        <TabButtons
                                                v-if="user.data"
                                                :buttons="courseTabs"
                                                v-model="currentTab"
                                        />
                                </div>

                                <div class="petcon-filter-row">
                                        <label class="petcon-cert-toggle">
                                                <input
                                                        v-model="certification"
                                                        type="checkbox"
                                                        class="petcon-cert-input"
                                                        @change="updateCourses()"
                                                />
                                                <span class="petcon-cert-switch" aria-hidden="true">
                                                        <span class="petcon-cert-knob"></span>
                                                </span>
                                                <span class="petcon-cert-copy">
                                                        <small>{{ __('Filter') }}</small>
                                                        <strong>{{ __('Certification') }}</strong>
                                                </span>
                                        </label>

                                        <div class="petcon-search-shell">
                                                <span class="petcon-search-label">
                                                        {{ __('Search catalogue') }}
                                                </span>
                                                <FormControl
                                                        v-model="title"
                                                        :placeholder="__('Type a course title')"
                                                        type="text"
                                                        class="petcon-search-control"
                                                        @input="scheduleCourseUpdate()"
                                                />
                                        </div>
                                </div>
                        </aside>
                </section>

                <section class="petcon-library-section">
                        <div class="petcon-section-heading">
                                <div>
                                        <span class="petcon-section-kicker">
                                                {{ __('PETCON Training Library') }}
                                        </span>
                                        <h2>{{ currentTab }} {{ __('Courses') }}</h2>
                                </div>

                                <div
                                        v-if="courses.data?.length"
                                        class="petcon-result-count"
                                >
                                        <span>{{ courses.data.length }}</span>
                                        {{ __('courses loaded') }}
                                </div>
                        </div>

                        <div
                                v-if="courses.list.loading && !courses.data?.length"
                                class="petcon-loading-state"
                        >
                                <div class="petcon-loader-ring" aria-hidden="true"></div>
                                <div>
                                        <strong>{{ __('Loading courses') }}</strong>
                                        <span>{{ __('Preparing your training catalogue...') }}</span>
                                </div>
                        </div>

                        <div
                                v-else-if="courses.data?.length"
                                class="petcon-course-grid grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
                        >
                                <router-link
                                        v-for="course in courses.data"
                                        :key="course.name"
                                        class="petcon-course-link"
                                        :to="{
                                                name: 'CourseDetail',
                                                params: { courseName: course.name },
                                        }"
                                >
                                        <span class="petcon-card-accent" aria-hidden="true"></span>
                                        <CourseCard :course="course" />
                                </router-link>
                        </div>

                        <div
                                v-else
                                class="petcon-empty-state"
                        >
                                <div class="petcon-empty-icon">
                                        <BookOpen class="h-10 w-10 stroke-1.5" />
                                </div>

                                <div class="petcon-empty-copy">
                                        <span>{{ __('Catalogue Update') }}</span>
                                        <h3>{{ __('No courses found') }}</h3>
                                        <p>
                                                {{
                                                        __(
                                                                'No courses match the selected filters. Try another tab, remove the certification filter, or search with a different title.'
                                                        )
                                                }}
                                        </p>
                                </div>
                        </div>

                        <div
                                v-if="
                                        courses.data?.length &&
                                        !courses.list.loading &&
                                        courses.hasNextPage
                                "
                                class="petcon-load-more"
                        >
                                <Button @click="courses.next()" class="petcon-load-btn">
                                        {{ __('Load More Courses') }}
                                </Button>
                        </div>
                </section>
        </main>
</template>

<script setup>
import {
        Breadcrumbs,
        Button,
        createListResource,
        FormControl,
        TabButtons,
} from 'frappe-ui'
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Award, BookOpen, Plus, ShieldCheck, Wrench } from 'lucide-vue-next'
import { updateDocumentTitle } from '@/utils'
import CourseCard from '@/components/CourseCard.vue'

const user = inject('$user')
const dayjs = inject('$dayjs')

const pageLength = ref(30)
const title = ref('')
const certification = ref(false)
const filters = ref({})
const currentTab = ref('Live')
const pageReady = ref(false)
const isDarkTheme = ref(false)
let searchTimer = null
let themeObserver = null

const syncTheme = () => {
        const root = document.documentElement
        const body = document.body
        isDarkTheme.value =
                root.dataset.theme === 'dark' ||
                root.classList.contains('dark') ||
                body?.dataset.theme === 'dark' ||
                body?.classList.contains('dark')
}

const courses = createListResource({
        doctype: 'LMS Course',
        url: 'lms.lms.utils.get_courses',
        pageLength: pageLength.value,
        start: 0,
})

onMounted(() => {
        syncTheme()
        themeObserver = new MutationObserver(syncTheme)
        themeObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class', 'data-theme'],
        })
        themeObserver.observe(document.body, {
                attributes: true,
                attributeFilter: ['class', 'data-theme'],
        })
        setFiltersFromQuery()
        pageReady.value = true
        updateCourses()
})

onBeforeUnmount(() => {
        themeObserver?.disconnect()
        if (searchTimer) {
                clearTimeout(searchTimer)
        }
})

const setFiltersFromQuery = () => {
        const queries = new URLSearchParams(location.search)
        title.value = queries.get('title') || ''

        const certificationQuery = queries.get('certification')
        certification.value = certificationQuery === '1' || certificationQuery === 'true'
}

const scheduleCourseUpdate = () => {
        if (searchTimer) {
                clearTimeout(searchTimer)
        }

        searchTimer = setTimeout(() => {
                updateCourses()
        }, 300)
}

const updateCourses = () => {
        if (!pageReady.value) {
                return
        }

        updateFilters()

        courses.update({
                filters: { ...filters.value },
                start: 0,
                pageLength: pageLength.value,
        })
        courses.reload()
}

const updateFilters = () => {
        const nextFilters = {}

        if (title.value.trim()) {
                nextFilters.title = ['like', `%${title.value.trim()}%`]
        }

        if (certification.value) {
                nextFilters.certification = 1
        }

        applyTabFilters(nextFilters)
        filters.value = nextFilters
        setQueryParams()
}

const applyTabFilters = (nextFilters) => {
        if (currentTab.value === 'Upcoming') {
                nextFilters.published = 1
                nextFilters.upcoming = 1
                return
        }

        if (currentTab.value === 'New') {
                nextFilters.published = 1
                nextFilters.upcoming = 0
                nextFilters.published_on = [
                        '>=',
                        dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
                ]
                return
        }

        if (currentTab.value === 'Enrolled' && user.data?.is_student) {
                nextFilters.enrolled = 1
                return
        }

        if (currentTab.value === 'Created' && !user.data?.is_student) {
                nextFilters.created = 1
                return
        }

        // The UI tab is called "Live", but the current LMS backend expects
        // the special "Catalogue" filter. Sending "live" caused intermittent
        // empty results depending on when user data finished loading.
        nextFilters.published = 1
        nextFilters.upcoming = 0
        nextFilters.Catalogue = 1
}

const setQueryParams = () => {
        const queries = new URLSearchParams(location.search)

        if (title.value.trim()) {
                queries.set('title', title.value.trim())
        } else {
                queries.delete('title')
        }

        if (certification.value) {
                queries.set('certification', '1')
        } else {
                queries.delete('certification')
        }

        const queryString = queries.toString()
        history.replaceState(
                {},
                '',
                queryString ? `${location.pathname}?${queryString}` : location.pathname
        )
}

watch(currentTab, () => {
        if (pageReady.value) {
                updateCourses()
        }
})

// When the user resource finishes loading, make sure the active role-based
// tab is still valid and refresh once with the correct permissions.
watch(
        () => user.data?.name,
        (userName, previousUserName) => {
                if (!pageReady.value || !userName || userName === previousUserName) {
                        return
                }

                if (currentTab.value === 'Enrolled' && !user.data?.is_student) {
                        currentTab.value = 'Live'
                        return
                }

                if (currentTab.value === 'Created' && user.data?.is_student) {
                        currentTab.value = 'Live'
                        return
                }

                updateCourses()
        }
)

const courseTabs = computed(() => {
        const tabs = [
                { label: __('Live') },
                { label: __('New') },
                { label: __('Upcoming') },
        ]

        if (user.data?.is_student) {
                tabs.push({ label: __('Enrolled') })
        } else if (user.data) {
                tabs.push({ label: __('Created') })
        }

        return tabs
})

const breadcrumbs = computed(() => [
        {
                label: __('Courses'),
                route: { name: 'Courses' },
        },
])

const pageMeta = computed(() => ({
        title: 'Courses',
        description: 'All published courses.',
}))

updateDocumentTitle(pageMeta)
</script>

<style scoped>
.petcon-courses-page {
        --petcon-gold: #f5b51b;
        --petcon-gold-bright: #ffc533;
        --petcon-gold-soft: #ffe08a;
        --petcon-black: #070809;
        --petcon-ink: #111316;
        --petcon-charcoal: #222933;
        --petcon-steel: #353e48;
        /*
         * Keep the light palette self-contained. Frappe variables may follow
         * the operating-system preference even when the LMS itself is still
         * in light mode, which previously produced white text on a light
         * course-library background.
         */
        --petcon-page-bg: #f3f4f5;
        --petcon-surface: #ffffff;
        --petcon-surface-raised: #f9fafb;
        --petcon-text: #17191c;
        --petcon-muted: #68717d;
        --petcon-border: rgba(31, 41, 55, 0.14);
        --petcon-shadow: rgba(15, 23, 42, 0.11);

        min-height: 100vh;
        padding: 1.25rem 1.25rem 3rem;
        color: var(--petcon-text);
		color-scheme: light;
        background:
                radial-gradient(circle at 15% 5%, rgba(245, 181, 27, 0.08), transparent 19rem),
                linear-gradient(180deg, #f8f8f7 0%, var(--petcon-page-bg) 100%);
}

.petcon-topbar {
        color: var(--text-color, #17191c) !important;
        background: var(--bg-color, #ffffff) !important;
        border: 0 !important;
        border-bottom: 1px solid rgba(245, 181, 27, 0.16) !important;
        box-shadow: none !important;
}

/*
 * Keep the page palette tied to the LMS theme attribute at runtime. This is
 * intentionally local to the page as a fallback for deployments where Frappe
 * utility styles load after this component's scoped CSS.
 */
.petcon-courses-page.petcon-theme-dark {
        --petcon-page-bg: #0a0c0e;
        --petcon-surface: #171b20;
        --petcon-surface-raised: #20262d;
        --petcon-text: #f4f5f6;
        --petcon-muted: #aeb5bd;
        --petcon-border: rgba(255, 255, 255, 0.11);
        --petcon-shadow: rgba(0, 0, 0, 0.34);

        color-scheme: dark;
        background:
                radial-gradient(circle at 14% 4%, rgba(245, 181, 27, 0.085), transparent 20rem),
                linear-gradient(180deg, #070809 0%, #0d1013 100%) !important;
}

.petcon-topbar.petcon-theme-dark {
        color: #f4f5f6 !important;
        background: #070809 !important;
        border-bottom-color: rgba(245, 181, 27, 0.18) !important;
}

.petcon-topbar.petcon-theme-dark :deep(.text-ink-gray-9),
.petcon-topbar.petcon-theme-dark :deep(.text-ink-gray-8),
.petcon-topbar.petcon-theme-dark :deep(.breadcrumbs) {
        color: #f4f5f6 !important;
}

.petcon-courses-page.petcon-theme-dark :deep(.petcon-search-control input) {
        color: #f5f6f7 !important;
        border-color: rgba(245, 181, 27, 0.24) !important;
        background: #151a1f !important;
}

.petcon-courses-page.petcon-theme-dark :deep(.petcon-search-control input::placeholder) {
        color: #9da5ae !important;
}

.petcon-create-link {
        display: inline-flex;
        border-radius: 999px;
        text-decoration: none !important;
}

.petcon-create-btn,
.petcon-load-btn {
        min-height: 2.65rem !important;
        border-radius: 999px !important;
        font-weight: 900 !important;
        letter-spacing: -0.015em;
        transition:
                transform 0.2s ease,
                box-shadow 0.2s ease,
                background-color 0.2s ease,
                filter 0.2s ease;
}

/*
 * Frappe UI can apply the class to the component root or its internal button.
 * These selectors cover both cases and prevent outline styles from making the
 * create action transparent.
 */
.petcon-create-btn,
.petcon-create-link :deep(button),
.petcon-create-link :deep([role='button']) {
        color: #17130a !important;
        background-color: #f5b51b !important;
        background-image: linear-gradient(135deg, #ffd45f 0%, #f5b51b 58%, #d99500 100%) !important;
        border: 1px solid #f5b51b !important;
        outline: none !important;
        opacity: 1 !important;
        box-shadow:
                0 11px 26px rgba(245, 181, 27, 0.34),
                inset 0 1px 0 rgba(255, 255, 255, 0.48) !important;
        -webkit-text-fill-color: #17130a !important;
}

.petcon-create-btn :deep(*),
.petcon-create-link :deep(button *),
.petcon-create-link :deep([role='button'] *) {
        color: #17130a !important;
        stroke: currentColor !important;
        -webkit-text-fill-color: #17130a !important;
}

.petcon-create-btn:hover,
.petcon-create-link:hover :deep(button),
.petcon-create-link:hover :deep([role='button']),
.petcon-create-link:focus-visible :deep(button),
.petcon-create-link:focus-visible :deep([role='button']) {
        color: #17130a !important;
        background-color: #ffc533 !important;
        background-image: linear-gradient(135deg, #ffe187 0%, #ffc533 58%, #e7a400 100%) !important;
        border-color: #ffc533 !important;
        transform: translateY(-2px);
        filter: brightness(1.02);
        box-shadow:
                0 14px 32px rgba(245, 181, 27, 0.42),
                0 0 0 4px rgba(245, 181, 27, 0.12) !important;
}

.petcon-create-link:active :deep(button),
.petcon-create-link:active :deep([role='button']) {
        transform: translateY(0);
}

.petcon-load-btn:hover {
        transform: translateY(-2px);
        filter: brightness(1.04);
}

.petcon-academy-hero {
        position: relative;
        isolation: isolate;
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(25rem, 0.85fr);
        gap: 2rem;
        overflow: hidden;
        min-height: 25rem;
        padding: clamp(1.5rem, 3vw, 3rem);
        border: 1px solid rgba(245, 181, 27, 0.24);
        border-radius: 0.4rem 2.2rem 0.4rem 2.2rem;
        background:
                radial-gradient(circle at 82% 18%, rgba(245, 181, 27, 0.17), transparent 20rem),
                linear-gradient(120deg, rgba(6, 7, 8, 0.99), rgba(22, 25, 29, 0.98) 56%, rgba(34, 41, 51, 0.97));
        box-shadow:
                0 28px 70px rgba(0, 0, 0, 0.28),
                inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.petcon-industrial-grid {
        position: absolute;
        inset: 0;
        z-index: -3;
        opacity: 0.21;
        background-image:
                linear-gradient(rgba(255, 255, 255, 0.055) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.055) 1px, transparent 1px);
        background-size: 42px 42px;
        mask-image: linear-gradient(90deg, black, transparent 78%);
}

.petcon-gold-beam {
        position: absolute;
        top: -18rem;
        left: 23%;
        z-index: -2;
        width: 10rem;
        height: 56rem;
        transform: rotate(19deg);
        background: linear-gradient(
                90deg,
                transparent,
                rgba(245, 181, 27, 0.08),
                rgba(245, 181, 27, 0.2),
                rgba(245, 181, 27, 0.06),
                transparent
        );
        filter: blur(9px);
}

.petcon-hazard-mark {
        position: absolute;
        right: -3rem;
        bottom: -2.6rem;
        z-index: -1;
        width: 19rem;
        height: 8rem;
        transform: rotate(-7deg);
        opacity: 0.1;
        background: repeating-linear-gradient(
                135deg,
                var(--petcon-gold) 0 18px,
                transparent 18px 36px
        );
}

.petcon-hero-copy,
.petcon-discovery-panel {
        position: relative;
        z-index: 1;
}

.petcon-hero-copy {
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-width: 48rem;
        padding-right: 1rem;
}

.petcon-brand-lockup {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        margin-bottom: 2rem;
}

.petcon-brand-rule {
        display: block;
        width: 0.26rem;
        height: 2.9rem;
        border-radius: 999px;
        background: linear-gradient(180deg, var(--petcon-gold-bright), #b97900);
        box-shadow: 0 0 20px rgba(245, 181, 27, 0.34);
}

.petcon-brand-lockup > div {
        display: flex;
        flex-direction: column;
}

.petcon-brand-name {
        color: var(--petcon-gold);
        font-size: 1.05rem;
        font-weight: 950;
        line-height: 1;
        letter-spacing: 0.2em;
}

.petcon-brand-subtitle {
        margin-top: 0.35rem;
        color: rgba(255, 255, 255, 0.58);
        font-size: 0.66rem;
        font-weight: 800;
        letter-spacing: 0.13em;
        text-transform: uppercase;
}

.petcon-eyebrow {
        width: fit-content;
        margin-bottom: 0.9rem;
        color: var(--petcon-gold-soft);
        font-size: 0.72rem;
        font-weight: 900;
        letter-spacing: 0.15em;
        text-transform: uppercase;
}

.petcon-title {
        display: flex;
        flex-direction: column;
        margin: 0;
        font-size: clamp(2rem, 4.2vw, 4.25rem);
        font-weight: 900;
        line-height: 0.98;
        letter-spacing: -0.055em;
}

.petcon-title span {
        color: #ffffff;
}

.petcon-title strong {
        margin-top: 0.22rem;
        color: var(--petcon-gold);
        font-weight: 900;
}

.petcon-subtitle {
        max-width: 43rem;
        margin-top: 1.35rem;
        color: rgba(239, 242, 245, 0.76);
        font-size: 1rem;
        line-height: 1.75;
}

.petcon-capability-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 1.65rem;
}

.petcon-capability {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        min-height: 2.4rem;
        padding: 0.35rem 0.75rem 0.35rem 0.38rem;
        color: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.11);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.055);
        font-size: 0.76rem;
        font-weight: 800;
        backdrop-filter: blur(10px);
}

.petcon-capability-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.72rem;
        height: 1.72rem;
        color: #17130a;
        border-radius: 999px;
        background: var(--petcon-gold);
}

.petcon-discovery-panel {
        align-self: center;
        padding: 1.25rem;
        border: 1px solid rgba(245, 181, 27, 0.24);
        border-radius: 1.5rem 0.35rem 1.5rem 0.35rem;
        background:
                linear-gradient(145deg, rgba(40, 47, 56, 0.92), rgba(18, 21, 25, 0.93)),
                radial-gradient(circle at top right, rgba(245, 181, 27, 0.12), transparent 14rem);
        box-shadow:
                0 22px 50px rgba(0, 0, 0, 0.28),
                inset 0 1px 0 rgba(255, 255, 255, 0.055);
        backdrop-filter: blur(18px);
}

.petcon-panel-heading {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1rem;
}

.petcon-panel-kicker {
        color: var(--petcon-gold);
        font-size: 0.68rem;
        font-weight: 900;
        letter-spacing: 0.14em;
        text-transform: uppercase;
}

.petcon-panel-heading h2 {
        margin: 0.24rem 0 0;
        color: #ffffff;
        font-size: 1.15rem;
        font-weight: 850;
        letter-spacing: -0.025em;
}

.petcon-live-indicator {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        flex-shrink: 0;
        color: rgba(255, 255, 255, 0.66);
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.03em;
}

.petcon-live-indicator span {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 999px;
        background: var(--petcon-gold);
        box-shadow: 0 0 0 4px rgba(245, 181, 27, 0.12);
        animation: petconPulse 1.8s ease-in-out infinite;
}

.petcon-tabs-wrap {
        min-width: 0;
}

.petcon-filter-row {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        gap: 0.85rem;
        margin-top: 0.9rem;
}

.petcon-cert-toggle {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 0.7rem;
        min-height: 4.3rem;
        padding: 0.65rem 0.9rem 0.65rem 0.6rem;
        border: 1px solid rgba(255, 255, 255, 0.11);
        border-radius: 0.95rem;
        background: rgba(4, 5, 6, 0.34);
        cursor: pointer;
        user-select: none;
        transition:
                border-color 0.2s ease,
                background 0.2s ease,
                transform 0.2s ease;
}

.petcon-cert-toggle:hover {
        transform: translateY(-1px);
        border-color: rgba(245, 181, 27, 0.46);
        background: rgba(245, 181, 27, 0.07);
}

.petcon-cert-input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
}

.petcon-cert-switch {
        position: relative;
        width: 3rem;
        height: 1.68rem;
        flex-shrink: 0;
        border: 1px solid rgba(255, 255, 255, 0.17);
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.42);
        box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.38);
        transition: all 0.24s ease;
}

.petcon-cert-knob {
        position: absolute;
        top: 50%;
        left: 0.16rem;
        width: 1.3rem;
        height: 1.3rem;
        border-radius: 999px;
        transform: translateY(-50%);
        background: linear-gradient(180deg, #ffffff, #dce1e6);
        box-shadow: 0 3px 9px rgba(0, 0, 0, 0.3);
        transition: all 0.24s ease;
}

.petcon-cert-input:checked + .petcon-cert-switch {
        border-color: rgba(255, 212, 95, 0.72);
        background: linear-gradient(135deg, #ffca42, var(--petcon-gold));
        box-shadow:
                0 0 0 4px rgba(245, 181, 27, 0.13),
                inset 0 2px 5px rgba(137, 87, 0, 0.16);
}

.petcon-cert-input:checked + .petcon-cert-switch .petcon-cert-knob {
        left: calc(100% - 1.46rem);
        background: #fffdf7;
}

.petcon-cert-copy {
        display: flex;
        flex-direction: column;
        min-width: 5.6rem;
}

.petcon-cert-copy small {
        color: rgba(255, 255, 255, 0.46);
        font-size: 0.62rem;
        font-weight: 800;
        line-height: 1;
        text-transform: uppercase;
}

.petcon-cert-copy strong {
        margin-top: 0.25rem;
        color: rgba(255, 255, 255, 0.92);
        font-size: 0.78rem;
        font-weight: 850;
}

.petcon-search-shell {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 0;
        min-height: 4.3rem;
        padding: 0.48rem 0.6rem 0.58rem;
        border: 1px solid rgba(255, 255, 255, 0.11);
        border-radius: 0.95rem;
        background: rgba(4, 5, 6, 0.34);
}

.petcon-search-label {
        margin: 0 0.2rem 0.35rem;
        color: rgba(255, 255, 255, 0.46);
        font-size: 0.61rem;
        font-weight: 850;
        line-height: 1;
        letter-spacing: 0.08em;
        text-transform: uppercase;
}

.petcon-search-control {
        width: 100%;
}

.petcon-library-section {
        margin-top: 2.4rem;
}

.petcon-section-heading {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1.15rem;
        padding: 0 0.2rem 0.9rem;
        border-bottom: 1px solid var(--petcon-border);
}

.petcon-section-kicker {
        color: #a06d00;
        font-size: 0.68rem;
        font-weight: 950;
        letter-spacing: 0.14em;
        text-transform: uppercase;
}

.petcon-section-heading h2 {
        margin: 0.28rem 0 0;
        color: var(--petcon-text);
        font-size: clamp(1.45rem, 2.3vw, 2rem);
        font-weight: 900;
        letter-spacing: -0.04em;
}

.petcon-result-count {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        color: var(--petcon-muted);
        font-size: 0.75rem;
        font-weight: 800;
}

.petcon-result-count span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 2rem;
        height: 2rem;
        padding: 0 0.5rem;
        color: #17130a;
        border-radius: 999px;
        background: var(--petcon-gold);
        font-weight: 950;
}

.petcon-course-grid {
        animation: petconFadeUp 0.45s ease both;
}

.petcon-course-link {
        position: relative;
        display: block;
        height: 100%;
        overflow: hidden;
        color: inherit;
        border: 1px solid var(--petcon-border) !important;
        border-radius: 1rem !important;
        background: var(--petcon-surface) !important;
        box-shadow:
                0 12px 28px var(--petcon-shadow),
                0 2px 6px rgba(15, 23, 42, 0.04);
        text-decoration: none;
        isolation: isolate;
        transition:
                transform 0.23s ease,
                box-shadow 0.23s ease,
                border-color 0.23s ease;
}

.petcon-card-accent {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 3;
        width: 0.32rem;
        height: 100%;
        background: linear-gradient(180deg, var(--petcon-gold-bright), #b97800);
        transform: scaleY(0);
        transform-origin: top;
        transition: transform 0.25s ease;
        pointer-events: none;
}

.petcon-course-link::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 2;
        opacity: 0;
        pointer-events: none;
        background:
                linear-gradient(135deg, rgba(245, 181, 27, 0.1), transparent 32%),
                linear-gradient(0deg, rgba(245, 181, 27, 0.06), transparent 42%);
        transition: opacity 0.24s ease;
}

.petcon-course-link::after {
        content: '';
        position: absolute;
        right: -3rem;
        bottom: -3.6rem;
        z-index: 2;
        width: 8rem;
        height: 8rem;
        opacity: 0;
        border: 1px solid rgba(245, 181, 27, 0.23);
        border-radius: 999px;
        box-shadow:
                0 0 0 1.25rem rgba(245, 181, 27, 0.035),
                0 0 0 2.5rem rgba(245, 181, 27, 0.025);
        transition:
                opacity 0.24s ease,
                transform 0.24s ease;
}

.petcon-course-link:hover {
        transform: translateY(-6px);
        border-color: rgba(245, 181, 27, 0.62) !important;
        box-shadow:
                0 24px 52px rgba(15, 23, 42, 0.17),
                0 0 0 1px rgba(245, 181, 27, 0.08),
                0 14px 30px rgba(245, 181, 27, 0.16);
}

.petcon-course-link:hover .petcon-card-accent {
        transform: scaleY(1);
}

.petcon-course-link:hover::before,
.petcon-course-link:hover::after {
        opacity: 1;
}

.petcon-course-link:hover::after {
        transform: translate(-0.5rem, -0.35rem);
}

.petcon-course-link > :deep(*) {
        position: relative;
        z-index: 1;
        height: 100%;
}

.petcon-loading-state,
.petcon-empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 22rem;
        padding: 2rem;
        border: 1px dashed rgba(245, 181, 27, 0.34);
        border-radius: 0.5rem 1.6rem 0.5rem 1.6rem;
        background:
                linear-gradient(135deg, rgba(245, 181, 27, 0.045), transparent 42%),
                var(--petcon-surface);
}

.petcon-loading-state {
        gap: 1rem;
}

.petcon-loading-state > div:last-child {
        display: flex;
        flex-direction: column;
}

.petcon-loading-state strong {
        color: var(--petcon-text);
        font-size: 1rem;
        font-weight: 900;
}

.petcon-loading-state span {
        margin-top: 0.22rem;
        color: var(--petcon-muted);
        font-size: 0.82rem;
}

.petcon-loader-ring {
        width: 2.7rem;
        height: 2.7rem;
        border: 3px solid rgba(245, 181, 27, 0.18);
        border-top-color: var(--petcon-gold);
        border-radius: 999px;
        animation: petconSpin 0.8s linear infinite;
}

.petcon-empty-state {
        flex-direction: column;
        text-align: center;
}

.petcon-empty-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.7rem;
        height: 4.7rem;
        margin-bottom: 1rem;
        color: #17130a;
        border-radius: 0.35rem 1.2rem 0.35rem 1.2rem;
        background: linear-gradient(135deg, #ffd65f, var(--petcon-gold));
        box-shadow: 0 14px 28px rgba(245, 181, 27, 0.22);
}

.petcon-empty-copy > span {
        color: #a06d00;
        font-size: 0.66rem;
        font-weight: 950;
        letter-spacing: 0.14em;
        text-transform: uppercase;
}

.petcon-empty-copy h3 {
        margin: 0.35rem 0;
        color: var(--petcon-text);
        font-size: 1.25rem;
        font-weight: 900;
}

.petcon-empty-copy p {
        max-width: 37rem;
        margin: 0;
        color: var(--petcon-muted);
        line-height: 1.7;
}

.petcon-load-more {
        display: flex;
        justify-content: center;
        padding: 2rem 0 0.5rem;
}

.petcon-load-btn {
        color: #17130a !important;
        background: linear-gradient(135deg, #ffca42, var(--petcon-gold)) !important;
        border: 1px solid rgba(255, 218, 116, 0.72) !important;
        box-shadow: 0 12px 26px rgba(245, 181, 27, 0.24);
}

/* Search field */
:deep(.petcon-search-control input),
:deep(.petcon-search-control .form-control) {
        width: 100% !important;
        min-height: 2.55rem !important;
        color: #111316 !important;
        border: 1px solid rgba(245, 181, 27, 0.22) !important;
        border-radius: 0.7rem !important;
        background: #f7f7f5 !important;
        font-size: 0.88rem !important;
        font-weight: 750 !important;
        box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.06) !important;
}

:deep(.petcon-search-control input::placeholder) {
        color: #737b85 !important;
        font-weight: 700 !important;
        opacity: 1 !important;
}

:deep(.petcon-search-control input:focus) {
        border-color: var(--petcon-gold) !important;
        box-shadow:
                0 0 0 3px rgba(245, 181, 27, 0.14),
                inset 0 1px 2px rgba(15, 23, 42, 0.05) !important;
}

/* Tab buttons */
:deep([role='tablist']) {
        padding: 0.26rem;
        border: 1px solid rgba(255, 255, 255, 0.11);
        border-radius: 0.85rem;
        background: rgba(3, 4, 5, 0.42);
        box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.25);
}

:deep([role='tab']) {
        min-height: 2.35rem;
        color: rgba(255, 255, 255, 0.6) !important;
        border-radius: 0.62rem !important;
        font-weight: 850 !important;
        transition:
                color 0.2s ease,
                background 0.2s ease,
                transform 0.2s ease,
                box-shadow 0.2s ease;
}

:deep([role='tab']:hover) {
        color: #ffffff !important;
        background: rgba(245, 181, 27, 0.09) !important;
}

:deep([role='tab'][aria-selected='true']),
:deep([role='tab'].active),
:deep([role='tab'].selected) {
        color: #17130a !important;
        background: linear-gradient(135deg, #ffd153, var(--petcon-gold)) !important;
        box-shadow:
                0 8px 18px rgba(245, 181, 27, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.48);
}

/* CourseCard color overrides */
.petcon-course-link :deep(*) {
        filter: none !important;
}

.petcon-course-link :deep(h1),
.petcon-course-link :deep(h2),
.petcon-course-link :deep(h3),
.petcon-course-link :deep(h4),
.petcon-course-link :deep(.font-semibold),
.petcon-course-link :deep(.font-medium),
.petcon-course-link :deep(.text-lg),
.petcon-course-link :deep(.text-base) {
        color: var(--petcon-text) !important;
        opacity: 1 !important;
}

.petcon-course-link :deep(p),
.petcon-course-link :deep(.text-sm),
.petcon-course-link :deep(.text-xs),
.petcon-course-link :deep(.text-ink-gray-5),
.petcon-course-link :deep(.text-ink-gray-6),
.petcon-course-link :deep(.text-ink-gray-7),
.petcon-course-link :deep(.text-gray-500),
.petcon-course-link :deep(.text-gray-600),
.petcon-course-link :deep(.text-slate-500),
.petcon-course-link :deep(.text-slate-600) {
        color: var(--petcon-muted) !important;
        opacity: 1 !important;
}

.petcon-course-link :deep(svg),
.petcon-course-link :deep(.lucide),
.petcon-course-link :deep(.text-ink-gray-4),
.petcon-course-link :deep(.text-ink-gray-5) {
        color: var(--petcon-muted) !important;
        stroke: currentColor !important;
        opacity: 1 !important;
}

.petcon-course-link :deep(.text-yellow-500),
.petcon-course-link :deep(.text-amber-500),
.petcon-course-link :deep([class*='yellow']),
.petcon-course-link :deep([class*='amber']) {
        color: #c88a00 !important;
        opacity: 1 !important;
}

.petcon-course-link :deep(.border-t),
.petcon-course-link :deep([class*='border']) {
        border-color: var(--petcon-border) !important;
}

.petcon-course-link :deep(a),
.petcon-course-link :deep(.text-blue-500),
.petcon-course-link :deep(.text-blue-600),
.petcon-course-link :deep([class*='blue']) {
        color: #a66f00 !important;
        opacity: 1 !important;
        font-weight: 850 !important;
}

.petcon-course-link :deep(.badge),
.petcon-course-link :deep([class*='badge']),
.petcon-course-link :deep([class*='Badge']),
.petcon-course-link :deep([class*='green']) {
        color: #17130a !important;
        border: 1px solid rgba(245, 181, 27, 0.45) !important;
        border-radius: 999px !important;
        background: rgba(245, 181, 27, 0.92) !important;
        font-weight: 900 !important;
}

.petcon-course-link :deep(a[href*='certification']),
.petcon-course-link :deep(a[href*='Certification']),
.petcon-course-link :deep([class*='certification']),
.petcon-course-link :deep([class*='Certification']) {
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        min-height: 1.5rem;
        padding: 0.14rem 0.58rem !important;
        color: #17130a !important;
        border: 1px solid rgba(245, 181, 27, 0.48) !important;
        border-radius: 999px !important;
        background: rgba(245, 181, 27, 0.18) !important;
        font-size: 0.7rem !important;
        font-weight: 950 !important;
        line-height: 1 !important;
        text-decoration: none !important;
}

/* Dark-theme integration
 *
 * Different LMS builds place the dark marker on html, body, #app, or another
 * wrapper. Supporting all common locations keeps the complete inner canvas,
 * cards, empty states, and topbar dark.
 */
:global(html.dark) .petcon-courses-page,
:global(html[data-theme='dark']) .petcon-courses-page,
:global(body.dark) .petcon-courses-page,
:global(body[data-theme='dark']) .petcon-courses-page,
:global(#app.dark) .petcon-courses-page,
:global(#app[data-theme='dark']) .petcon-courses-page,
:global(.dark-theme) .petcon-courses-page,
:global(.frappe-dark) .petcon-courses-page,
:global(.dark) .petcon-courses-page,
:global([data-theme='dark']) .petcon-courses-page {
        --petcon-page-bg: #0a0c0e;
        --petcon-surface: #171b20;
        --petcon-surface-raised: #20262d;
        --petcon-text: #f4f5f6;
        --petcon-muted: #aeb5bd;
        --petcon-border: rgba(255, 255, 255, 0.11);
        --petcon-shadow: rgba(0, 0, 0, 0.34);

        color-scheme: dark;
        background:
                radial-gradient(circle at 14% 4%, rgba(245, 181, 27, 0.085), transparent 20rem),
                linear-gradient(180deg, #070809 0%, #0d1013 100%) !important;
}

:global(html.dark) .petcon-topbar,
:global(html[data-theme='dark']) .petcon-topbar,
:global(body.dark) .petcon-topbar,
:global(body[data-theme='dark']) .petcon-topbar,
:global(#app.dark) .petcon-topbar,
:global(#app[data-theme='dark']) .petcon-topbar,
:global(.dark-theme) .petcon-topbar,
:global(.frappe-dark) .petcon-topbar,
:global(.dark) .petcon-topbar,
:global([data-theme='dark']) .petcon-topbar {
        color: #f4f5f6 !important;
        background: #070809 !important;
        border-bottom-color: rgba(245, 181, 27, 0.18) !important;
}

:global(html.dark) :deep(.petcon-search-control input),
:global(html[data-theme='dark']) :deep(.petcon-search-control input),
:global(body.dark) :deep(.petcon-search-control input),
:global(body[data-theme='dark']) :deep(.petcon-search-control input),
:global(#app.dark) :deep(.petcon-search-control input),
:global(#app[data-theme='dark']) :deep(.petcon-search-control input),
:global(.dark-theme) :deep(.petcon-search-control input),
:global(.frappe-dark) :deep(.petcon-search-control input),
:global(.dark) :deep(.petcon-search-control input),
:global([data-theme='dark']) :deep(.petcon-search-control input) {
        color: #f5f6f7 !important;
        border-color: rgba(245, 181, 27, 0.24) !important;
        background: #151a1f !important;
}

:global(html.dark) :deep(.petcon-search-control input::placeholder),
:global(html[data-theme='dark']) :deep(.petcon-search-control input::placeholder),
:global(body.dark) :deep(.petcon-search-control input::placeholder),
:global(body[data-theme='dark']) :deep(.petcon-search-control input::placeholder),
:global(#app.dark) :deep(.petcon-search-control input::placeholder),
:global(#app[data-theme='dark']) :deep(.petcon-search-control input::placeholder),
:global(.dark-theme) :deep(.petcon-search-control input::placeholder),
:global(.frappe-dark) :deep(.petcon-search-control input::placeholder),
:global(.dark) :deep(.petcon-search-control input::placeholder),
:global([data-theme='dark']) :deep(.petcon-search-control input::placeholder) {
        color: #9da5ae !important;
}

@keyframes petconFadeUp {
        from {
                opacity: 0;
                transform: translateY(12px);
        }
        to {
                opacity: 1;
                transform: translateY(0);
        }
}

@keyframes petconSpin {
        to {
                transform: rotate(360deg);
        }
}

@keyframes petconPulse {
        0%,
        100% {
                opacity: 0.55;
                transform: scale(0.9);
        }
        50% {
                opacity: 1;
                transform: scale(1.08);
        }
}

@media (max-width: 1150px) {
        .petcon-academy-hero {
                grid-template-columns: 1fr;
        }

        .petcon-hero-copy {
                padding-right: 0;
        }

        .petcon-discovery-panel {
                width: 100%;
        }
}

@media (max-width: 760px) {
		.petcon-topbar {
			gap: 0.75rem;
		}

		.petcon-topbar :deep(.breadcrumbs) {
			min-width: 0;
			overflow: hidden;
		}

        .petcon-courses-page {
                padding: 1rem 1rem 2.5rem;
        }

        .petcon-academy-hero {
                min-height: auto;
                padding: 1.35rem;
                border-radius: 0.35rem 1.5rem 0.35rem 1.5rem;
        }

        .petcon-brand-lockup {
                margin-bottom: 1.4rem;
        }

        .petcon-title {
                font-size: clamp(2rem, 9vw, 2.65rem);
                line-height: 1.02;
        }

        .petcon-filter-row {
                grid-template-columns: 1fr;
        }

        .petcon-cert-toggle {
                width: 100%;
        }

        .petcon-panel-heading,
        .petcon-section-heading {
                align-items: flex-start;
                flex-direction: column;
        }

        .petcon-result-count {
                align-self: flex-start;
        }
}

@media (max-width: 520px) {
		.petcon-title {
			letter-spacing: -0.045em;
		}

		.petcon-subtitle {
			margin-top: 1rem;
			line-height: 1.55;
		}

		.petcon-capability-row {
			margin-top: 1.15rem;
		}

        .petcon-capability-row {
                display: grid;
                grid-template-columns: 1fr;
        }

        .petcon-capability {
                width: 100%;
        }

        .petcon-discovery-panel {
                padding: 0.9rem;
                border-radius: 1.1rem 0.3rem 1.1rem 0.3rem;
        }

        .petcon-live-indicator {
                display: none;
        }

        .petcon-course-grid {
                gap: 1rem;
        }
}

/* Use two compact rows on wider phones while keeping 360px devices readable. */
@media (min-width: 391px) and (max-width: 520px) {
	.petcon-capability-row {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.petcon-capability:last-child {
		grid-column: span 2;
	}
}
</style>
