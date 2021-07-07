<template>
	<div class="widget music" v-bind:class="{fullscreen: isFullscreen}" @click="openFull">
		<q-icon v-if="isFullscreen" @click="closeFull" class="close" name="close" />
		<q-icon v-if="isFullscreen" @click="search" class="search" name="search" />
		<Player ref="player" class="player" key="player" :class="{hidden: !isFullscreen}" />
		<div v-if="!isFullscreen">
			<q-icon name="audiotrack" class="music-icon" />
		</div>
		<div v-else class="items">
			<Video @play="play" v-for="video in videos" :key="video.id" :video="video" />
		</div>
	</div>
</template>

<script>
import { fetchVideos } from '../api'
import Video from './Video'
import Player from './Player'

export default {
	components: { Video, Player },
	name: 'MusicWidget',
	computed: {
		isFullscreen() {
			return this.fullscreen === 'music'
		}
	},
	props: {
		fullscreen: String
	},
	data: () => ({
		videos: [],
		pageToken: null
	}),
	methods: {
		async openFull(e) {
			if (!e.target.className.split(' ').includes('close')) {
				if (this.isFullscreen) return
				this.$emit('fullscreen', 'music')
				let result = await fetchVideos(null)
				if (result === null) return
				this.pageToken = result.nextPageToken || null
				this.videos = result.items
			}
		},
		closeFull() {
			this.$emit('fullscreen', null)
		},
		search() {
			console.log('here')
		},
		play(video) {
			this.$refs.player.load(video)
		}
	}
}
</script>

<style>

.widget.music {
	background-color: #34A853;
	width: 180px;
	height: 180px;
	transition: all .3s;
	z-index: 1;
	top: 200px;
	position: absolute;
	right: 10px;
	left: calc(20px + 180px);
}

.widget.music.fullscreen {
	right: 0;
	left: 0;
	top: 0;
	border-radius: 15px !important;
	position: absolute;
	height: 460px;
	width: 780px;
	transition: all .3s;
	z-index: 10;
	overflow-y: scroll;
}

.music-icon {
	color: #fff;
	font-size: 100px !important;
	margin: 30px;
	transition: all .3s;
}

.player {
	flex-grow: 3;
}


.close, .search {
	font-size: 50px !important;
	position: fixed !important;
	margin: 30px;
	top: 0;
	right: 0;
	color: rgba(0, 0, 0, 0.7);
}

.search {
	top: auto;
	bottom: 0;
}

.items {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}

</style>

