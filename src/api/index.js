import firebase from '@/api/firebase'

export function subscribeForAlarms(callback) {
	return firebase.firestore()
		.collection('alarms')
		.onSnapshot((data) => callback(data))
}

export async function setAlarm(id, status = true) {
	await firebase.firestore().collection('alarms').doc(id).update({status: status})
}

export async function updateAlarm(alarm) {
	if (!alarm) return;
	await firebase.firestore().collection('alarms').doc(alarm.id).update({...alarm})
}

export async function deleteAlarm(id) {
	if (!id) return;
	await firebase.firestore().collection('alarms').doc(id).delete()
}
export async function createAlarm(alarm) {
	if (!alarm.time) return;
	delete alarm.id
	await firebase.firestore().collection('alarms').add(alarm)
}