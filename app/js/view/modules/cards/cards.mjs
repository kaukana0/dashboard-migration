/**
This creates the cards.
Also the content for a slot which goes into the card.
That content is selectboxes corresponding to YAMLCfg.dimensions.ui.dropdown
*/
import * as MarkUpCode from  "./markUpCode.mjs"		// keep this file html/css free
import * as DropDowns from "../dropDowns.mjs"
import * as Util from "../../../../components/util/util.mjs"
import * as Url from "../../../url.mjs"


export function create(containerId, cfg, selectCallback) {
	let retVal = []

	for(const i in cfg.indicators) {
		const merged = Util.mergeObjects(cfg.indicatorBase, cfg.indicators[i])
		//console.log("merged cfg for indicator", merged.name, merged)
		const id = "chartCard-"+merged.name.replaceAll(" ", "-")		// or a hash

		document.getElementById(containerId).innerHTML += MarkUpCode.getCardFragment( id, merged.name, Url.getUrlFrag(merged.dimensions.nonUi) )

    requestAnimationFrame( () => {
			const combi = DropDowns.createCombiBoxes(merged.dimensions.ui.combi, merged.datasets)
			const boxes = DropDowns.createDropdownBoxes(merged.dimensions.ui.dropdown)
			insertAndHookUpBoxes(id, boxes.concat(combi), selectCallback)
			hookUpCardEvents(id, boxes)
			document.getElementById(id).setAttribute("subtitle", "")
			document.getElementById(id).setAttribute("right1", "EU")
			document.getElementById(id).setAttribute("right2", "2022")
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
			// assumtion: for a caller it's only relevant in which chart a selection happened, not the box or selected items
			selectCallback(id)
		}
		document.getElementById("anchorSlotContentOfCard"+id).after(box.docFrag)
	}
}

export function getCurrentSelections(cardId) {
	let retVal = {cardId: cardId, boxes: new Map()}
	const boxes = document.querySelectorAll(`#anchorSlotContentOfCard${cardId} ~ dropdown-box`)
	for(const box of boxes) {
		if(box.hasAttribute("dimension")) {
			retVal.boxes.set(box.getAttribute("dimension"), box.selected)
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
	document.getElementById(cardId).setData(data)
}