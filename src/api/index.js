import firebase from './firebase'
import axios from 'axios'

export function subscribeForAlarms(callback) {
	return firebase.firestore()
		.collection('alarms')
		.onSnapshot((data) => callback(data))
}

export async function setAlarm(id, status = true) {
	await firebase.firestore().collection('alarms').doc(id).update({ status: status })
}

export async function updateAlarm(alarm) {
	if (!alarm) return
	delete alarm.parsedRepeat
	await firebase.firestore().collection('alarms').doc(alarm.id).update({ ...alarm })
}

export async function deleteAlarm(id) {
	if (!id) return
	await firebase.firestore().collection('alarms').doc(id).delete()
}

export async function createAlarm(alarm) {
	if (!alarm.time) return
	delete alarm.id
	await firebase.firestore().collection('alarms').add(alarm)
}

/**
 * Return refresh token from firestore
 * @returns {Promise<string|null>}
 */
// eslint-disable-next-line no-unused-vars
async function getToken() {
	let token = await firebase.firestore().collection('settings').doc('google').get()
	if (!token.exists) {
		return null
	}
	token = token.data()
	return token.refreshToken
}

/**
 * Function to retrieve user's playlist
 * @param {String} pageToken
 * @returns {Promise<Array|null>}
 */
export async function fetchVideos(pageToken = null) {
	try {
		let result = await axios('https://www.googleapis.com/youtube/v3/videos', {
			params: {
				part: ['snippet', 'status', 'id', 'contentDetails', 'player', 'topicDetails'].join(','),
				chart: 'mostPopular',
				videoCategoryId: '10',
				key: process.env.VUE_APP_FIREBASE_API_KEY,
				maxResults: 50,
				pageToken: pageToken
			}
		})
		return result.data
	} catch (e) {
		console.log(JSON.stringify(e.response.data))
		return null
	}
}
