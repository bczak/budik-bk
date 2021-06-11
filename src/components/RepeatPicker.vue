<template>
  <div>
    <div class="repeat-picker">
      <div v-for="(day, i) in days" :key="day" class="day" v-bind:class="{selected: repeat[i] === '1'}"
           @click="() => select(i)">{{ day }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RepeatPicker',
  props: {
    repeat: String
  },
  data: () => ({ days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }),
  methods: {
    select(i) {
      let repeat = this.repeat.toString().split('')
      repeat[i] = repeat[i] === '1' ? '0' : '1'
      this.$emit('change', repeat.join(''))
    }
  }
}
</script>

<style scoped>
.repeat-picker {
  border-radius: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 15px 15px 75px
}

.day {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  background: #444;
  color: white;
  text-align: center;
  padding: 12px 0;
  font-size: 20px;
}

.selected {
  background: #0088cc;
  color: black;
}
</style>
