<template>
	<div class="panel" v-bind:class="{fullscreen: isFullscreen}">
		<div v-if="isFullscreen">
			<div class="time">{{ time }}</div>
			<q-btn rounded class="stop" @click="stop">STOP</q-btn>
		</div>
		<div v-else>
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
				<span class="icon">{{ temperature }} °C</span>
			</div>
		</div>
	
	</div>
</template>

<script>
import {
	subscribeForNext,
	subscribeForTemperature,
	subscribeForVolume,
	updateNextAlarm, updateNextEvent,
	updateVolume
} from '../api'
import { DateTime } from 'luxon'
import sound from '../assets/mixkit-security-facility-breach-alarm-994.wav'

export default {
	name: 'PanelWidget',
	components: {},
	computed: {
		volumeIcon() {
			return this.volume > 60 ? 'volume_up' : this.volume > 30 ? 'volume_down' : this.volume > 0 ? 'volume_mute' : 'volume_off'
		},
		isFullscreen() {
			return this.fullscreen === 'panel'
		}
	},
	props: {
		fullscreen: String
	},
	data: () => ({
		volume: 60,
		slider: false,
		timeout: null,
		temperature: '?',
		alarms: [],
		time: '',
		sound: null
	}),
	mounted() {
		this.sound = new Audio(sound)
		this.sound.addEventListener('ended', () => {
			this.sound.currentTime = 0;
			this.sound.play()
		}, true);
		this.sound.loop = true
		this.sound.volume = this.volume / 100
		
		subscribeForVolume((e) => {
			this.showSlider()
			this.volume = e.exists ? e.data().value : 60
			this.sound.volume = this.volume / 100
		})
		subscribeForTemperature((e) => {
			this.temperature = e.exists ? e.data().value : '?'
		})
		setInterval((e) => {
			e.checkAlarm()
		}, 2000, this)
		subscribeForNext(e => {
			this.alarms = []
			let alarms = e.docs.map(e => ({ id: e.id, data: e.data() })).map(e => {
				return (e.data.times || []).map(t => ({ id: e.id, time: t }))
			})
			alarms = [].concat.apply([], alarms).sort((a, b) => a.time > b.time ? 1 : -1)
			alarms.forEach(e => this.alarms.push(e))
			
		})
	},
	methods: {
		showSlider() {
			this.slider = true
			if (this.timeout) {
				clearTimeout(this.timeout)
			}
			this.timeout = setTimeout(() => {
				this.slider = false
				this.timeout = null
			}, 3000)
		},
		stop() {
			this.time = ''
			this.$emit('fullscreen', null)
			this.sound.pause()
		},
		async checkAlarm() {
			if (this.alarms.length === 0) return
			for(let alarm of this.alarms) {
				let now = DateTime.now()
				let time = DateTime.fromISO(alarm.time)
				console.log(time.toISO());
				console.log(now.toISO());
				console.log(alarm.time);
				if (now.toISO() > time.toISO()) {
					console.log('alarm');
					this.$emit('fullscreen', 'panel')
					this.sound.play()
					if (alarm.id.includes('alarm')) {
						await updateNextAlarm(alarm.id.split('_')[1])
					} else {
						await updateNextEvent(alarm.id.split('_')[1])
					}
					this.time = time.toFormat('T')
				}
			}
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

.stop {
	position: fixed;
	bottom: 60px;
	width: 300px;
	left: 250px;
	font-size: 50px;
	background: #ef6c00
}

.panel.fullscreen {
	position: absolute;
	top: 0;
	width: 780px;
	height: 460px;
	left: 0;
	
}


.slider {
	color: white;
	background: rgba(0, 0, 0, 0);
	height: 60px;
}

div.time {
	color: white;
	font-size: 180px;
	margin-top: 20px;
	text-align: center;
}

.icons {
	display: flex;
	flex-direction: row;
	padding: 8px;
	justify-content: space-between;
}

.icon {
	font-size: 3em;
}

span.icon {
	margin: -10px 10px;
	color: white
}
</style>
