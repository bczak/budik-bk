import firebase from './firebase'

export function subscribeForAlarms(callback) {
	return firebase.firestore()
		.collection('alarms')
		.onSnapshot((data) => callback(data))
}

export function subscribeForEvents(callback) {
	return firebase.firestore()
		.collection('events').orderBy('start')
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

export async function getAlarm(id) {
	await firebase.firestore().collection('alarms').doc(id).get()

}

export async function updateNextAlarm(id) {
	await firebase.firestore().collection('alarms').doc(id).update({ updated: Date.now() })
}

export async function updateNextEvent(id) {
	await firebase.firestore().collection('events').doc(id).update({ updated: Date.now() })
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

export async function subscribeForTemperature(callback) {
	return firebase.firestore()
		.collection('settings')
		.doc('temperature')
		.onSnapshot((data) => callback(data))
}

export async function subscribeForLEDColor(callback) {
	return firebase.firestore()
		.collection('settings')
		.doc('led')
		.onSnapshot((data) => callback(data))
}

export async function setColor(color) {
	await firebase.firestore().collection('settings').doc('led').set({ color: color })
}

export async function updateVolume(volume) {
	await firebase.firestore().collection('settings').doc('volume').set({ value: volume })
}

export async function deleteEvent(id) {
	await firebase.firestore().collection('events').doc(id).delete()
}

export async function updateEvent(event) {
	await firebase.firestore().collection('events').doc(event.id).update(event)
}

export async function updateWeather() {
	await firebase.functions().httpsCallable('fetchWeather')()
}
