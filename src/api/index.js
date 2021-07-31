import firebase from './firebase'
import axios from 'axios'

export function subscribeForAlarms(callback) {
	return firebase.firestore()
		.collection('alarms')
		.onSnapshot((data) => callback(data))
}

export function subscribeForEvents(callback) {
	return firebase.firestore()
		.collection('events')
		.onSnapshot((data) => callback(data))
}
export function subscribeForNext(callback) {
	return firebase.firestore()
		.collection('next')
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

export async function createEvent(event) {
	delete event.id
	await firebase.firestore().collection('events').add(event)
}

export async function subscribeForVolume(callback) {
	return firebase.firestore()
		.collection('settings')
		.doc('volume')
		.onSnapshot((data) => callback(data))
}

export async function updateVolume(volume) {
	await firebase.firestore().collection('settings').doc('volume').update({value: volume})
}

export async function deleteEvent(id) {
	await firebase.firestore().collection('events').doc(id).delete()

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
		return null
	}
}

export async function like(id) {
	await firebase.firestore().collection('likes').doc(id).set({})
}

export async function dislike(id) {
	await firebase.firestore().collection('likes').doc(id).delete()
}

export async function getLikes() {
	let result = await firebase.firestore().collection('likes').get()
	return result.docs.map(e => e.id)
}

export async function updateEvent(event) {
	await  firebase.firestore().collection('events').doc(event.id).update(event)
}
