<template>
	<div class="widget music" v-bind:class="{fullscreen: isFullscreen}">
		<div v-if="isFullscreen">
			<q-icon @click="closeFull" class="close" name="close" />
			<q-icon @click="search" class="search" name="search" />
			<div class="items">
				<Video @play="play" @like="like" @dislike="dislike" v-for="video in videos" :key="video.id" :video="video" />
				<div class="item-next item" v-if="pageToken">Next</div>
			</div>
		</div>
		<div v-if="!isFullscreen">
			<q-icon name="audiotrack" class="music-icon" @click="openFull" />
		</div>
	</div>
</template>

<script>
import { dislike, fetchVideos, getLikes, like } from '../api'
import Video from './Video'

export default {
	components: { Video },
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
		pageToken: null,
		likes: [],
		player: {
			video: null
		}
	}),
	async mounted() {
		this.likes = await getLikes()
	},
	methods: {
		async openFull(e) {
			if (!e.target.className.split(' ').includes('close')) {
				if (this.isFullscreen) return
				this.$emit('fullscreen', 'music')
				let result = await fetchVideos(null)
				if (result === null) return
				console.log(result)
				this.pageToken = result.nextPageToken || null
				this.videos = result.items.map(e => {
					e.liked = this.likes.includes(e.id)
					return e
				})
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
		},
		async like(video) {
			await like(video.id)
			this.videos = this.videos.map(e => e.id === video.id ? { ...e, liked: true } : e)
			this.likes.push(video.id)
		},
		async dislike(video) {
			await dislike(video.id)
			this.videos = this.videos.map(e => e.id === video.id ? { ...e, liked: false } : e)
			this.likes = this.likes.filter(e => e !== video.id)
			
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
	padding: 30px;
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

