<template>
	<div class="selector">
		<q-date v-model="editDatetime" mask="YYYY-MM-DD HH:mm" color="purple" />
		<q-time v-model="editDatetime" mask="YYYY-MM-DD HH:mm" color="purple" />
		
	</div>
</template>

<script>
export default {
	name: 'DateTimeSelector',
	data() {
		return {
			editDatetime: '',
		}
	},
	props: {
		datetime: String
	},
	mounted() {
		this.editDatetime = this.datetime
	}
}
</script>

<style scoped>

.selector {
	display: flex;
	flex-direction: row;
	
}
</style>
