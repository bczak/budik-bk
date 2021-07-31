<template>
	<div class="event" :class="{'event-fullscreen': fullscreen}">
		<div v-if="fullscreen" class="event-wrapper event-fullscreen">
			<div class="event-color" :class="`color-${event.color}`" @click="selectColor"></div>
			<div class="event-content">
				<div class="event-title">{{ event.title || 'Event' }}</div>
				<div class="event-duration">{{ startFull }} - {{ endFull }}</div>
			</div>
			<div class="event-actions">
				<q-icon name="delete" @click="deleteEvent" class="event-action event-action-delete" color="red" />
				<q-icon name="notifications_active" class="event-action event-action-reminder" color="green" />
			</div>
			<ColorPicker :selected="event.color" v-if="colorModal" @change="changeColor" />
		</div>
		<div v-else class="event-wrapper">
			<div class="event-color" :class="`color-${event.color}`"></div>
			<div class="event-content">
				<div class="event-title">{{ event.title || 'Event' }}</div>
				<div class="event-duration">{{ startTime }} - {{ long ? endRelative : endTime }}</div>
			</div>
		</div>
	</div>
</template>

<script>
import { DateTime } from 'luxon'
import ColorPicker from './ColorPicker'
import { deleteEvent, updateEvent } from '../api'

export default {
	name: 'Event',
	components: { ColorPicker },
	props: {
		fullscreen: Boolean,
		event: Object
	},
	data() {
		return {
			colorModal: false
		}
	},
	computed: {
		startTime() {
			return DateTime.fromISO(this.event.start || new Date().toISOString()).toFormat('T')
		},
		endTime() {
			return DateTime.fromISO(this.event.end || new Date().toISOString()).toFormat('T')
		},
		endRelative() {
			return DateTime.fromISO(this.event.end || new Date().toISOString()).toRelative()
		},
		startFull() {
			return DateTime.fromISO(this.event.start || new Date().toISOString()).toFormat('LLL d, T')
		},
		endFull() {
			return DateTime.fromISO(this.event.end || new Date().toISOString()).toFormat('LLL d, T')
		},
		long() {
			return DateTime.fromISO(this.event.end || new Date().toISOString())
				.diff(DateTime.fromISO(this.event.start || new Date().toISOString()), ['days']).toObject().days >= 1
		}
	},
	methods: {
		selectColor() {
			this.colorModal = true
		},
		changeColor(color) {
			this.colorModal = false
			updateEvent({ ...this.event, color: color })
		},
		deleteEvent() {
			deleteEvent(this.event.id)
		}
	}
}
</script>

<style scoped>

.event {
	margin: 0 0 18px;
	width: 100%
}

.event-fullscreen.event {
	border: 1px solid rgba(0, 0, 0, 0.3);
	border-radius: 15px;
	padding: 10px 10px;
	background: rgba(0, 0, 0, 0.2);
}

.event-actions {
	display: flex;
	flex-direction: row;
	width: 120px;
	justify-content: space-between;
}

.event-action {
	font-size: 50px;
}

.event-wrapper {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}


.event-color {
	width: 5px;
	height: 40px;
	border-radius: 5px;
}

.event-fullscreen .event-color {
	width: 60px;
	height: 60px;
	border-radius: 7px;
}

.event-content {
	margin: 0 8px;
	color: white
}

.event-fullscreen .event-content {
	margin: 0 8px;
	color: white;
	font-size: 20px;
	flex-grow: 2;
}

.event-fullscreen .event-title {
	font-size: 1.3em;
}


.event-title {
	text-transform: capitalize;
}

.event-duration {
	color: #ccc;
}

</style>
