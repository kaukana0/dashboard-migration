// the ranges are somehow not part of a chartCard component
// because they're put into a card via slot mechanism.
// that's why we need to manage all the ranges externally.

export function setCallbacks(el, onSelect) {
	el.addEventListener('dragging', (e) => {
		el.setAttribute("textl", e.detail.startIdx)
	})
	el.addEventListener('selected', onSelect)
}

export function setMinMax(el,min,max) {
	if(!el.hasAttribute("isinited")) {
		el.setAttribute("min", min)
		el.setAttribute("max", max)
		el.setAttribute("valuel", min)
		el.setAttribute("textl", min)
		el.setAttribute("valuer", max)
		el.setAttribute("isinited","true")
	}
}

export function getSelection(el) {
	const retVal = new Map()
	retVal.set(el.valuel,el.valuel)
	return retVal
}