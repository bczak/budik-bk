<template>
	<div class="widget alarms" ref="alarms" v-bind:class="{fullscreen: isFullscreen}" @click="openFull">
		<q-icon v-if="isFullscreen" @click="closeFull" class="close" name="close"></q-icon>
		<q-icon v-if="isFullscreen" @click="addAlarm" class="add" name="add_circle_outline"></q-icon>
		<div v-if="isFullscreen" class="items">
			<Alarm v-for="alarm in alarms" :key="alarm.id" :alarm="alarm" @delete="saveForUndo"/>
		</div>
		<div v-if="!isFullscreen">
			<q-icon name="alarm" class="alarm-icon"/>
			<q-item-label class="next-time">{{ nextTime }}</q-item-label>
		</div>
	</div>
</template>

<script>

import {createAlarm, subscribeForAlarms} from '@/api'
import Alarm from '@/components/Alarm'
import {DateTime} from 'luxon'
import {parseRepeat} from "@/utils";

export default {
	name: 'AlarmWidget',
	components: {Alarm},
	computed: {
		isFullscreen() {
			return this.fullscreen === 'alarm'
		},
		nextTime() {
			let dayOfWeek = DateTime.local().weekday - 1;
			return this.alarms.filter(al => al.status && al.parsedRepeat[dayOfWeek] === '1').map(al => al.time).sort()[0]
		}
	},
	props: {
		fullscreen: String
	},
	data: () => ({
		alarms: [],
		listeners: [],
		saved: null
	}),
	mounted() {
		this.listeners.push(subscribeForAlarms((data) => this.update(data)))
	},
	unmounted() {
		for (let listener of this.listeners) {
			listener()
		}
	},
	methods: {
		/**
		 * Method to update alarms widget
		 * @param {firebase.firestore.QuerySnapshot<DocumentData>} data
		 */
		update(data) {
			this.alarms = []
			data.docs.forEach((item) => {
				let alarm = item.data()
				alarm.parsedRepeat = parseRepeat(alarm.repeat)
				this.alarms.push({...alarm, id: item.id})
			})
			this.sortAlarmsByTime()
		},
		saveForUndo(alarm) {
			this.saved = alarm;
			setTimeout(() => {
				this.saved = null
			}, 5500)
			this.$q.notify({
				progress: true,
				timeout: 4000,
				message: 'Alarm was deleted',
				multiLine: false,
				actions: [
					{label: 'Undo', color: 'yellow', handler: () => createAlarm(this.saved)}
				]
			})
		},
		addAlarm() {
			createAlarm({time: DateTime.local().toFormat('T'), status: true, repeat: 0, label: ''})
		},
		sortAlarmsByTime() {
			this.alarms = this.alarms.sort((a, b) => {
				return (a.time > b.time) ? 1 : -1
			})
		},
		openFull(e) {
			if (!e.target.className.split(' ').includes('close')) {
				this.$emit('fullscreen', 'alarm')
			}
		},
		closeFull() {
			this.$refs['alarms'].scrollTo(0, 0)
			this.$emit('fullscreen', null)
		}
	}
}
</script>

<style scoped>
.widget.alarms {
	background: #5d4037;
	width: 180px;
	height: 180px;
	z-index: 1;
	top: 10px;
	right: 10px;
	left: 590px;
	transition: all .3s;
	overflow: hidden;
}

.widget.alarms.fullscreen {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 460px;
	overflow: auto;
	width: 780px;
	z-index: 10;
	transition: all .3s;
}

.close {
	font-size: 50px;
	position: fixed;
	margin: 30px;
	top: 0;
	right: 0;
	color: rgba(255, 255, 255, 0.9);
}

.add {
	font-size: 50px;
	position: fixed;
	margin: 30px;
	bottom: 0;
	right: 0;
	color: rgba(255, 255, 255, 1);
	transition: all .3s;
}


.items {
	display: flex;
	flex-direction: column;
	color: white;
	font-size: 29px;
	padding-left: 5px;
}

.fullscreen .items {
	padding: 5px 80px 5px 10px;
	font-size: 40px;
}

.alarm-icon {
	color: white;
	font-size: 100px;
	margin: 25px 35px 0;
	transition: all .3s;
}
.next-time {
	color: white;
	font-size: 35px;
	text-align: center;

}
</style>
