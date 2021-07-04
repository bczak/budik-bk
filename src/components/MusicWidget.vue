<template>
	<div class="widget music" v-bind:class="{fullscreen: isFullscreen}" @click="openFull">
		<q-icon v-if="isFullscreen" @click="closeFull" class="close" name="close"></q-icon>
		<div v-if="!isFullscreen">
			<q-icon name="audiotrack" class="music-icon" />
		</div>
		<div v-else>
		
		</div>
	</div>
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
		openFull(e) {
			if (!e.target.className.split(' ').includes('close')) {
				this.$emit('fullscreen', 'music')
			}
		},
		closeFull() {
			this.$emit('fullscreen', null)
		},
		play() {
		
		}
	}
}
</script>

<style scoped>

.widget.music {
	background-color: #34A853;
	width: 180px;
	height: 180px;
	transition: all .3s;
	z-index: 1;
	top: 200px;
	position: absolute;
	right: 10px;
	left: calc(20px + 180px);
}

.widget.music.fullscreen {
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

.music-icon {
	color: #fff;
	font-size: 100px;
	margin: 35px;
	transition: all .3s;
}


.close {
	font-size: 50px;
	position: fixed;
	margin: 30px;
	top: 0;
	right: 0;
	color: rgba(0, 0, 0, 0.7);
}
</style>

