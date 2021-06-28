<template>
	<div class="widget settings" v-bind:class="{fullscreen: isFullscreen}" @click="toggleFullscreen()">
		<div v-if="!isFullscreen">
			<q-icon name="settings" class="settings-icon" />
		</div>
		<div v-else>
		
		</div>
	</div>
</template>

<script>
export default {
	name: 'SettingsWidget',
	computed: {
		isFullscreen() {
			return this.fullscreen === 'settings'
		}
	},
	props: {
		fullscreen: String
	},
	methods: {
		toggleFullscreen() {
			if (this.fullscreen === 'settings') {
				this.$emit('fullscreen', null)
			} else {
				this.$emit('fullscreen', 'settings')
			}
		}
	}
}
</script>

<style scoped>

.widget.settings {
	background-color: #717874;
	width: 180px;
	height: 180px;
	transition: all .3s;
	z-index: 0;
	top: 200px;
	position: absolute;
	left: 10px;
}

.widget.settings.fullscreen {
	right: 0;
	left: 0;
	top: 0;
	border-radius: 15px !important;
	position: absolute;
	height: 460px;
	width: 780px;
	transition: all .3s;
	z-index: 10;
}

.settings-icon {
	color: #eee;
	font-size: 100px;
	margin: 35px;
	transition: all .3s;
}
</style>
