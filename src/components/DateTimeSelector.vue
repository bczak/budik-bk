<template>
	<div class="selector">
		<q-date class="date" square dark flat v-model="editDatetime" mask="YYYY-MM-DD HH:mm" color="purple" />
		<q-time class="time" square flat dark v-model="editDatetime" mask="YYYY-MM-DD HH:mm" format24h color="purple" />
		<div class="buttons">
			<span class="label">{{ label }}</span>
			<q-btn color="blue" class="btn" @click="() => $emit('update', editDatetime)">Save</q-btn>
			<q-btn color="red" class="btn" @click="cancel">Cancel</q-btn>
		</div>
	</div>
</template>

<script>
export default {
	name: 'DateTimeSelector',
	data() {
		return {
			editDatetime: ''
		}
	},
	props: {
		datetime: String,
		label: String
	},
	mounted() {
		console.log(this.datetime)
		this.editDatetime = this.datetime
	},
	methods: {
		cancel() {
			this.$emit('cancel')
		}
	}
}
</script>

<style scoped>

.selector {
	display: flex;
	flex-direction: row;
	background: #1d1d1d;
	border-radius: 15px;
	min-height: 430px;
}

.date, .time {
	margin-right: 10px;
}

.buttons {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}

.btn {
	width: 120px;
}
.label {
	color: white
}

</style>
