<template>
	<div class="widget alarms" v-bind:class="{fullscreen: isFullscreen}" @click="openFull">
		<span v-if="isFullscreen" class="close material-icons" @click="closeFull">close</span>
		<div class="alarms">
			<div class="alarm" v-for="alarm in alarms" :key="alarm.id">
				<span
					class="alarm-icon material-icons"
					v-bind:class="{active: alarm.status}"
					@click="toggleAlarm(alarm.id, !alarm.status)">alarm</span>
				<span class="divider"></span>
				<span class="time" @click="setTime(alarm.id)">{{ alarm.time }}</span>
			</div>
		</div>
	</div>
</template>

<script>

import { setAlarm, subscribeForAlarms } from '@/api'

export default {
	name: 'AlarmWidget',
	components: {  },
	computed: {
		isFullscreen() {
			return this.fullscreen === 'alarm'
		}
	},
	props: {
		fullscreen: String
	},
	data: () => ({
		alarms: [],
		listeners: []
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
				this.alarms.push({ ...item.data(), id: item.id })
			})
			this.sortAlarmsByTime()
		},
		toggleAlarm(id, status) {
			if (!this.isFullscreen) return
			setAlarm(id, status)
		},
		setTime(id) {
			if (!this.isFullscreen) return
			console.log(id)
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
			this.$emit('fullscreen', null)
		}
	}
}
</script>

<style scoped>
.widget.alarms {
	background-color: #4995be;

}

.close {
	font-size: 50px;
	position: absolute;
	margin: 10px;
	top: 0;
	color: rgba(0, 0, 0, 0.5);
}

.alarms {
	overflow: hidden;
	display: flex;
	flex-direction: column;
	padding: 1px;
	transition: all .3s;
}

.alarm {
	display: flex;
	flex-direction: row;
	align-items: center;
	font-size: 35px;
	margin: 1px 10px;
	color: #eee;
	transition: all .3s;
}

.fullscreen .alarm {
	padding: 20px 20px;
	font-size: 50px;
	transition: all .3s;
	margin: 5px 10px;
	color: white;
	border-radius: 15px;
	background: rgba(0, 0, 0, 0.3);
}

.fullscreen .alarm-icon {
	font-size: 45px;
	transition: all .3s;

}

.fullscreen .divider {
	height: 50px;
	margin: 0 20px
}

.alarm-icon {
	font-size: 32px;
	margin-top: -2px;
	color: #444;
	transition: all .3s;

}

.divider {
	height: 28px;
	margin: 0 8px;
	border: 2px solid orangered;
	border-radius: 2px;
}

.alarm-icon.active {
	color: white
}

.fullscreen > .alarms {
	padding: 50px;
	transition: all .3s;
	overflow-y: scroll;
}
</style>
