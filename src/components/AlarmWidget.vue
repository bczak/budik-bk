<template>
	<div class="widget alarm" v-bind:class="{fullscreen: isFullscreen}" @click="toggleFullscreen()"></div>
</template>

<script>
export default {
	name: 'AlarmWidget',
	computed: {
		isFullscreen() {
			return this.fullscreen === 'alarm'
		}
	},
	updated() {
		console.log(this.fullscreen)
	},
	props: {
		fullscreen: String
	},
	methods: {
		toggleFullscreen() {
			if (this.fullscreen === 'alarm') {
				this.$emit('fullscreen', null)
			} else {
				this.$emit('fullscreen', 'alarm')
			}
		}
	}
}
</script>

<style scoped>

</style>
