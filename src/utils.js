export function parseRepeat(repeat) {
	if(repeat === 0) return '0000000'
	return (repeat >>> 0).toString(2).padStart(7, '0').split('').reverse().join('')
}