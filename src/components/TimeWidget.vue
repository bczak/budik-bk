<template>
	<div class="widget time" v-bind:class="{fullscreen: isFullscreen}" @click="toggleFullscreen()"></div>
</template>

<script>
export default {
	name: 'TimeWidget',
	computed: {
		isFullscreen() {
			return this.fullscreen === 'time'
		}
	},
	props: {
		fullscreen: String
	},
	methods: {
		toggleFullscreen() {
			if (this.fullscreen === 'time') {
				this.$emit('fullscreen', null)
			} else {
				this.$emit('fullscreen', 'time')
			}
		}
	}
}
</script>

<style scoped>

</style>
