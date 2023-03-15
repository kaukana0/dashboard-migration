/**
This creates the cards.
Also the content for a slot which goes into the card.
That content is selectboxes corresponding to YAMLCfg.dimensions.ui.dropdown
*/
import * as MarkUpCode from  "./markUpCode.mjs"		// keep this file html/css free
import * as Util from "../../components/util/util.mjs"
import * as DropDowns from "./dropDowns.mjs"


export function create(containerId, cfg, selectCallback) {
	let retVal = []

	for(const i in cfg.indicators) {
		const merged = Util.mergeObjects(cfg.indicatorDefaults, cfg.indicators[i])
		console.log("cfg merged for indicator", merged.name, merged)
		const id = "chartCard-"+merged.name.replaceAll(" ", "-")		// or a hash

		document.getElementById(containerId).innerHTML += MarkUpCode.getSlotFragment(id)

    requestAnimationFrame( () => {
			const combi = DropDowns.createCombiBoxes(merged.dimensions.ui.combi, merged.datasets)
			const boxes = DropDowns.createDropdownBoxes(merged.dimensions.ui.dropdown)
			insertAndHookUpBoxes(id, boxes.concat(combi), selectCallback)
			hookUpCardEvents(id, boxes)
		})

		retVal.push(id)
	}

	return retVal
}


function hookUpCardEvents(id) {
	document.getElementById(id).addEventListener("expanding", () => {
		// move it from parent container into zoomed card
		document.getElementById("anchorSlotContentOfCard"+id).after(selectCountry)
	})
	document.getElementById(id).addEventListener("contracting", () => {
		// move it out of the card into parent container
		document.getElementById("anchorSelectCountryOutsideOfCard").after(selectCountry)
	})
}


function insertAndHookUpBoxes(id, boxes, selectCallback) {
	for(const box of boxes) {
		box.docFrag.firstChild.callback = (e) => {
			// relevant is here just in which box a selection happened, not what item was actually selected
			selectCallback({cardId:id, dimId:box.dimId})
		}
		document.getElementById("anchorSlotContentOfCard"+id).after(box.docFrag)
	}
}

export function getCurrentSelections(cardId) {
	let retVal = {cardId: cardId, boxes: []}
	const boxes = document.querySelectorAll(`#anchorSlotContentOfCard${cardId} ~ dropdown-box`)
	for(const box of boxes) {
		retVal.boxes.push({dimension: box.getAttribute("dimension"), selected: box.selected})
	}
	return retVal
}

export function iterate(containerId, callback) {
	const childs = document.getElementById(containerId).children
	for(let i=0; i<childs.length; i++) {
		callback(childs[i].getAttribute("id"))
	}
}