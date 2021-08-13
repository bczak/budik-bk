<template>
	<div class="widget led" :style="{background: '#' + hexColor }" v-bind:class="{fullscreen: isFullscreen}">
		<div v-if="isFullscreen">
			<q-icon @click="closeFull" class="close" name="close" />
			<span class="title">Use rotary button to change color</span>
		</div>
		<div v-if="!isFullscreen">
			<q-icon name="flourescent" class="led-icon"  @click="openFull" />
		</div>
	</div>
</template>

<script>

import { setButtonMode, subscribeForLEDColor } from '../api'

export default {
	components: {  },
	name: 'ledWidget',
	computed: {
		isFullscreen() {
			return this.fullscreen === 'led'
		},
		hexColor() {
			return this.color.toString(16).padStart(6, '0')
		}
	},
	props: {
		fullscreen: String
	},
	data: () => ({
		color: 8388608
	}),
	mounted() {
		subscribeForLEDColor((e) => {
			this.color = e.exists ? e.data().value : 0
		})
	},
	methods: {
		async openFull(e) {
			if (!e.target.className.split(' ').includes('close')) {
				if (this.isFullscreen) return
				this.$emit('fullscreen', 'led')
				await setButtonMode('led')
			}
		},
		closeFull() {
			this.$emit('fullscreen', null)
			setButtonMode('volume')
		},
	}
}
</script>

<style>

.widget.led {
	width: 180px;
	height: 180px;
	transition: all .3s;
	z-index: 1;
	top: 200px;
	position: absolute;
	right: 10px;
	left: calc(20px + 180px);
}

.widget.led.fullscreen {
	right: 0;
	left: 0;
	top: 0;
	border-radius: 15px !important;
	position: absolute;
	height: 460px;
	width: 780px;
	transition: all .3s;
	z-index: 10;
	overflow-y: scroll;
}


span.title {
	color: white;
	background: black;
	padding: 10px;
	position: fixed;
	font-size: 30px;
	top: 200px;
	left: 150px;
	border-radius: 15px;
}

.led-icon {
	color: #fff;
	font-size: 100px !important;
	padding: 35px;
	transition: all .3s;
}

.close {
	font-size: 50px !important;
	position: fixed !important;
	margin: 30px;
	top: 0;
	right: 0;
	color: white !important;
	background-color: black;
	border-radius: 30px;
}

.search {
	top: auto;
	bottom: 0;
}

.items {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}

</style>

