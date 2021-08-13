<template>
	<div class="event" :class="{'event-fullscreen': fullscreen}">
		<div v-if="fullscreen" class="event-wrapper event-fullscreen">
			<div class="event-color" :class="`color-${event.color}`" @click="selectColor"></div>
			<div class="event-content">
				<div class="event-title" @click="changeTitle">{{ event.title || 'Event' }}</div>
				<div class="event-duration" @click="showStartModal">Start: {{ startFull }}</div>
				<div class="event-duration" @click="showEndModal">End: {{ endFull }}</div>
			</div>
			<div class="event-actions">
				<q-icon name="delete" @click="deleteEvent" class="event-action event-action-delete" color="red" />
			</div>
			<ColorPicker :selected="event.color" v-if="colorModal" @change="changeColor" />
			<q-dialog v-model="titleModal" full-height full-width persistent>
				<div class="keyboard">
					<q-input class="label-input" outlined v-model="editTitle" type="text" placeholder="Text input" @focus="show" />
					<div class="buttons">
						<q-btn class="button cancel" @click="resetTitle" rounded>Cancel</q-btn>
						<q-btn class="button save" @click="updateTitle" rounded>Save</q-btn>
					</div>
					<SimpleKeyboard @onChange="onChangeTitle" @onKeyPress="onKeyPress" :input="editTitle" />
				</div>
			</q-dialog>
			<q-dialog v-model="dateTimeModalStart" full-height full-width persistent>
				<DateTimeSelector :datetime="datetimeStart" />
			</q-dialog>
			<q-dialog v-model="dateTimeModalStart" full-height full-width persistent>
				<DateTimeSelector :datetime="datetimeEnd" />
			</q-dialog>
		</div>
	</div>
</template>

<script>
import { DateTime } from 'luxon'
import ColorPicker from './ColorPicker'
import { deleteEvent, updateEvent } from '../api'
import SimpleKeyboard from './SimpleKeyboard'
import DateTimeSelector from './DateTimeSelector'

export default {
	name: 'Event',
	components: { DateTimeSelector, ColorPicker, SimpleKeyboard },
	props: {
		fullscreen: Boolean,
		event: Object
	},
	data() {
		return {
			colorModal: false,
			keyboard: null,
			titleModal: false,
			keyboardClass: 'simple-keyboard',
			editTitle: null,
			dateTimeModalStart: false,
			dateTimeModalEnd: false
		}
	},
	mounted() {
		this.editTitle = this.event.title
	},
	computed: {
		datetimeStart() {
			return DateTime.fromISO(this.event.start || new Date().toISOString()).toFormat('YYYY-MM-DD HH:mm')
		},
		datetimeEnd() {
			return DateTime.fromISO(this.event.end || new Date().toISOString()).toFormat('YYYY-MM-DD HH:mm')
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
		showEndModal() {
			this.dateTimeModalEnd = true
		},
		showStartModal() {
			console.log('here')
			this.dateTimeModalStart = true
		},
		changeTitle() {
			this.titleModal = true
		},
		onChangeTitle(title) {
			this.editTitle = title
		},
		resetTitle() {
			this.titleModal = false
			this.editTitle = this.event.title
		},
		updateTitle() {
			updateEvent({ ...this.event, title: this.editTitle })
			this.event.title = this.editTitle
			this.titleModal = false
		},
		show(e) {
			this.input = e.target
		},
		onKeyPress() {
		
		},
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
	justify-content: flex-end;
}

.event-action {
	font-size: 50px;
}

.keyboard {
	background: white;
	border-radius: 15px;
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
	width: 90px;
	height: 90px;
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
	color: #e8e8e8;
}

.label-input {
	margin: 10px;
	background: white;
	overflow: hidden;
	border-radius: 15px;
	font-size: 22px;
}

.simple-keyboard {
	bottom: 10px;
	margin: 5px;
	background: #0d1921;
	width: calc(100% - 10px);
}

.keyboard {
	background: #0d1921;
}
</style>
