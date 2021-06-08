<template>
	<div class="alarm" :key="alarm.id">
		<span
			class="alarm-icon material-icons"
			v-bind:class="{disable: !alarm.status}"
			@click="toggleAlarm(!alarm.status)">alarm</span>
		<span class="divider"></span>
		<span class="time" @click="setTime()">{{ alarm.time }}</span>
		<span class="label" v-bind:class="{'label-hover': !alarm.label}" @click="setLabel()">{{
				alarm.label || 'Label'
			}}</span>
		<span class="days" @click="setLabel()">{{ repeatToDays(alarm.parsedRepeat) }}</span>
		<q-dialog v-model="labelModal">
			<Keyboard class="key" :layouts="[
    '1234567890{delete:backspace}|qwertyuiop|asdfghjkl|{shift:goto:1}zxcvbnm|{space:space}{custom:custom}',
    '!@#$%^&*(){delete:backspace}|QWERTYUIOP|ASDFGHJKL|{shift:goto:0}ZXCVBNM|{space:space}{custom:custom}'
  ]"/>
		</q-dialog>
		<q-icon name="history" @click="setRepeat()" color="gold" class="repeat"/>
		<q-icon name="delete" @click="deleteAlarm()" color="red" class="delete"/>
		<q-dialog v-model="timeModal" full-height>
			<q-time :value="editAlarm.time" @input="(value) => editAlarm.time = value" format24h>
				<div class="row items-center justify-end q-gutter-sm">
					<q-btn class="button" label="Cancel" color="primary" @click="reset" flat v-close-popup/>
					<q-btn class="button" label="OK" color="primary" @click="updateTime" v-close-popup/>
				</div>
			</q-time>
		</q-dialog>
	</div>
</template>

<script>
import {setAlarm, updateAlarm, deleteAlarm} from '@/api'
import Keyboard from 'vue-keyboard'

export default {
	name: "Alarm",
	components: {Keyboard},
	props: {
		alarm: Object
	},
	data: () => ({
		timeModal: false,
		labelModal: false,
		editAlarm: {}
	}),
	mounted() {
		this.editAlarm = JSON.parse(JSON.stringify(this.alarm))
	},
	methods: {
		toggleAlarm(status) {
			if (!this.$parent["isFullscreen"]) return;
			setAlarm(this.alarm.id, status)
		},
		reset() {
			this.editAlarm = this.alarm;
		},
		setTime() {
			if (!this.$parent["isFullscreen"]) return;
			this.timeModal = true
		},
		repeatToDays(repeat) {
			if (repeat === '1111111') {
				return 'Every day'
			}
			if (repeat === '0000000') {
				return 'Once'
			}
			let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			return repeat.split('').map((item, index) => item === '1' ? days[index] : '0').filter(day => day !== '0').join(', ')
		},
		setLabel() {
			this.labelModal = true
		},
		updateTime() {
			updateAlarm(this.editAlarm)
		},
		setRepeat() {

		},
		deleteAlarm() {
			this.$emit('delete', JSON.parse(JSON.stringify(this.alarm)))
			deleteAlarm(this.alarm.id)
		}
	}

}
</script>

<style scoped>
.alarm {
	display: flex;
	flex-direction: row;
	align-items: center;
	transition: all .3s;
}

.divider {
	border: 2px solid #0088cc;
	height: 30px;
	border-radius: 2px;
	margin: 0 10px;
}

.fullscreen .alarm {
	border-radius: 15px;
	background: rgba(0, 0, 0, 0.5);
	padding: 10px;
	margin: 10px 0;
	transition: all .3s;
}

.fullscreen .divider {
	height: 35px;
}

.repeat {
	margin: 0 10px;
}

.disable {
	color: grey;
}

.days {
	font-size: 20px;
}

.button {
	width: 70px;
}

.time {
	min-width: 120px;
}

.label {
	flex-grow: 2;
	text-overflow: ellipsis;
}

.label-hover {
	color: grey;
}

.delete {
	justify-self: end;
}
</style>