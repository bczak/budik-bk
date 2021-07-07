<template>
	<div class="widget music" v-bind:class="{fullscreen: isFullscreen}" @click="openFull">
		<q-icon v-if="isFullscreen" @click="closeFull" class="close" name="close" />
		<q-icon v-if="isFullscreen" @click="search" class="search" name="search" />
		<div v-if="!isFullscreen">
			<q-icon name="audiotrack" class="music-icon" />
		</div>
		<div v-else class="items">
			<div class="item" v-for="video in videos" :key="video.id">
				{{ video.snippet.title }}
			</div>
		</div>
	</div>
</template>

<script>
import { fetchVideos } from '../api'

export default {
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
				this.$emit('fullscreen', 'music')
				let result = await fetchVideos(null)
				if (result === null) return
				this.pageToken = result.nextPageToken || null
				this.videos = result.items
				console.log(this.videos[0])
			}
		},
		closeFull() {
			this.$emit('fullscreen', null)
		},
		search() {
			console.log('here')
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
}

.music-icon {
	color: #fff;
	font-size: 100px !important;
	margin: 30px;
	transition: all .3s;
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

.item {
	width: 215px;
	height: 150px;
	border: 1px solid rgba(0, 0, 0, 0.5);
	padding: 10px;
	margin: 10px;
	border-radius: 15px;
}
</style>

