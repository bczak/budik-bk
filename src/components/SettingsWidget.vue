<template>
	<div class="widget settings" v-bind:class="{fullscreen: isFullscreen}" @click="openFull">
		<q-icon v-if="isFullscreen" @click="closeFull" class="close" name="close"></q-icon>
		<div v-if="isFullscreen" class="items">
			<div class="item item-google" @click="auth">
				<q-icon name="fab fa-google" class="fab fa-google item-icon" />
				<span v-if="isLogged" class="item-name">Log out</span>
				<span v-else class="item-name">Sign In</span>
			</div>
		</div>
		<div v-else>
			<q-icon name="settings" class="settings-icon" />
		</div>
	</div>
</template>

<script>

import firebase from 'firebase'

export default {
	name: 'SettingsWidget',
	computed: {
		isFullscreen() {
			return this.fullscreen === 'settings'
		},
		isLogged() {
			return this.user !== null
		}
	},
	props: {
		fullscreen: String
	},
	data: () => ({
		user: null
	}),
	async mounted() {
		firebase.firestore().collection('settings').doc('google').onSnapshot((setting) => {
			if (setting.exists) {
				let data = setting.data()
				this.user = data.user
			}
		})
	},
	methods: {
		openFull(e) {
			if (!e.target.className.split(' ').includes('close')) {
				this.$emit('fullscreen', 'settings')
			}
		},
		closeFull() {
			this.$emit('fullscreen', null)
		},
		async auth() {
			if (this.user === null) {
				// sign in
				let provider = new firebase.auth.GoogleAuthProvider()
				provider.addScope('profile')
				provider.addScope('https://www.googleapis.com/auth/calendar')
				provider.addScope('https://www.googleapis.com/auth/youtube')
				let user = await firebase.auth().signInWithRedirect(provider)
				console.log(user)
			} else {
				// sign out
				console.log('sign out')
				await firebase.auth().signOut()
				this.user = null
			}
		}
	}
}
</script>

<style scoped>

.widget.settings {
	background-color: #717874;
	width: 180px;
	height: 180px;
	transition: all .3s;
	z-index: 0;
	top: 200px;
	position: absolute;
	left: 10px;
}

.widget.settings.fullscreen {
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

.settings-icon {
	color: #eee;
	font-size: 100px;
	margin: 35px;
	transition: all .3s;
}

.close {
	font-size: 50px;
	position: fixed;
	margin: 30px;
	top: 0;
	right: 0;
	color: rgba(0, 0, 0, 0.7);
}

.items {
	width: 700px;
	display: flex;
	padding: 15px;
}

.item {
	width: 200px;
	height: 200px;
	border: 1px solid rgba(0, 0, 0, 0.5);
	border-radius: 15px;
	text-align: center;
}

.item-icon {
	font-size: 100px;
	text-align: center;
	width: 100%;
	margin: 40px 0 0;
	color: white
}

.item-name {
	color: white;
	font-size: 30px;
}

.item-google {
	background-color: #EA4335;
}
</style>
