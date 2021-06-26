<template>
	<div class="container home-grid">
		<TimeWidget :fullscreen="fullscreen" v-on:fullscreen="setFullscreen"/>
		<AlarmWidget ref="alarmWidget" :fullscreen="fullscreen" v-on:fullscreen="setFullscreen"/>
		<MusicWidget :fullscreen="fullscreen" v-on:fullscreen="setFullscreen"/>
		<PanelWidget/>
	</div>
</template>

<script>
import PanelWidget from '@/components/PanelWidget'
import TimeWidget from '@/components/TimeWidget'
import AlarmWidget from '@/components/AlarmWidget'
import MusicWidget from '@/components/MusicWidget'

export default {
	name: 'Home',
	components: {MusicWidget, AlarmWidget, PanelWidget, TimeWidget},
	data: () => ({
		fullscreen: ''
	}),
	methods: {
		setFullscreen(e) {
			this.fullscreen = e
		}
	}
}
</script>
