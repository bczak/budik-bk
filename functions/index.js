const functions = require('firebase-functions')
const admin = require('firebase-admin')
const { DateTime } = require('luxon')
const Gpio = require('onoff').Gpio //include onoff to interact with the GPIO
const ws281x = require('rpi-ws281x')
const nodaryEncoder = require('nodary-encoder')
const myEncoder = nodaryEncoder(14,15) // Using GPIO17 & GPIO18

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
	measurementId: process.env.FIREBASE_MEASUREMENT_ID
}

ws281x.configure({ leds: 8, gpio: 18 })

admin.initializeApp(firebaseConfig)

exports.processAlarmCreate = functions.firestore.document('alarms/{alarmId}').onWrite(processAlarm)
exports.processEventCreate = functions.firestore.document('events/{eventId}').onWrite(async (snap, context) => {
	console.log(context)
})

/**
 *
 * @param {Change<DocumentSnapshot>} snap
 * @param {EventContext} context
 * @returns {Promise<void>}
 */
async function processAlarm(snap, context) {
	if (snap.after && snap.after.exists) {
		let alarm = snap.after.data()
		if (!alarm.status) {
			return removeNotification(snap.after.id)
		}
		let times = getNextTimestamp(snap.after.data())
		await admin
			.firestore()
			.collection('next')
			.doc('alarm_' + context.params.alarmId)
			.set({ type: 'alarm', times: [...times] })
	}
}

async function removeNotification(alarmId) {
	await admin
		.firestore()
		.collection('next')
		.doc('alarm_' + alarmId)
		.delete()
}

function getNextTimestamp(alarm) {
	let nextTime = alarm.time
	let repeat = parseRepeat(alarm.repeat)
	let now = DateTime.now().setZone('Europe/Prague')
	let modifiedRepeat = getNextDayOfWeek(repeat, now)
	let times = []
	// if no repeat but enabled
	if (alarm.repeat === 0) {
		let next = DateTime.now().set({
			hour: nextTime.split(':')[0],
			minute: nextTime.split(':')[1],
			second: 0,
			millisecond: 0
		})
		if (now.toFormat('T') <= nextTime) {
			times.push(next)
		} else {
			times.push(next.plus({ day: 1 }))
		}
	}

	for (let i = 0; i < 7; i++) {
		let now = DateTime.now().setZone('Europe/Prague')
		let day = Number(modifiedRepeat[i])
		if (day === 0) continue
		if (i === 0) {
			// if today before now then move to next week
			if (nextTime <= now.toFormat('T')) {
				now = now.plus({ week: 1 })
			}
		}
		now = now.set({ hour: nextTime.split(':')[0], minute: nextTime.split(':')[1], second: 0, millisecond: 0 })
		times.push(now.plus({ day: i }))
	}
	return [...(new Set(times.map(e => e.toISO())))]
}

/**
 * Return modified repeat string with offset of weekday
 *
 * @param {string} repeat
 * @param {DateTime} now
 */
function getNextDayOfWeek(repeat, now) {
	return repeat.substr(now.weekday - 1, 7 - now.weekday + 1) + repeat.substr(0, now.weekday - 1)
}

function parseRepeat(repeat) {
	if (repeat === 0) return '0000000'
	return (repeat >>> 0)
		.toString(2)
		.padStart(7, '0')
		.split('')
		.reverse()
		.join('')
}

let lastValue = 0

function getLastValue() {
	return lastValue
}

function setLastValue(value) {
	lastValue = value
}

const pushButton = new Gpio(23, 'in', 'both')
let buttonPushed = 0
pushButton.watch(async function (err, value) {
	if (value === 1) {
		buttonPushed = Date.now()
	} else {
		if (Date.now() - buttonPushed > 100) {
			console.log('button')
			await admin.firestore().collection('settings').doc('button').set({ updated: Date.now() }, { merge: true })
		}
		buttonPushed = Date.now()
	}
})
let led = 0;
let volume = 60;

function getLed() {
	return led
}
function setLed(l) {
	led = l
} 
function getVolume() {
	return volume
}
function setVolume(l) {
	volume = l
} 
myEncoder.on('rotation', async (direction, value) => {
	if (getLastValue() !== value) {
		let { mode } = (await admin.firestore().collection('settings').doc('button').get()).data() || { mode: 'volume' }
		let dir = direction === 'R'
		if (mode === 'led') {
			let led = getLed()
			let pixels = new Uint32Array(8);
			if (led > 360) {
				led = 0
			}
			led += (dir ? 1 : -1) // todo
			if(led < 0) led = 360
			if(led > 360) led = 0
			let hex = hsv2rgb(led, 1, 1)
			var red = parseInt(hex[0] * 255),
				green = parseInt(hex[1] * 255),
				blue = parseInt(hex[2] * 255);
			var color = (red << 16) | (green << 8) | blue;

			for (var i = 0; i < 8; i++)
				pixels[i] = color;
			setLed(led)
			console.log(led)
			ws281x.render(pixels)
			await admin.firestore().collection('settings').doc('led').set({ value: led }, { merge: true })
		} else {
			let volume = getVolume()
			volume += dir ? 2 : -2;
			if(volume < 0) volume = 0;
			if(volume > 100) volume = 100;
			setVolume(volume)
			await admin.firestore().collection('settings').doc('volume').set({ value: volume }, { merge: true })
		}
	}
	setLastValue(value)
})

function hsv2rgb(h,s,v) 
{                              
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5),f(3),f(1)];       
} 