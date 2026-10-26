import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'

export function useScreenSize() {
	const getViewportSize = () => {
		// WebViews can expose a desktop-sized layout viewport through
		// `innerWidth` while the visible viewport is phone-sized. Use the
		// smaller value so the LMS always selects its mobile shell on phones.
		const visualViewport = window.visualViewport
		const width = visualViewport
			? Math.min(window.innerWidth, visualViewport.width)
			: window.innerWidth
		const height = visualViewport
			? Math.min(window.innerHeight, visualViewport.height)
			: window.innerHeight

		return { width, height }
	}

	const viewport = getViewportSize()
	const size = reactive({
		width: viewport.width,
		height: viewport.height,
	})

	const onResize = () => {
		const viewport = getViewportSize()
		size.width = viewport.width
		size.height = viewport.height
	}

	onMounted(() => {
		window.addEventListener('resize', onResize)
		window.addEventListener('orientationchange', onResize)
		window.visualViewport?.addEventListener('resize', onResize)
	})

	onUnmounted(() => {
		window.removeEventListener('resize', onResize)
		window.removeEventListener('orientationchange', onResize)
		window.visualViewport?.removeEventListener('resize', onResize)
	})

	return size
}
// write a composable for detecting swipe gestures in mobile devices
export function useSwipe() {
	const swipe = reactive({
		initialX: null,
		initialY: null,
		currentX: null,
		currentY: null,
		diffX: null,
		diffY: null,
		absDiffX: null,
		absDiffY: null,
		direction: null,
	})

	const onTouchStart = (e) => {
		swipe.initialX = e.touches[0].clientX
		swipe.initialY = e.touches[0].clientY
		swipe.direction = null
		swipe.diffX = null
		swipe.diffY = null
		swipe.absDiffX = null
		swipe.absDiffY = null
	}

	const onTouchMove = (e) => {
		swipe.currentX = e.touches[0].clientX
		swipe.currentY = e.touches[0].clientY

		swipe.diffX = swipe.initialX - swipe.currentX
		swipe.diffY = swipe.initialY - swipe.currentY

		swipe.absDiffX = Math.abs(swipe.diffX)
		swipe.absDiffY = Math.abs(swipe.diffY)
	}

	const onTouchEnd = (e) => {
		let { diffX, diffY, absDiffX, absDiffY } = swipe
		if (absDiffX > absDiffY) {
			if (diffX > 0) {
				swipe.direction = 'left'
			} else {
				swipe.direction = 'right'
			}
		} else {
			if (diffY > 0) {
				swipe.direction = 'up'
			} else {
				swipe.direction = 'down'
			}
		}
	}

	onMounted(() => {
		window.addEventListener('touchstart', onTouchStart)
		window.addEventListener('touchend', onTouchEnd)
		window.addEventListener('touchmove', onTouchMove)
	})

	onUnmounted(() => {
		window.removeEventListener('touchstart', onTouchStart)
		window.removeEventListener('touchend', onTouchEnd)
		window.removeEventListener('touchmove', onTouchMove)
	})

	return swipe
}

export function useLocalStorage(key, initialValue) {
	let value = ref(null)
	let storedValue = localStorage.getItem(key)
	value.value = storedValue ? JSON.parse(storedValue) : initialValue

	watch(value, (newValue) => {
		localStorage.setItem(key, JSON.stringify(newValue))
	})
	return value
}
