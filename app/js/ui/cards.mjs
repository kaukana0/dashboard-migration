import * as MarkUpCode from  "./markUpCode.mjs"		// keep this file html/css free
import * as DropDowns from "./dropDowns.mjs"
import * as Util from "../../components/util/util.mjs"


export function create(cfg, selectCallback) {
	let retVal = []

	for(const i in cfg.indicators) {
		const merged = Util.mergeObjects(cfg.defaults, cfg.indicators[i])
		console.log("merged for indicator", merged.name, merged)
		const id = "chartCard-"+merged.name.replaceAll(" ", "-")		// or a hash

		document.getElementById("cards").innerHTML += MarkUpCode.getSlotFragment(id)

    requestAnimationFrame( () => {
			const boxes = DropDowns.createDropdownBoxes(merged.dimensions.ui.perIndicator.dropdown)
			insertAndHookUpBoxes(id, boxes, selectCallback)
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
		box.frag.firstChild.callback = (e) => {
			// relevant is here just in which el a selection happened, not what item was actually selected
			selectCallback({cardId:id, dimId:box.dimId})
		}
		document.getElementById("anchorSlotContentOfCard"+id).after(box.frag)
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
