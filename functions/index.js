const functions = require('firebase-functions')
const admin = require('firebase-admin')
const { DateTime } = require('luxon')

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
	measurementId: process.env.FIREBASE_MEASUREMENT_ID
}

admin.initializeApp(firebaseConfig)

exports.processAlarmCreate = functions.firestore.document('alarms/{alarmId}').onCreate(createAlarm)
exports.processAlarmUpdate = functions.firestore.document('alarms/{alarmId}').onUpdate(updateAlarm)
exports.processEventCreate = functions.firestore.document('events/{eventId}').onWrite(async (snap, context) => {
	console.log(context)
})

/**
 * Function to process alarm creation
 * @param {QueryDocumentSnapshot} snap - Firestore document snapshot
 * @param {EventContext} context - Firestore document context
 */
// eslint-disable-next-line no-unused-vars
async function createAlarm(snap, context) {
	console.log(snap.data())
}

/**
 * Function to process alarm update
 * if the alarm repeat is 0, then clear collection 'next' for this alarm
 * generates next dates and adds them to collection 'next'
 * @param {Change<QueryDocumentSnapshot>} snap - Firestore document snapshot
 * @param {Object} context - Firestore document context
 *
 */
// eslint-disable-next-line no-unused-vars
async function updateAlarm(snap, context) {
	let alarm = snap.after.data()
	let now = DateTime.local().setZone("Europe/Prague")
	if (alarm.repeat === 0 || alarm.status === false) {
		return admin.firestore().collection('next').doc(alarm.id).set({ times: [], type: 'alarm' })
	}
	let dates = generateNextDates(now, alarm.time).filter((value, index) => {
		return parseRepeat(alarm.repeat)[index]
	})
	let next = {
    times: dates,
    type: 'alarm'
  }
	return admin.firestore().collection('next').doc(alarm.id).set(next)
}

/**
 * Function generates dates from start of given week to last day of it with given time, but if date is before now, then add next week's date
 * @param {DateTime} now - DateTime object - current date
 * @param {string} time - Time in format HH:mm
 * @returns {Array} - Array of dates
 */
function generateNextDates(now, time) {
	let dates = []
	let date = now.startOf('week')
	date = date.set({hours: time.split(':')[0], minutes: time.split(":")[1]})
	while (now.toISO() > date.toISO()) {
		dates.push(date.plus({ week: 1 }).toISO())
		date = date.plus({ days: 1 })
	}
	while (now.toISO() <= date.toISO() && dates.length !== 7) {
		dates.push(date.toISO())
		date = date.plus({ days: 1 })
	}
	return dates
}

/**
 * Function to convert decimal number to binary and convert it to 7 length array
 * Example: 0 -> '0000000', 1 -> '1000000', 2 -> '0100000', 3 -> '1100000', 4 -> '0010000'
 * @param {number} num - Number to convert
 * @returns {number[]} - 7 num length array
 */
function parseRepeat(num) {
	let binary = num.toString(2)
	let padded = binary.padStart(7, '0')
	return padded.split('').reverse().map(e => Number(e))
}
