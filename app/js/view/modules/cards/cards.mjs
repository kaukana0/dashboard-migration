/**
This creates the cards.
Also the slot contents which go into a card.
That content is:
- selectboxes corresponding to YAMLCfg.dimensions.ui.dropdown
- time range slider
- links (cookies etc.)

on collapse:
- country selects favourited entry
- bySelect selects the default (eg first three entries)
- switch to line display
*/


import * as MarkUpCode from  "./markUpCode.mjs"		// keep this file html/css free
import * as Selects from "../selects/selectBoxes.mjs"
import * as BySelectConstraint from "../selects/bySelectConstraints.mjs"
import * as CommonConstraints from "../selects/commonConstraints.mjs"
import {MS} from "../../../common/magicStrings.mjs"
import * as Url from "../../../model/url.mjs"
import * as Util from "../../../../components/util/util.mjs"
import * as UtilSelect from "../selects/util.mjs"
import * as TooltipLine from "./tooltips/tooltipLineChart.mjs"
import * as TooltipDot from "./tooltips/tooltipDotChart.mjs"
import * as TooltipCommon from "./tooltips/common.mjs"
import "../../../../components/range/range.mjs"							// the WebComponent
import * as Range from "./range.mjs"


let categories
let countryNamesFull = {}		// used by tooltip; via context, meaning: it doesn't come from processors/data but from config
// the more you know: Griechenland verwendet in europäischen Publikationen nicht den ISO 3166 Schlüssel GR für die Länderkennung, sondern die eigene Abkürzung EL von "Hellas".


export function create(containerId, cfg, _categories, selectedCallback, expandCallback, contractCallback) {
	let retVal = []

	categories = _categories

	for(const i in cfg.indicators) {
		const merged = Util.mergeObjects(cfg.indicatorBase, cfg.indicators[i])
		const id = getIdFromName(merged.name)
		console.debug("merged cfg for indicator", merged.name, merged, id)

		if(!merged.ignore) {
			document.getElementById(containerId).innerHTML += MarkUpCode.getCardFragment( id, merged.name, Url.getUrlFrag(merged.dimensions.nonUi), MS.CARD_SLOT_ANCHOR_DOM_ID )
			requestAnimationFrame( () => {
				const boxes = Selects.createDropdownBoxes(merged.dimensions.ui.dropdown, merged.datasets)
				addBoxEventHandlers(id, boxes, selectedCallback)
				insertBoxes(id, boxes)
				setupCard(id, merged, expandCallback, contractCallback, selectedCallback)
				setupRange(id, merged.dimensions.ui.range[0], selectedCallback)
			})
			retVal.push(id)
		}
	}

	countryNamesFull = UtilSelect.getMapFromObject(cfg.codeList.countries)

	return retVal
}

function setupCard(id, merged, expandCallback, contractCallback) {
	const card = document.getElementById(id)
	card.addEventListener("expanding", () => { expandCallback(id) })
	card.addEventListener("contracting", () => { contractCallback(id) })
	card.setAttribute("subtitle", merged.dimensions.nonUi.unit[0].label)
	card.setAttribute("yLabel", merged.dimensions.nonUi.unit[0].label)
	card.setAttribute("right1", "EU")
	card.setAttribute("right2", "2022")
	card.setAttribute("srcLinkC", merged.datasets.citizen.source)
	card.setAttribute("srcLinkB", merged.datasets.birth.source)
	card.setAttribute("articleLink", merged.articleLink.url)
	card.tooltipFn1 = TooltipLine.tooltipFn
	card.tooltipFn2 = TooltipDot.tooltipFn
	card.tooltipCSS = TooltipCommon.CSS()
}

function setupRange(id, values, selectedCallback) {
	Range.setCallbacks(id, () => {
		TooltipDot.setHeader( document.getElementById("timeRange"+id).valuel )
		selectedCallback(id)
	})
	Range.setValuesFromConfig(id, values.start, values.end, values.current)
}

export function getIdFromName(name) {
	return MS.CARD_DOM_ID_PREFIX + name.replaceAll(" ", "-")		// or a hash
}

// note: by-select's counterpart (in terms of constraints) - the geo box - is set and handeled somewhere else!
function addBoxEventHandlers(id, boxes, selectedCallback) {
	for(const box of boxes) {

		const domEl = box.docFrag.firstChild.childNodes[1]

		domEl.onSelect = function(k,v) {
			if(box.dimId === MS.BY_SELECT_ID) {
				return CommonConstraints.bySelectionAllowed( BySelectConstraint.howManyAreGoingToBeSelected(k) )
			}
			return true
		}

		domEl.onSelected = function(k,v) {
			if(box.dimId === MS.BY_SELECT_ID) {
				if(!BySelectConstraint.tryToSelectWholeGroup(domEl,k,v)) {
					domEl.selected = [k]
				}
			}

			// assumption: a caller is not interested in one box's selection right here, so omit passing on k,v.
			// why? because the caller can ask the card for all selections of all boxes at once.
			selectedCallback(id)
		}
	}
}

function insertBoxes(id, boxes) {
	for(const box of boxes) {
		const el = document.getElementById(MS.CARD_SLOT_ANCHOR_DOM_ID+id)
		el.after(box.docFrag)
	}
}

export function getCurrentSelections(cardId) {
	let retVal = [{cardId: cardId, selections: new Map()}, ""]

	// mimic select's api
	const range = document.getElementById(cardId).querySelector("range-slider")
	retVal[0].selections.set("time", Range.getSelection(range))

	const boxSelector = `#${MS.CARD_SLOT_ANCHOR_DOM_ID}${cardId} ~ div ecl-like-select-x`
	const boxes = document.querySelectorAll(boxSelector)
	if(boxes.length===0) { console.warn("cards: no boxes for selector", boxSelector) }
	for(let box of boxes) {
		if(box.hasAttribute("dimension")) {
			retVal[0].selections.set(box.getAttribute("dimension"), box.selected)
			// this is the place to retrieve the dataset from the by-select
			if(box.getAttribute("dimension") === MS.BY_SELECT_ID) {
				retVal[1] = BySelectConstraint.getDataset(box)
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

export function setData(cardId, geoSelections, data) {
	Range.setMinMax(cardId, Number(data.time[0]), Number(data.time[data.time.length-1]))
	document.getElementById(cardId).setData1(data.timeSeries.data,    countryNamesFull, data.colorPalette, getColors(true,  geoSelections) )
	document.getElementById(cardId).setData2(data.countrySeries.data, countryNamesFull, data.colorPalette, getColors(false, geoSelections) )
	document.getElementById(cardId).stopIndicateLoading()
}

/* #geoSelections applicable for line chart:
	>2 = assign color from palette by selection (one color after another), indepenent of country
	2 = the same 2 (3-)sets of colors, the first set for the 1st selected contry, 2nd for the 2nd selected
	1 = assign 1 3-set of colors

	in any case, EU always gets the same 3-set of colors.

	returns object, key=by+country val=color

	TODO: surely this can be written a whole lot nicer, yes!?
*/
function getColors(forLineChart, geoSelections) {
	const retVal = {}

	const colorsEU = { dark:"#0e47cb", mid:"#082b7a", light:"#388ae2" }
	const colorsSet1 = { dark:"#734221", mid:"#c66914", light:"#dfb18b" }
	const colorsSet2 = { dark:"#005500", mid:"#008800", light:"#00BB00" }

	if(forLineChart) {
		const geoKey = geoSelections.keys().next().value
		if(geoSelections.size===1) {
			retVal[MS.TXT_BY_LBL_CNAT+", "+geoKey] = colorsSet1.dark
			retVal[MS.TXT_BY_LBL_CEU+", "+geoKey] = colorsSet1.mid
			retVal[MS.TXT_BY_LBL_CNEU+", "+geoKey] = colorsSet1.light

			retVal[MS.TXT_BY_LBL_BNAT+", "+geoKey] = colorsSet1.dark
			retVal[MS.TXT_BY_LBL_BEU+", "+geoKey] = colorsSet1.mid
			retVal[MS.TXT_BY_LBL_BNEU+", "+geoKey] = colorsSet1.light
		} else {
			if(geoSelections.size===2) {
				const geoKey2 = Array.from(geoSelections.keys())[1]
				retVal[MS.TXT_BY_LBL_CNAT+", "+geoKey] = colorsSet2.dark
				retVal[MS.TXT_BY_LBL_CEU+", "+geoKey] = colorsSet2.mid
				retVal[MS.TXT_BY_LBL_CNEU+", "+geoKey] = colorsSet2.light
				retVal[MS.TXT_BY_LBL_BNAT+", "+geoKey] = colorsSet2.dark
				retVal[MS.TXT_BY_LBL_BEU+", "+geoKey] = colorsSet2.mid
				retVal[MS.TXT_BY_LBL_BNEU+", "+geoKey] = colorsSet2.light

				retVal[MS.TXT_BY_LBL_CNAT+", "+geoKey2] = colorsSet1.dark
				retVal[MS.TXT_BY_LBL_CEU+", "+geoKey2] = colorsSet1.mid
				retVal[MS.TXT_BY_LBL_CNEU+", "+geoKey2] = colorsSet1.light
				retVal[MS.TXT_BY_LBL_BNAT+", "+geoKey2] = colorsSet1.dark
				retVal[MS.TXT_BY_LBL_BEU+", "+geoKey2] = colorsSet1.mid
				retVal[MS.TXT_BY_LBL_BNEU+", "+geoKey2] = colorsSet1.light
			} else {
				// no operation; meaning no fixed colors, meaning default dynamic color assignment mechanism (from chart WebCompoment)
			}
		}
		retVal[MS.TXT_BY_LBL_CNAT+", EU"] = colorsEU.dark
		retVal[MS.TXT_BY_LBL_CEU+", EU"] = colorsEU.mid
		retVal[MS.TXT_BY_LBL_CNEU+", EU"] = colorsEU.light

		retVal[MS.TXT_BY_LBL_BNAT+", EU"] = colorsEU.dark
		retVal[MS.TXT_BY_LBL_BEU+", EU"] = colorsEU.mid
		retVal[MS.TXT_BY_LBL_BNEU+", EU"] = colorsEU.light
	} else {
		// TODO: EU different
		retVal[MS.TXT_BY_LBL_CNAT] = colorsSet1.dark
		retVal[MS.TXT_BY_LBL_CEU] =  colorsSet1.mid
		retVal[MS.TXT_BY_LBL_CNEU] = colorsSet1.light

		retVal[MS.TXT_BY_LBL_BNAT] = colorsSet1.dark
		retVal[MS.TXT_BY_LBL_BEU] = colorsSet1.mid
		retVal[MS.TXT_BY_LBL_BNEU] = colorsSet1.light
	}
	return retVal
}

export function contractAll() {
	iterate(MS.CARD_CONTAINER_DOM_ID, (cardId) => document.getElementById(cardId).contract() )
}

export function setDefaultSelections(node) {
	const elements = node.querySelectorAll("ecl-like-select-x")
	for (let i = 0; i < elements.length; i++) {
		elements[i].selectDefaults()
	}
	//TODO: Range
}

export function expand(card) {
	contractAll()
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

export function setTooltipStyle(numberOfCountriesSelected, numberOfBySelected) {
	const cond = numberOfCountriesSelected > 1 && numberOfBySelected === 1
	TooltipLine.setGroupByCountry(!cond)
}
