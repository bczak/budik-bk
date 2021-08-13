<template>
	<div class="widget calendar" ref="events" v-bind:class="{fullscreen: isFullscreen}" >
		<div v-if="isFullscreen">
			<q-icon @click="closeFull" class="close" name="close" />
			<q-icon @click="addEvent" class="add" name="add_circle_outline" />
			<div class="events">
				<Event :fullscreen="isFullscreen" v-for="event in slicedEvents" :key="event.id" :event="event" />
			</div>
		</div>
		<div v-if="!isFullscreen">
			<q-icon name="event" class="event-icon" @click="openFull"/>
		</div>
	</div>
</template>

<script>
import Event from './Event'
import { createEvent, subscribeForEvents } from '../api'
import { DateTime } from 'luxon'

export default {
	name: 'CalendarWidget',
	components: { Event },
	props: {
		fullscreen: String
	},
	computed: {
		isFullscreen() {
			return this.fullscreen === 'calendar'
		},
		slicedEvents() {
			return this.isFullscreen ? this.events : this.events.slice(0, 3)
		}
	},
	data: () => ({
		events: []
	}),
	mounted() {
		subscribeForEvents((data) => this.updateEvents(data))
	},
	methods: {
		updateEvents(data) {
			this.events = data.docs.map(e => ({
				...e.data(),
				id: e.id
			}))
		},
		openFull(e) {
			console.log('open')
			
			if (!e.target.className.split(' ').includes('close')) {
				this.$emit('fullscreen', 'calendar')
			}
		},
		async addEvent() {
			await createEvent({
				start: DateTime.now().minus({ hour: 1 }).toISO(),
				end: DateTime.now().plus({ hour: 1 }).toISO(),
				title: 'Event',
				color: 'tomato'
			})
		},
		closeFull() {
			console.log('close')
			this.$emit('fullscreen', null);
		}
	}
}
</script>

<style>

.widget.calendar {
	background: #393635;
	width: 190px;
	height: 180px;
	z-index: 1;
	top: 200px;
	left: 390px;
	transition: all .3s;
	overflow: hidden;
	padding: 0;
}

.widget.calendar.fullscreen {
	top: 0;
	left: 0;
	position: absolute;
	width: 780px;
	height: 460px;
}

.events {
	padding: 20px;
	margin-right: 70px;
	display: flex;
	flex-direction: column;
	overflow-y: scroll;
	height: 480px;
}

.event-icon {
	color: white;
	font-size: 100px !important;
	position: absolute;
	top: 45px;
	left: 45px
}
</style>
