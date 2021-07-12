<template>
	<div class="widget time" v-bind:class="{fullscreen: isFullscreen}" @click="toggleFullscreen()">
		<div class="content date">
			<div class="data day">{{ date.day }}</div>
			<div class="data date">{{ date.date }}</div>
			<div class="data month">{{ date.month }}</div>
			<div class="data year">{{ date.year }}</div>
		</div>
		<div class="content time">
			{{ time }}
		</div>
	</div>
</template>

<script>
import {DateTime} from 'luxon'

export default {
	name: 'TimeWidget',
	data: () => ({
		time: '00:00',
		date: {
			month: '06',
			day: 'Wed',
			date: '01',
			year: '2021'
		}
	}),
	computed: {
		isFullscreen() {
			return this.fullscreen === 'time'
		}
	},
	mounted() {
		setInterval(() => this.updateTimeAndDate(), 300)
	},
	props: {
		fullscreen: String
	},
	methods: {
		updateTimeAndDate() {
			let now = DateTime.local()
			this.time = now.toFormat('T')
			this.date = {
				date: now.toFormat('dd'),
				day: now.toFormat('ccc'),
				year: now.year,
				month: now.toFormat('LL')
			}
		},

		toggleFullscreen() {
			if (this.fullscreen === 'time') {
				this.$emit('fullscreen', null)
			} else {
				this.$emit('fullscreen', 'time')
			}
		}
	}
}
</script>

<style scoped>
* {
	color: white;
}

.widget.time {
	display: flex;
	flex-direction: row;
	transition: all .3s;
	flex-wrap: nowrap;
	background: #1f8cd2;
	width: 570px;
	height: 180px;
	top: 10px;
	left: 10px;
	z-index: 0;
}

.widget.time.fullscreen {
	flex-wrap: nowrap;
	position: absolute;
	transition: all .3s;
	top: 0;
	border-radius: 15px;
	left: 0;
	z-index: 10;
	height: 460px;
	width: 780px;
}

.fullscreen > .content.time {
	font-size: 17em;
	transition: all .3s;
	margin-left: 0;
	text-align: center;
}

.fullscreen > .content.date {
	margin: 0;
	position: absolute;
	padding: 35px;
}

.content.time {
	text-align: center;
	height: 100%;
	font-size: 9em;
	margin-top: -10px;
	padding: 0 20px;
	width: 100%;
	transition: all .3s;
	margin-left: 150px;
}

.content.date {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-content: flex-start;
	flex-wrap: wrap;
	margin: 35px;
	line-height: 35px;
	position: absolute;
	bottom: 0;
}

.data.day {
	font-family: "Rubik Mono One", monospace;
	width: 100%;
	font-size: 2.1em;
	text-transform: uppercase;
}

.data.year {
	width: 100%;
	color: darkgreen;
	font-size: 2.3em;
}

.data.month {
	color: gold;
}

.data.date, .data.month {
	font-size: 2.3em;
}
</style>
