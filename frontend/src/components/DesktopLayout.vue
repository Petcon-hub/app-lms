<template>
	<div class="flex h-[100dvh] min-h-0 text-base bg-surface-white">
		<aside
			class="sticky top-0 h-[100dvh] min-h-0 flex-shrink-0 overflow-hidden hover:overflow-y-auto"
		>
			<AppSidebar />
		</aside>
		<main class="min-w-0 w-full min-h-0 overflow-auto" id="scrollContainer">
			<slot />
		</main>
	</div>
</template>
<script setup>
import AppSidebar from './AppSidebar.vue'
</script>
