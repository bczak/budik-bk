import Vue from 'vue'
import App from './App.vue'
import VueTouchKeyboard from 'vue-touch-keyboard'
import router from './router'
import './styles/index.css'
import './styles/fonts/material-icons.css'
import './quasar'

import 'vue-touch-keyboard/dist/vue-touch-keyboard.css' // load default style

import VueYouTubeEmbed from 'vue-youtube-embed'

Vue.use(VueTouchKeyboard)
Vue.use(VueYouTubeEmbed, { global: true })

new Vue({
	router,
	render: (h) => h(App)
}).$mount('#app')
