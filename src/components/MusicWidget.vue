<template>
	<div class="widget music" v-bind:class="{fullscreen: isFullscreen}" @click="toggleFullscreen()"></div>
</template>

<script>
export default {
	name: 'MusicWidget',
	computed: {
		isFullscreen() {
			return this.fullscreen === 'music'
		}
	},
	props: {
		fullscreen: String
	},
	methods: {
		toggleFullscreen() {
			if (this.fullscreen === 'music') {
				this.$emit('fullscreen', null)
			} else {
				this.$emit('fullscreen', 'music')
			}
		}
	}
}
</script>

<style scoped>
.music.widget {
	background-color: #1DB954;
}
</style>
