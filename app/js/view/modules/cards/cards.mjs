/**
This creates the cards.
Also the content for a slot which goes into the card.
That content is selectboxes corresponding to YAMLCfg.dimensions.ui.dropdown

Expand/Collapse logic:

- on collapse:
	- country selects favourited entry
	- bySelect selects the default (first three entries)
	- line display is activated

- on expand:
	- calculate # of by-selects: 6 - # selected countries
	- deselect countries if neccessary

*/


import * as MarkUpCode from  "./markUpCode.mjs"		// keep this file html/css free
import * as Selects from "../selects/selectBoxes.mjs"
import * as BySelectConstraint from "../selects/bySelectConstraints.mjs"
import * as CommonConstraints from "../selects/commonConstraints.mjs"
import {MS} from "../selects/magicStrings.mjs"
import * as Url from "../../../url.mjs"
import * as Util from "../../../../components/util/util.mjs"

let categories

export function create(containerId, cfg, _categories, selectedCallback) {
	let retVal = []

	categories = _categories

	for(const i in cfg.indicators) {
		const merged = Util.mergeObjects(cfg.indicatorBase, cfg.indicators[i])
		//console.log("merged cfg for indicator", merged.name, merged)
		const id = getIdFromName(merged.name)

		if(!merged.ignore) {

			document.getElementById(containerId).innerHTML += MarkUpCode.getCardFragment( id, merged.name, Url.getUrlFrag(merged.dimensions.nonUi) )

			requestAnimationFrame( () => {
				const boxes = Selects.createDropdownBoxes(merged.dimensions.ui.dropdown, merged.datasets)
				addBoxEventHandlers(id, boxes, selectedCallback)
				insertBoxes(id, boxes)
				addCardEventHandlers(id, boxes)
				document.getElementById(id).setAttribute("subtitle", "")
				document.getElementById(id).setAttribute("right1", "EU")
				document.getElementById(id).setAttribute("right2", "2022")
			})

			retVal.push(id)
		}

	}

	return retVal
}

export function getIdFromName(name) {
	return "chartCard-"+name.replaceAll(" ", "-")		// or a hash
}

function addCardEventHandlers(id) {

	document.getElementById(id).addEventListener("expanding", () => {
		const el = document.getElementById("anchorSlotContentOfCard"+id)

		CommonConstraints.setBySelect(el.nextSibling)

		// move it from parent container into zoomed card
		el.after(selectCountry)	// no getElById for selectCountry and it works anyway :-o
		document.body.style.overflowY="hidden"
		window.scrollTo(0, 0);
	})

	document.getElementById(id).addEventListener("contracting", () => {
		CommonConstraints.setBySelect(null)
		// move it out of the card into parent container
		document.getElementById("anchorSelectCountryOutsideOfCard").after(selectCountry)	// no getElById for selectCountry and it works anyway :-o
		document.body.style.overflowY="scroll"
		// todo: scroll back to previous pos
	})

}

// note: by-select's counterpart - the geo box - is set and handeled somewhere else!
function addBoxEventHandlers(id, boxes, selectedCallback) {
	for(const box of boxes) {

		const domEl = box.docFrag.firstChild

		domEl.onSelect = function(k,v) {
			if(box.dimId === MS.BY_SELECT_ID) {
				BySelectConstraint.ensureCorrectInterGroupSelection(domEl,k,v)
				return CommonConstraints.bySelectionAllowed( BySelectConstraint.howManyAreGoingToBeSelected(k) )
			}
			return true
		}

		domEl.onSelected = function(k,v) {
			if(box.dimId === MS.BY_SELECT_ID) {
				BySelectConstraint.tryToSelectWholeGroup(domEl,k,v)
			}

			// assumption: a caller is not interested in one box's selection right here, so omit passing on k,v.
			// why? because the caller can ask the card for all selections of all boxes at once.
			selectedCallback(id)
		}
	}
}

function insertBoxes(id, boxes) {
	for(const box of boxes) {
		const el = document.getElementById("anchorSlotContentOfCard"+id)
		el.after(box.docFrag)
	}
}

export function getCurrentSelections(cardId) {
	let retVal = [{cardId: cardId, selections: new Map()}, ""]

	annoying( document.querySelectorAll(`#anchorSlotContentOfCard${cardId} ~ ecl-like-select`) )
	annoying( document.querySelectorAll(`#anchorSlotContentOfCard${cardId} ~ ecl-like-select-x`) )

	function annoying(boxes) {	// no wildcard for CSS elements and nodelist API is missing basic stuff like concat(). 
		for(const box of boxes) {
			if(box.hasAttribute("dimension")) {
				retVal[0].selections.set(box.getAttribute("dimension"), box.selected)
				// this is the place to retrieve the dataset from the by-select
				if(box.getAttribute("dimension") === MS.BY_SELECT_ID) {
					retVal[1] = BySelectConstraint.getDataset(box)
				}
			}
		}
	}

	return retVal
}

export function iterate(containerId, callback) {
	const childs = document.getElementById(containerId).children
	for(let i=0; i<childs.length; i++) {
		callback(childs[i].getAttribute("id"))
	}
}

export function setData(cardId, data) {
	document.getElementById(cardId).setData1(data.timeSeries.data,    data.colorPalette, data.timeSeries.labels)
	document.getElementById(cardId).setData2(data.countrySeries.data, data.colorPalette, data.countrySeries.labels)
}

export function expand(card) {
	// TODO: contract
	card.expand(document.getElementById("anchorSelectCountryOutsideOfCard"))
}

export function filter(category) {
	const cards = categories.get(category).map( (e)=>getIdFromName(e) )
	const elements = document.querySelectorAll("div [id=cards] chart-card")
	let exists = false
	for (var i = 0; i < elements.length; i++) {
		if( cards.includes(elements[i].id) ) {
			elements[i].style.display=""
			exists = true
		} else {
			elements[i].style.display="none"
		}
	}
	// show all
	if(!exists) {
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display=""
		}
	}
}