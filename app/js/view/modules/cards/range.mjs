// the ranges are somehow not part of a chartCard component
// because they're put into a card via slot mechanism.
// that's why we need to manage all the ranges externally.



export function setCallbacks(cardId, onSelect) {
	const el = document.getElementById("timeRange"+cardId)
	el.addEventListener('dragging', (e) => {
		el.setAttribute("textl", e.detail.startIdx)
	})
	el.addEventListener('selected', onSelect)
}

export function setValuesFromConfig(cardId, _min, _max, _current) {
	const el = document.getElementById("timeRange"+cardId)
	const max = _max>0 ? _max : new Date().getFullYear()
	const current = _current > 0 ? _current : max + _current
	el.setAttribute("min", _min)
	el.setAttribute("max", max)
	el.setAttribute("valuer", max)
	el.setAttribute("valuel", current)
	el.setAttribute("textl", current)
}

export function setMinMax(cardId, min, max) {
	const el = document.getElementById("timeRange"+cardId)

	if(!el.hasAttribute("isinited")) {
		const cMin = el.getAttribute("min")
		const cMax = el.getAttribute("max")
		
		const setMin = cMin<min ? min : cMin
		const setMax = cMax>max ? max : cMax
		
		el.setAttribute("min", setMin)
		el.setAttribute("max", setMax)
		el.setAttribute("valuer", setMax)
		
		// TODO gap
		if( el.getAttribute("valuel")<setMin ) {el.setAttribute("valuel", setMin)}
		if( el.getAttribute("valuel")>setMax ) {el.setAttribute("valuel", setMax)}

		el.setAttribute("isinited","trü")
	}
}

export function getSelection(el) {
	const retVal = new Map()
	retVal.set(el.valuel,el.valuel)
	return retVal
}

export function reset(cardId) {
	const el = document.getElementById("timeRange"+cardId)
	const max = el.getAttribute("max")
	const min = el.getAttribute("min")
	const left = (max-10) > min ? (max-10) : min
	el.setAttribute("valuel", left)
	el.setAttribute("textl", left)
}