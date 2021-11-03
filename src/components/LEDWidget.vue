<template>
	<div class="widget led" :style="{background: '#' + hexColor }" v-bind:class="{fullscreen: isFullscreen}">
		<div v-if="isFullscreen">
			<q-icon @click="closeFull" class="close" name="close" />
			<color-picker class="picker-box" v-bind="color" @input="onInput" @change="onChange" initially-collapsed="true" />
		
		</div>
		<div v-if="!isFullscreen">
			<q-icon name="flourescent" class="led-icon" @click="openFull" />
		</div>
	</div>
</template>

<script>
import { setColor } from '../api'
import ColorPicker from '@radial-color-picker/vue-color-picker'

function hsvToHex(hsv) {
	function hsvToRgb(hsv) {
		var h = hsv.h / 60
		var s = hsv.s / 100
		var v = hsv.v / 100
		var i = Math.floor(h)
		var f = h - i
		var p = v * (1 - s)
		var q = v * (1 - f * s)
		var t = v * (1 - (1 - f) * s)
		var mod = i % 6
		var r = [v, q, p, p, t, v][mod]
		var g = [t, v, v, q, p, p][mod]
		var b = [p, p, t, v, v, q][mod]
		return {
			r: Math.round(r * 255),
			g: Math.round(g * 255),
			b: Math.round(b * 255)
		}
	}
	
	var rgb = hsvToRgb(hsv)
	
	function rgbToHex(rgb) {
		var hex = ''
		hex += ('0' + Number(rgb.r).toString(16)).slice(-2)
		hex += ('0' + Number(rgb.g).toString(16)).slice(-2)
		hex += ('0' + Number(rgb.b).toString(16)).slice(-2)
		return hex
	}
	
	return rgbToHex(rgb)
}

function hexToHsv(color) {
	const r = parseInt(color.substring(0, 2), 16) / 255
	const g = parseInt(color.substring(2, 4), 16) / 255
	const b = parseInt(color.substring(4, 6), 16) / 255
	
	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	let h, s, v = max
	const d = max - min
	s = max === 0 ? 0 : d / max
	if (max === min) {
		h = 0 // achromatic
	} else {
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			case b:
				h = (r - g) / d + 4
				break
		}
		h /= 6
	}
	return [h, s, v]
}

export default {
	components: { ColorPicker },
	name: 'ledWidget',
	computed: {
		isFullscreen() {
			return this.fullscreen === 'led'
		}
	},
	props: {
		fullscreen: String
	},
	data: () => ({
		hexColor: '000000',
		color: {
			hue: 50,
			saturation: 100,
			luminosity: 50,
			alpha: 1
		}
	}),
	mounted() {
	},
	methods: {
		async randomColor() {
			this.hexColor = Math.floor(Math.random() * 16777215).toString(16)
			await setColor(hexToHsv(this.hexColor)[0] * 360)
		},
		async offColor() {
			this.hexColor = '000000'
			await setColor(0)
		},
		async openFull(e) {
			if (!e.target.className.split(' ').includes('close')) {
				if (this.isFullscreen) return
				this.$emit('fullscreen', 'led')
			}
		},
		onInput(e) {
			this.hexColor = hsvToHex({ h: e, s: 100, v: 100 })
			setColor(e)
		},
		onChange() {
			this.offColor()
		},
		closeFull() {
			this.$emit('fullscreen', null)
		}
	}
}
</script>

<style>
@import '~@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';

.widget.led {
	width: 180px;
	height: 180px;
	transition: all .3s;
	z-index: 1;
	top: 200px;
	position: absolute;
	right: 10px;
	left: 10px;
}

.picker-box {
	width: 420px;
	height: 420px;
	margin: 15px 170px
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

</style>

