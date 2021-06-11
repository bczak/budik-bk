<template>
  <div class="widget music" v-bind:class="{fullscreen: isFullscreen}" @click="toggleFullscreen()">
    <div v-if="!isFullscreen">
      <q-icon name="audiotrack" class="music-icon" />
    </div>
  </div>
</template>

<script>
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
  methods: {
    toggleFullscreen() {
      if (this.fullscreen === 'music') {
        this.$emit('fullscreen', null)
      } else {
        this.$emit('fullscreen', 'music')
      }
    }
  }
}
</script>

<style scoped>

.widget.music {
  background-color: #1DB954;
  width: 180px;
  height: 180px;
  transition: all .3s;
  z-index: 1;
  top: 200px;
  position: absolute;
  right: 10px;
  left: calc(800px - 180px - 30px);
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
  color: #222;
  font-size: 100px;
  margin: 35px;
  transition: all .3s;
}
</style>

