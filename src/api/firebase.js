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
	measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
}
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)
const server = 'localhost'
firebase.firestore().useEmulator(server, 8080)
firebase.functions().useEmulator(server, 5001)

firebase.auth().onAuthStateChanged(async (user) => {
	await firebase.firestore().collection('settings').doc('google').set({ user: JSON.parse(JSON.stringify(user)), updated: Date.now() })
})

export default app
