<template>
	<q-dialog :value="true" persistent>
		<q-card dark>
			<div class="colors">
				<div class="color" v-for="color in colors" :key="color" @click="() => $emit('change', color)" :class="`color-${color}`">
					<div class="selected" v-if="color === selected">
						<q-icon name="done" />
					</div>
				</div>
			</div>
		</q-card>
	</q-dialog>
</template>

<script>
export default {
	name: 'ColorPicker',
	props: {
		selected: String
	},
	data: () => ({
		colors: ['tomato', 'lavender', 'sage', 'grape', 'flamingo', 'banana', 'tangerine', 'peacock', 'graphite', 'blueberry', 'basil']
	}),
}
</script>

<style scoped>

.color {
	width: 100px;
	height: 100px;
}

.colors {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	width: 500px;
}
.selected  {
	background: rgba(0,0,0,0.4);
	width: 100%;
	height: 100%;
	font-size: 3em;
	text-align: center;
	padding: 15px 0
}
</style>
