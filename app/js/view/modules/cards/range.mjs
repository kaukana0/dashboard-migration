// the ranges are somehow not part of a chartCard component
// because they're put into a card via slot mechanism.
// that's why we need to manage all the ranges externally.

export function init(el, min, max, onSelect) {
	el.setAttribute("min", min)
	el.setAttribute("max", max)
	el.setAttribute("valuel", min)
	el.setAttribute("valuer", max)
	el.addEventListener('dragging', (e) => {
    el.setAttribute("textl", e.detail.startIdx)
	})
	el.addEventListener('selected', onSelect)
}

export function getSelection(el) {
	const retVal = new Map()
	retVal.set(el.valuel,el.valuel)
	return retVal
}