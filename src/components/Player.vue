<template>
	<div id="player" class="" v-if="video.id">
		<div class="control" v-if="isReady">
			<q-icon name="skip_previous" @click="previous" color="white" class="icon icon-previous" />
			<q-icon @click="play" :name="playing ? 'pause' : 'play_arrow'" color="white" class="icon icon-play" />
			<q-icon name="skip_next" @click="next" color="white" class="icon icon-next" />
			<div class="label-box">
				<!--double text for correct animation-->
				<span class="label label-title">{{ video.snippet.title }} {{ video.snippet.title }}</span>
			</div>
			<q-icon :name="repeat !== 1 ? 'repeat' : 'repeat_one'" @click="handleRepeat" :color="repeat === 0 ? 'grey' : 'white'" class="icon icon-next" />
		</div>
		<youtube :video-id="video.id" class="hidden" @ready="ready" />
	</div>
</template>

<script>


export default {
	components: {},
	name: 'Player',
	data: () => ({
		video: {},
		isReady: false,
		player: null,
		playing: false,
		title: '',
		repeat: 0 // 0 = none, 1 = repeat one, -1 = repeat all
	}),
	mounted() {
		console.log('player mounted')
	},
	updated() {
		console.log('updated')
		console.log(this.video.id)
	},
	methods: {
		load(video) {
			console.log(video)
			this.video = video
			if (this.isReady) this.play()
		},
		ready(t) {
			console.log('ready')
			this.isReady = true
			this.player = t.target
			this.play()
		},
		handleRepeat() {
			switch (this.repeat) {
				case 0:
					this.repeat = 1
					break
				case 1:
					this.repeat = -1
					break
				case -1:
					this.repeat = 0
					break
			}
		},
		next() {
		
		},
		previous() {
		
		},
		play() {
			if (this.playing) {
				this.player.pauseVideo()
				this.playing = false
			} else {
				this.player.playVideo()
				this.playing = true
			}
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

.control {
	transition: .3s all;
	display: flex;
	flex-direction: row;
	padding: 15px;
}

.icon {
	font-size: 70px;
}

.label-box {
	width: 350px;
	overflow: hidden;
	margin-left: 20px;
}

.label {
	color: #cee;
	font-size: 45px;
	word-wrap: break-word;
	white-space: nowrap;
	overflow: hidden;
	display: inline-block;
	font-family: monospace;
	animation: text-moving 15s linear infinite;
}

@keyframes text-moving {
	from {
		transform: translate(0);
	}
	to {
		transform: translate(-50%);
	}
}
</style>
