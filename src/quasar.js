import Vue from 'vue'

import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import {Quasar, Notify} from 'quasar'

Vue.use(Quasar, {
	config: {
		notify: {},
	},
	plugins: {
		Notify
	},
})
