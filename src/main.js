import Vue from 'vue'
import App from './App.vue'
import VueTouchKeyboard from 'vue-touch-keyboard'
import router from './router'
import './styles/index.css'
import './styles/fonts/material-icons.css'
import './quasar'

import 'vue-touch-keyboard/dist/vue-touch-keyboard.css' // load default style

import VueYouTubeEmbed from 'vue-youtube-embed'
import VCalendar from 'v-calendar'

Vue.use(VueTouchKeyboard)
Vue.use(VueYouTubeEmbed, { global: true })
Vue.use(VCalendar)
new Vue({
	router,
	render: (h) => h(App)
}).$mount('#app')
