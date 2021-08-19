<template>
  <div class="wrapper">
    <div class="alarm" :key="alarm.id">
		<span
      class="alarm-icon material-icons"
      v-bind:class="{disable: !alarm.status}"
      @click="toggleAlarm(!alarm.status)">alarm</span>
      <span class="divider"></span>
      <span class="time" @click="setTime()">{{ alarm.time }}</span>
      <span class="label" v-bind:class="{'label-hover': !alarm.label}" @click="setLabel()">{{
          alarm.label || 'Label'
        }}</span>
      <q-dialog v-model="labelModal" full-height full-width persistent>
        <div class="keyboard">
          <q-input class="label-input" outlined v-model="editAlarm.label" type="text" placeholder="Text input"
                   @focus="show" />
          <div class="buttons">
            <q-btn class="button cancel" @click="resetLabel" rounded>Cancel</q-btn>
            <q-btn class="button save" @click="updateLabel" rounded>Save</q-btn>
          </div>
          <SimpleKeyboard @onChange="onChange" @onKeyPress="onKeyPress" :input="editAlarm.label" />
        </div>
      </q-dialog>
      <q-icon name="delete" @click="deleteAlarm()" color="red" class="delete" />
      <q-dialog v-model="timeModal" full-height>
        <q-time :value="editAlarm.time" @input="(value) => editAlarm.time = value" format24h>
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn class="button" label="Cancel" color="primary" @click="reset" flat v-close-popup />
            <q-btn class="button" label="OK" color="primary" @click="updateTime" v-close-popup />
          </div>
        </q-time>
      </q-dialog>
    </div>
    <RepeatPicker :repeat="alarm.parsedRepeat" @change="(repeat) => updateRepeat(repeat)" />
  </div>
</template>

<script>
import { setAlarm, updateAlarm, deleteAlarm } from '@/api'
import SimpleKeyboard from '@/components/SimpleKeyboard'
import RepeatPicker from '@/components/RepeatPicker'
import { stringifyRepeat } from '@/utils'

export default {
  name: 'Alarm',
  components: { RepeatPicker, SimpleKeyboard },
  props: {
    alarm: Object
  },
  data: () => ({
    timeModal: false,
    repeatModal: false,
    labelModal: false,
    editAlarm: {},
    keyboardClass: 'simple-keyboard',
    keyboard: null
  }),
  mounted() {
    this.editAlarm = JSON.parse(JSON.stringify(this.alarm))
  },
  updated() {
  },
  methods: {
    onChange(text) {
      this.editAlarm.label = text
    },
    onKeyPress(button) {
      console.log(button)
      if (button === '{bksp}') this.editAlarm.label = this.editAlarm.label.substring(0, -1)
    },
    toggleAlarm(status) {
      if (!this.$parent['isFullscreen']) return
      setAlarm(this.alarm.id, status)
    },
    reset() {
      this.editAlarm = this.alarm
    },
    setSound() {
    
    },
    show(e) {
      this.input = e.target
    },
    updateLabel() {
      updateAlarm(this.editAlarm)
      this.labelModal = false
    },
    resetLabel() {
      this.editAlarm = this.alarm
      this.labelModal = false
    },
    setTime() {
      if (!this.$parent['isFullscreen']) return
      this.timeModal = true
    },
    repeatToDays(repeat) {
      if (repeat === '1111111') {
        return 'Every day'
      }
      if (repeat === '0000000') {
        return 'Once'
      }
      let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      return repeat.split('').map((item, index) => item === '1' ? days[index] : '0').filter(day => day !== '0').join(', ')
    },
    setLabel() {
      this.labelModal = true
    },
    updateTime() {
      updateAlarm(this.editAlarm)
    },
    setRepeat(repeat) {
      this.repeatModal = true
      if (repeat) {
        this.editAlarm.parsedRepeat = repeat
      }
    },
    deleteAlarm() {
      this.$emit('delete', JSON.parse(JSON.stringify(this.alarm)))
      deleteAlarm(this.alarm.id)
    },
    updateRepeat(repeat) {
      this.editAlarm.parsedRepeat = repeat
      this.editAlarm.repeat = stringifyRepeat(repeat)
      updateAlarm({ ...this.editAlarm })
    }
  }
  
}
</script>

<style scoped>
.alarm {
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: all .3s;
  overflow: hidden;
}

.wrapper {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  margin: 10px 0;
}

.divider {
  border: 2px solid #0088cc;
  height: 30px;
  border-radius: 2px;
  margin: 0 10px;
}

.fullscreen .alarm {
  padding: 10px;
  transition: all .3s;
}

.fullscreen .divider {
  height: 35px;
}

.repeat {
  margin: 0 10px;
}

.disable {
  color: grey;
}

.days {
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 91px;
  text-align: right;
  margin-top: 20px;
}

.button {
  min-width: 70px;
  border-radius: 15px;
}

.time {
  min-width: 120px;
}

.label {
  flex-grow: 2;
  margin-top: 10px;
  margin-right: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 25px;
}

.label-hover {
  color: grey;
}

.delete {
  justify-self: end;
}

.keyboard {
  background: white;
  border-radius: 15px;
}

.sound {
  color: #1DB954;
  margin: 0 10px
}

.label-input {
  margin: 10px;
  background: white;
  overflow: hidden;
  border-radius: 15px;
  font-size: 22px;
}

.simple-keyboard {
  bottom: 10px;
  margin: 5px;
  background: #0d1921;
  width: calc(100% - 10px);
}

.keyboard {
  background: #0d1921;
}

</style>
