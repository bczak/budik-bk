<template>
	<div class="item">
		<q-icon @click="play" name="play_arrow" color="white" class="item-play" />
		<q-icon :name="video.liked ? 'favorite' : 'favorite_border'" :color="video.liked? 'red' : 'white'" class="item-like" @click="like" />
		<div class="item-title">{{ video.snippet.title }}</div>
	</div>
</template>

<script>
export default {
	props: {
		video: Object
	},
	name: 'Video',
	methods: {
		play() {
			this.$emit('play', this.video)
		},
		like() {
			if (this.video.liked) {
				this.$emit('dislike', this.video)
			} else {
				this.$emit('like', this.video)
			}
		}
	}
}
</script>

<style scoped>

.item {
	width: calc(100% - 80px);
	margin: 10px;
	border-radius: 15px;
	overflow: hidden;
	position: relative;
	padding: 15px;
	background: rgba(0, 0, 0, 0.4);
	color: white;
	display: flex;
	align-items: center;
}

.item-like, .item-play {
	font-size: 30px;
	margin: 0 20px 0 0;
}

.item-play{
	font-size: 40px;
}


</style>
