// the ranges are not part of a chartCard component
// because they're put into a card via slot mechanism.
// so they are managed here.
// see also adr08.mdr


export function setCallbacks(cardId, onSelect) {
	const el = document.getElementById("timeRange"+cardId)
	el.addEventListener('dragging', (e) => {
		el.setAttribute("textl", e.detail.startIdx)
	})
	el.addEventListener('selected', onSelect)
}

// if _max is 0, current year is taken
// if _selected is negative, then [selected = max + _selected] is calculated (it's now relative to the end)
export function setValuesFromConfig(cardId, _min, _max, _selected) {
	const el = document.getElementById("timeRange"+cardId)
	const max = _max>0 ? _max : new Date().getFullYear()
	const selected = _selected > 0 ? _selected : max + _selected

	el.setAttribute("mingap", 0)
	el.setAttribute("min", _min)
	el.setAttribute("max", max)
	el.setAttribute("valuer", max)
	el.setAttribute("valuel", selected)
	el.setAttribute("textl", selected)
	el.setAttribute("defaultValue", selected)
}

// this is called after setValuesFromConfig and has the ability to
// overrule the config values, because the time in the actual data might start later or end earlier
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

		el.setAttribute("defaultValue", el.getAttribute("valuel"))

		el.setAttribute("isinited","trü")
	}
}

export function getSelection(el) {
	const retVal = new Map()
	retVal.set(el.valuel,el.valuel)
	return retVal
}

export function reset(cardId, toMax=false, fireSelected=false, isSinglularValue=false) {
	const el = document.getElementById("timeRange"+cardId)
	const max = el.getAttribute("max")
	const defaultValue = el.getAttribute("defaultValue")
	// as per request, have the blue track right of the handle also in dotplot by commenting this out
	//el.setAttribute("singularvalue", isSinglularValue)
	el.setAttribute("valuel", toMax?max:defaultValue)
	el.setAttribute("textl",  toMax?max:defaultValue)
	if(fireSelected) {el.fireSelected()}
}
