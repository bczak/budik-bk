import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.css'
import './styles/fonts/material-icons.css'
// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css'
import {Quasar, QTime} from 'quasar'


createApp(App).use(router).use(Quasar, {components: {QTime}}).mount('#app')
