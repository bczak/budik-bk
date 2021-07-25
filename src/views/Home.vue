<template>
	<div class="container home-grid">
		<TimeWidget :fullscreen="fullscreen" v-on:fullscreen="setFullscreen" />
		<AlarmWidget :fullscreen="fullscreen" :next-time="next[0]" v-on:fullscreen="setFullscreen" />
		<MusicWidget :fullscreen="fullscreen" v-on:fullscreen="setFullscreen" />
		<SettingsWidget :fullscreen="fullscreen" v-on:fullscreen="setFullscreen" />
		<CalendarWidget :fullscreen="fullscreen" v-on:fullscreen="setFullscreen"/>
		<PanelWidget />
	</div>
</template>

<script>
import PanelWidget from '../components/PanelWidget'
import TimeWidget from '../components/TimeWidget'
import AlarmWidget from '../components/AlarmWidget'
import MusicWidget from '../components/MusicWidget'
import SettingsWidget from '../components/SettingsWidget'
import CalendarWidget from '../components/CalendarWidget'

export default {
	name: 'Home',
	components: { CalendarWidget, SettingsWidget, MusicWidget, AlarmWidget, PanelWidget, TimeWidget },
	data: () => ({
		fullscreen: '',
		next: [] // todo subscribe for next
	}),
	methods: {
		setFullscreen(e) {
			this.fullscreen = e
		}
	}
}
</script>

