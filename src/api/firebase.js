import firebase from 'firebase/app'
import 'firebase/functions'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
	apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
	authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.VUE_APP_FIREBASE_APP_ID,
	measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
	clientId: process.env.VUE_APP_FIREBASE_WEB_CLIENT_ID,
	clientSecret: process.env.VUE_APP_FIREBASE_WEB_CLIENT_SECRET,
	scopes: ['email', 'profile', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/youtube']
}
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)
const server = 'localhost'
firebase.firestore().useEmulator(server, 8080)
firebase.functions().useEmulator(server, 5001)

firebase.auth().onAuthStateChanged(async (user) => {
	let result = await firebase.auth().getRedirectResult()
	console.log(user)
	if (!result.credential) {
		await firebase.firestore().collection('settings').doc('google').set({
			user: null,
			accessToken: null,
			refreshToken: null,
			updated: Date.now()
		})
		return
	}
	let credential = result.credential
	await firebase.firestore().collection('settings').doc('google').set({
		user: JSON.parse(JSON.stringify(user)),
		accessToken: credential.accessToken,
		refreshToken: credential.refreshToken,
		updated: Date.now()
	})
})

export default app
