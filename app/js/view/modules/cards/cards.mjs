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
- switch to line display (1st chart)
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
let overviewCardIds = []

export function create(containerId, cfg, _categories, selectedCallback, onCardExpand, onCardContract) {
	let retVal = []

	categories = _categories

	for(const i in cfg.indicators) {
		const merged = Util.mergeObjects(cfg.indicatorBase, cfg.indicators[i])
		const id = getIdFromName(merged.name)
		console.debug("cards: merged cfg for indicator", merged.name, merged, id)

		if(!merged.ignore) {
			if(merged["obiWan"]) {document.getElementById(containerId).innerHTML = ""}
			document.getElementById(containerId).innerHTML += MarkUpCode.getCardFragment( id, merged.name, Url.getUrlFrag(merged.dimensions.nonUi), MS.CARD_SLOT_ANCHOR_DOM_ID )
			requestAnimationFrame( () => {
				const boxes = Selects.createDropdownBoxes(merged.dimensions.ui.dropdown, merged.datasets)
				addBoxEventHandlers(id, boxes, selectedCallback)
				insertBoxes(id, boxes)
				setupCard(id, merged, onCardExpand, onCardContract, selectedCallback)
				setupRange(id, merged.dimensions.ui.range[0], selectedCallback)
			})
			if(merged.isInOverview && merged.isInOverview===true) { overviewCardIds.push(id) }
			retVal.push(id)
			if(merged["obiWan"]) {break}
		}
	}

	countryNamesFull = UtilSelect.getMapFromObject(cfg.codeList.countries)

	if(overviewCardIds.length===0) {
		console.warn("cards: no 'isInOverview' is defined in yaml, so there's no card in the overview")
	}

	return retVal
}

function setupCard(id, merged, onCardExpand, onCardContract) {
	const card = document.getElementById(id)
	card.addEventListener("expanding", () => { onCardExpand(id) })
	card.addEventListener("contracting", () => { onCardContract(id) })
	card.addEventListener("chartSwitched", (e) => { Range.reset(id, e.to==2, true) })
	card.setAttribute("yLabel", merged.dimensions.nonUi.unit[0].label)
	card.setAttribute("srcLink1", merged.datasets.citizen.source)
	card.setAttribute("srcLink2", merged.datasets.birth.source)
	card.setAttribute("articleLink", merged.articleLink.url)
	card.tooltipFn1 = TooltipLine.tooltipFn
	card.tooltipFn2 = TooltipDot.tooltipFn
	card.tooltipCSS = TooltipCommon.CSS()
	card.setLegendTexts([MS.TXT_BY_LBL_CNEU, MS.TXT_BY_LBL_CEU, MS.TXT_BY_LBL_CNAT])
}

function setupRange(id, values, selectedCallback) {
	Range.setCallbacks(id, () => {
		TooltipDot.setHeader( document.getElementById("timeRange"+id).valuel )
		selectedCallback(id)
	})
	Range.setValuesFromConfig(id, values.start, values.end, values.current)
	TooltipDot.setHeader( document.getElementById("timeRange"+id).valuel )
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

	// mimic (adapt to) select's api
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

// TODO: order by current visibility (the cards in viewport before others)
export function iterate(containerId, callback) {
	const childs = document.getElementById(containerId).children
	for(let i=0; i<childs.length; i++) {
		callback(childs[i].getAttribute("id"))
	}
}

export function setData(cardId, geoSelections, data) {
	Range.setMinMax(cardId, Number(data.time[0]), Number(data.time[data.time.length-1]))

	document.getElementById(cardId).setData1({
		cols: data.timeSeries.data,	countryNamesFull:countryNamesFull,
		palette:data.colorPalette, fixColors:getColorSet(true,  geoSelections)
	})

	document.getElementById(cardId).setData2({
		cols: data.countrySeries.data,	countryNamesFull:countryNamesFull,
		palette:data.colorPalette, fixColors:getColorSet(false,  geoSelections)
	})

	document.getElementById(cardId).stopIndicateLoading()
}

export function getColorSetDefinitions() {
	return {
		EU: { dark:"#082b7a", mid:"#0e47cb ", light:"#388ae2" },
		SET1: { dark:"#734221", mid:"#c66914", light:"#dfb18b" },
		SET2: { dark:"#005500", mid:"#008800", light:"#00BB00" }
	}
}

/* #geoSelections applicable for line chart:
	>2 = assign color from palette by selection (one color after another), indepenent of country
	2 = the same 2 (3-)sets of colors, the first set for the 1st selected contry, 2nd for the 2nd selected
	1 = assign 1 3-set of colors

	in any case, EU always gets the same 3-set of colors.

	returns object, key=by+country val=color

	TODO: surely this can be written a whole lot nicer, yes!?
*/
function getColorSet(forLineChart, geoSelections) {
	const retVal = {}

	const c = getColorSetDefinitions()
	const colorsEU = c.EU
	const colorsSet1 = c.SET1
	const colorsSet2 = c.SET2

	if(forLineChart) {

		const geoKey = geoSelections.keys().next().value
		if(geoSelections.size===1) {
			retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_CNAT] = colorsSet1.dark
			retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_CEU] = colorsSet1.mid
			retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_CNEU] = colorsSet1.light

			retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_BNAT] = colorsSet1.dark
			retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_BEU] = colorsSet1.mid
			retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_BNEU] = colorsSet1.light
		} else {
			if(geoSelections.size===2) {
				retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_CNAT] = colorsSet2.dark
				retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_CEU] = colorsSet2.mid
				retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_CNEU] = colorsSet2.light
				retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_BNAT] = colorsSet2.dark
				retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_BEU] = colorsSet2.mid
				retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_BNEU] = colorsSet2.light
				
				const geoKey2 = Array.from(geoSelections.keys())[1]
				retVal[geoKey2+", "+MS.TXT_BY_LBL_SHORT_CNAT] = colorsSet1.dark
				retVal[geoKey2+", "+MS.TXT_BY_LBL_SHORT_CEU] = colorsSet1.mid
				retVal[geoKey2+", "+MS.TXT_BY_LBL_SHORT_CNEU] = colorsSet1.light
				retVal[geoKey2+", "+MS.TXT_BY_LBL_SHORT_BNAT] = colorsSet1.dark
				retVal[geoKey2+", "+MS.TXT_BY_LBL_SHORT_BEU] = colorsSet1.mid
				retVal[geoKey2+", "+MS.TXT_BY_LBL_SHORT_BNEU] = colorsSet1.light
			} else {
				// no operation; meaning no fixed colors, meaning default dynamic color assignment mechanism (from chart WebCompoment)
			}
		}
		retVal["EU, "+MS.TXT_BY_LBL_SHORT_CNAT] = colorsEU.dark
		retVal["EU, "+MS.TXT_BY_LBL_SHORT_CEU] = colorsEU.mid
		retVal["EU, "+MS.TXT_BY_LBL_SHORT_CNEU] = colorsEU.light

		retVal["EU, "+MS.TXT_BY_LBL_SHORT_BNAT] = colorsEU.dark
		retVal["EU, "+MS.TXT_BY_LBL_SHORT_BEU] = colorsEU.mid
		retVal["EU, "+MS.TXT_BY_LBL_SHORT_BNEU] = colorsEU.light

	} else {		// fixed colors for dot plot
		
		retVal[MS.TXT_BY_LBL_CNAT] = colorsSet1.dark
		retVal[MS.TXT_BY_LBL_CEU] =  colorsSet1.mid
		retVal[MS.TXT_BY_LBL_CNEU] = colorsSet1.light
		
		retVal[MS.TXT_BY_LBL_BNAT] = colorsSet1.dark
		retVal[MS.TXT_BY_LBL_BEU] = colorsSet1.mid
		retVal[MS.TXT_BY_LBL_BNEU] = colorsSet1.light

		// TODO: EU different
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
}

export function expand(card) {
	contractAll()
	card.expand(document.getElementById("anchorSelectCountryOutsideOfCard"))
}

export function filter(category) {
	const cardsOfCategory = categories.get(category).map( (e)=>getIdFromName(e) )
	const elements = document.querySelectorAll("div [id=cards] chart-card")

	if(cardsOfCategory.length>0) {
		for (var i = 0; i < elements.length; i++) {
			if( cardsOfCategory.includes(elements[i].id) ) {
				elements[i].isVisible=true
			} else {
				elements[i].isVisible=false
			}
		}
	} else {
		// "Overview" category doesn't exist, therefore can't have any cards.
		// show all which are supposed to be in overview
		for (var i = 0; i < elements.length; i++) {
			elements[i].isVisible = overviewCardIds.includes(elements[i].getAttribute("id"))
		}
	}

}

export function setTooltipStyle(numberOfCountriesSelected, numberOfBySelected) {
	const cond = numberOfCountriesSelected > 1 && numberOfBySelected === 1
	TooltipLine.setGroupByCountry(!cond)
}

export function setSubtitle(id, subtitle) {
	const card = document.getElementById(id)
	card.setAttribute("subtitle", subtitle)
}