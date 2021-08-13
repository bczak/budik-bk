<template>
	<div class="panel">
		<q-slider
			v-if="slider"
			:model-value="volume"
			:value="volume"
			class="slider"
			@change="updateVolume"
			:min="0"
			:max="100"
			color="white"
			:step="5"
			label-color="black"
		/>
		<div v-else class="icons">
			<q-icon color="white" @click="showSlider" class="icon" :name="volumeIcon" />
		</div>
	
	</div>
</template>

<script>
import { subscribeForVolume, updateVolume } from '../api'

export default {
	name: 'PanelWidget',
	computed: {
		volumeIcon() {
			return this.volume > 60 ? 'volume_up' : this.volume > 30 ? 'volume_down' : this.volume > 0 ? 'volume_mute' : 'volume_off'
		}
	},
	data: () => ({
		volume: 60,
		slider: false,
		timeout: null
	}),
	mounted() {
		subscribeForVolume((e) => {
			this.showSlider();
			this.volume = e.exists ? e.data().value : 60
		})
	},
	methods: {
		showSlider() {
			this.slider = true
			this.timeout = setTimeout(() => {
				this.slider = false
				this.timeout = null
			}, 3000)
		},
		updateVolume(val) {
			if (this.timeout !== null) {
				clearTimeout(this.timeout)
			}
			updateVolume(val)
			this.timeout = setTimeout(() => {
				this.slider = false
				this.timeout = null
			}, 3000)
		}
	}
}
</script>

<style scoped>

.panel {
	border-radius: 15px;
	background: #303F9F;
	position: absolute;
	width: 760px;
	height: 60px;
	left: 10px;
	bottom: 10px;
}

.slider {
	color: white;
	background: rgba(0, 0, 0, 0);
	height: 60px;
}

.icons {
	display: flex;
	flex-direction: row;
	padding: 8px;
}

.icon {
	font-size: 3em;
}
</style>
