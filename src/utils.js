export function parseRepeat(repeat) {
	if (repeat === 0) return '0000000'
	return (repeat >>> 0).toString(2).padStart(7, '0').split('').reverse().join('')
}

export function stringifyRepeat(repeat) {
	return repeat.split('').map((i, index) => {
		return Number(i) * 2 ** (index)
	}).reduce((a, b) => a + b, 0)
}
