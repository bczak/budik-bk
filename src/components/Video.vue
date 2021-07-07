<template>
	<div class="item" @click="play">
		<img :src="video.snippet.thumbnails.high.url" class="item-image" alt="image" />
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
		}
	}
}
</script>

<style scoped>

.item {
	width: 215px;
	height: 120px;
	margin: 10px;
	border-radius: 15px;
	overflow: hidden;
	position: relative;
}

.item-image {
	width: 100%;
	margin-top: -20px;
}

.item-title {
	position: absolute;
	bottom: 0;
	color: white;
	background: rgba(0, 0, 0, 0.7);
	padding: 5px;
	width: 100%;
}

</style>
