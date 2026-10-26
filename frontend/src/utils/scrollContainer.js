export function scrollTo(...options) {
	if (!options || options.length === 0) return
	const container = getScrollContainer()
	if (!container) return
	container.scrollTo(...options)
}

export function getScrollContainer() {
	// Older layouts exposed this through a global that is no longer assigned.
	// Resolve the current layout's scrolling element directly instead.
	return window.scrollContainer || document.getElementById('scrollContainer')
}
