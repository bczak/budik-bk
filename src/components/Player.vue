<template>
	<div id="player" class="" v-if="video.id">
		<div class="control" v-if="isReady">
			<button @click="play">play</button>
			<button @click="pause">pause</button>
		</div>
		<youtube :video-id="video.id" class="hidden" @ready="ready"/>
	</div>
</template>

<script>


export default {
	components: {},
	name: 'Player',
	data: () => ({
		video: {},
		isReady: false,
		player: null
	}),
	mounted() {
		console.log('mounted')
	},
	updated() {
		console.log('updated')
	},
	methods: {
		load(video) {
			console.log(video)
			this.video = video
		},
		ready(t) {
			this.isReady = true
			this.player = t.target
		},
		play() {
			this.player.playVideo()
		},
		pause() {
			this.player.pauseVideo()
		}
	}
}
</script>

<style scoped>
#player {
	border-radius: 15px;
	height: 100px;
	margin: 10px 70px 10px 10px;
	background: rgba(0, 0, 0, .4);
}
</style>
