<template>
  <div :class="keyboardClass"></div>
</template>

<script>
import Keyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'

const layout = {
  default: [
    '1 2 3 4 5 6 7 8 9 0 {bksp}',
    'q w e r t y u i o p [ ] \\',
    'a s d f g h j k l ; \'',
    '{shift} z x c v b n m , . /',
    '{space}'
  ],
  shift: [
    '~ ! @ # $ % ^ & * ( ) _ + - = {bksp}',
    'Q W E R T Y U I O P { } |',
    'A S D F G H J K L : "',
    '{shift} Z X C V B N M < > ?',
    '{space}'
  ]
}
export default {
  name: 'SimpleKeyboard',
  props: {
    keyboardClass: {
      default: 'simple-keyboard'
    },
    input: {
      type: String
    }
  },
  data: () => ({
    keyboard: null
  }),
  mounted() {
    this.keyboard = new Keyboard(this.keyboardClass, {
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      layout: layout
    })
  },
  methods: {
    onChange(input) {
      this.$emit('onChange', input)
    },
    onKeyPress(button) {
      this.$emit('onKeyPress', button)
      
      /**
       * If you want to handle the shift and caps lock buttons
       */
      if (button === '{shift}' || button === '{lock}') this.handleShift()
    },
    handleShift() {
      let currentLayout = this.keyboard.options.layoutName
      let shiftToggle = currentLayout === 'default' ? 'shift' : 'default'
      
      this.keyboard.setOptions({
        layoutName: shiftToggle
      })
    }
  },
  watch: {
    input(input) {
      this.keyboard.setInput(input)
    }
  }
}
</script>

<style>
.hg-theme-default .hg-button {
  height: 56px !important;
  border-radius: 15px;
  font-size: 20px;
}
</style>
