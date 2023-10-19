/**
This creates the cards and manages them as a whole.

Also the slot contents which go into a card.
That content is:
- selectboxes corresponding to YAMLCfg.dimensions.ui.dropdown
- time range slider
- links (cookies etc.)

on collapse:
- country selects favourited entry
- bySelect selects the default (eg first three entries)
- switch to line display (1st chart)

TODO: refactor - split this file up, it's too big already.
*/


import * as MarkUpCode from  "./markUpCode.mjs"		// keep this file html/css free
import * as Selects from "../selects/selectBoxes.mjs"
import * as BySelectConstraint from "../selects/bySelectConstraints.mjs"
import * as CommonConstraints from "../selects/commonConstraints.mjs"
import {MS} from "../../../common/magicStrings.mjs"
import * as Url from "../../../model/url.mjs"
import * as Util from "../../../../components/util/util.mjs"
import {getMapFromArray, getMapFromArrayWObjects}  from "../util.mjs"
import * as TooltipLine from "./tooltips/tooltipLineChart.mjs"
import * as TooltipDot from "./tooltips/tooltipDotChart.mjs"
import * as TooltipCommon from "./tooltips/common.mjs"
import "../../../../components/range/range.mjs"							// the WebComponent
import * as Range from "./range.mjs"
import * as Subtitle from "./subtitle.mjs"
import * as PopUpMessage from "../popUpMessage.mjs"
import * as GROUPS from "../../../model/common/groupDefinition.mjs"
import {setOverviewCardIds} from "../cardToMenuMapping.mjs"

let countryNamesFull = {}		// used by tooltip; via context, meaning: it doesn't come from processors/data but from config
let numberOfCountriesSelected = 0		// TODO: possible to get rid of this?
let numberOfBySelected = 0					// TODO: possible to get rid of this?
const parser = new DOMParser()

// pretty much the core of processing the YAML
export function create(containerId, cfg, selectedCallback, onCardExpand, onCardContract) {
	let retVal = []
	let overviewCardIds = []

	for(const i in cfg.indicators) {

		const merged = Util.mergeObjects(cfg.indicatorBase, cfg.indicators[i])
		const id = getIdFromName(merged.name)

		console.debug("cards: merged cfg for indicator", merged.name, merged, id)
		
		if(!merged.ignore) {
			if(merged["hanSolo"]) {document.getElementById(containerId).innerHTML = ""}			// undocumented feature. for troubleshooting purposes.
			
			const longTitle = typeof merged.nameLong === "undefined" ? merged.name : merged.nameLong
			const html = MarkUpCode.getCardHtmlString( id, merged.name, longTitle, Url.getUrlFrag(merged.dimensions.nonUi), MS.CARD_SLOT_ANCHOR_DOM_ID )
			const doc = parser.parseFromString(html, "text/html")
			document.getElementById(containerId).appendChild( doc.body.firstElementChild )

			// info is either in box or in card
			const DSIdBox = merged.dataset["exclusive"] ? null : merged.dataset
			const DSIdCard = merged.dataset["exclusive"] ? merged.dataset.exclusive.id : null

			const boxes = Selects.createDropdownBoxes(merged.dimensions.ui.dropdown, DSIdBox)
			addBoxEventHandlers(id, boxes, selectedCallback)
			insertBoxes(id, boxes)
			setupCard(id, merged, onCardExpand, onCardContract, DSIdCard)
			setupRange(id, merged.dimensions.ui.range[0], selectedCallback)

			if(merged.isInOverview && merged.isInOverview===true) { overviewCardIds.push(id) }

			retVal.push(id)

			if(merged["hanSolo"]) {break}	// only one card
		}
	}
	setOverviewCardIds(overviewCardIds)

	countryNamesFull = getMapFromArray(cfg.codeList.countries)

	return retVal
}

function setupCard(id, merged, onCardExpand, onCardContract, DSIdCard) {
	const card = document.getElementById(id)
	card.addEventListener("expanding", () => { onCardExpand(id) })
	card.addEventListener("contracting", () => { onCardContract(id) })
	card.addEventListener("chartSwitched", (e) => { Range.reset(id, e.to==2, true, e.to==2) })
	card.setAttribute("unitShort", merged.dimensions.nonUi.unit[0].label)
	card.setAttribute("unitLong", merged.dimensions.nonUi.unit[0].labelLong ? merged.dimensions.nonUi.unit[0].labelLong : merged.dimensions.nonUi.unit[0].label)
	if(merged.dataset["exclusive"]) {
		card.setAttribute("srcLink1", merged.dataset.exclusive.source)
		card.setAttribute("srcLink2", merged.dataset.exclusive.source)
	} else {
		card.setAttribute("srcLink1", merged.dataset.citizen.source)
		card.setAttribute("srcLink2", merged.dataset.birth.source)
	}
	card.setAttribute("articleLink", merged.articleLink.url)
	card.tooltipFn1 = TooltipLine.tooltipFn
	card.tooltipFn2 = TooltipDot.tooltipFn
	card.tooltipCSS = TooltipCommon.CSS()
	card.setLegendTexts([MS.TXT_BY_LBL_CNEU, MS.TXT_BY_LBL_CEU, MS.TXT_BY_LBL_CNAT])

	card.userData = Subtitle.getInfoAboutOrder(
		getMapFromArrayWObjects(merged.dimensions.ui.dropdown), 
		getMapFromArrayWObjects(merged.dimensions.ui.subtitle),
		merged.dimensions.nonUi,
		merged.dimensions.excludeFromSubtitle)
	
	card.setAttribute("infoText", merged.infoText ? merged.infoText : "No information available.")

	card.decimals = typeof merged.decimals === "undefined" ? 1 : merged.decimals

	if(DSIdCard) { card.setAttribute("dataset", DSIdCard) }

	card.lineHoverCallback = onLineHover
}

export function updateCardAttributes(cardId, boxes, textRight) {
  const card = document.getElementById(cardId)
  card.setAttribute("right1", textRight)
  card.setAttribute("right2", "")
  card.setAttribute("subtitle_c", card.getAttribute("unitLong") + Subtitle.get(card.userData, boxes, "Age") )
  card.setAttribute("subtitle_e", card.getAttribute("unitLong") + Subtitle.get(card.userData, boxes) )
}

function setupRange(id, values, selectedCallback) {
	Range.setCallbacks(id, () => {
		TooltipDot.setHeader( document.getElementById("timeRange"+id).valuel )
		selectedCallback(id)
	})
	Range.setValuesFromConfig(id, values.start, values.end, values.selected)
	TooltipDot.setHeader( document.getElementById("timeRange"+id).valuel )
}

export function getIdFromName(name) {
	return MS.CARD_DOM_ID_PREFIX + name.replaceAll(" ", "-")		// or a hash
}

// note: by-select's counterpart (in terms of constraints) - the geo box - is set and handeled somewhere else!
function addBoxEventHandlers(id, boxes, selectedCallback) {
	for(const box of boxes) {

		const domEl = box.docFrag.firstElementChild.box

		domEl.onSelect = function(k,v) {

			const c = [MS.BY_SELECT_ID, MS.INDIC_MG_ID, MS.INDIC_LEG_FRAM].includes(box.dimId)	// TODO dry
			if(c) {
				if(CommonConstraints.bySelectionAllowed( BySelectConstraint.howManyAreGoingToBeSelected(k) )) {
					return true
				} else {
					PopUpMessage.show(PopUpMessage.TEXT.FOR_BY)
					return false
				}
			}
			return true
		}

		domEl.onSelected = function(k,v) {
			const c = [MS.BY_SELECT_ID, MS.INDIC_MG_ID, MS.INDIC_LEG_FRAM].includes(box.dimId)	// TODO dry
			if(c) {
				if(!GROUPS.isGroup(k)) { domEl.selected = [k]	}
			}

			// assumption: a caller is not interested in one box's selection right here, so omit passing on k,v.
			// why? because the caller can ask the card for all selections of all boxes at once.
			selectedCallback(id)
		}
	}
}

function insertBoxes(id, boxes) {
	const el = document.getElementById(MS.CARD_SLOT_ANCHOR_DOM_ID+id)
	for(const box of boxes) {
		el.insertAdjacentElement("afterbegin", box.docFrag.firstElementChild)
	}
}

export function getCurrentSelections(cardId) {
	let retVal = [{cardId: cardId, selections: new Map()}, ""]

	const card = document.getElementById(cardId)
	// mimic (adapt to) select's api
	const range = card.querySelector("range-slider")
	retVal[0].selections.set("time", Range.getSelection(range))

	let dataset = card.getAttribute("dataset")

	const boxes = getAllBoxes(cardId)
	if(boxes.length===0) { console.warn("cards: no boxes for", cardId) }
	for(let box of boxes) {
		if(box.hasAttribute("dimension")) {
			retVal[0].selections.set(box.getAttribute("dimension"), box.box.selected)
			// this is the place to retrieve the dataset from the by-select
			if(!dataset && box.getAttribute("dimension") === MS.BY_SELECT_ID) {
				dataset = BySelectConstraint.getDataset(box)
			}
		} else {
			//console.warn("cards.mjs: box has no dimension:",box)
		}
	}

	retVal[1] = dataset

	return retVal
}

function getAllBoxes(cardId) {
	const boxSelector = `#${MS.CARD_SLOT_ANCHOR_DOM_ID}${cardId} >  titled-select`	//div ecl-like-select-x
	//console.log(document.querySelectorAll(boxSelector))
	return document.querySelectorAll(boxSelector)
}

export function getBySelectBox(cardId) {
	const boxes = getAllBoxes(cardId)
	for(const box of boxes) {
		if([MS.BY_SELECT_ID, MS.INDIC_MG_ID, MS.INDIC_LEG_FRAM].includes(box.getAttribute("dimension"))) {
			return box
		}	// TODO dry
	}	
}


// TODO: order by current visibility (the cards in viewport before others)
export function iterate(containerId, callback) {
	const childs = document.getElementById(containerId).children
	for(let i=0; i<childs.length; i++) {
		callback(childs[i].getAttribute("id"), childs.length)
	}
}

export function setData(cardId, geoSelections, isInGroupC, data, cb) {
	Range.setMinMax(cardId, Number(data.time[0]), Number(data.time[data.time.length-1]))

	const card = document.getElementById(cardId)

	card.switchSrcLink(isInGroupC)
	card.setData1({
		cols: data.timeSeries.data,	countryNamesFull:countryNamesFull,
		palette:data.colorPalette, fixColors:getColorSet(true, geoSelections)
	}, ()=>{
	card.setData2({
		cols: data.countrySeries.data, countryNamesFull:countryNamesFull,
		palette:data.colorPalette, fixColors:getColorSet(false, geoSelections),
		highlightIndices:getIndices(data,geoSelections)
			}, cb)
	})
}

function getIndices(data, geoSelections) {
	const retVal = []
	const bla = Array.from(geoSelections.keys())
	for(let i=0;i<data.countrySeries.data[0].length;i++) {
		if(bla.includes(data.countrySeries.data[0][i])) {
			retVal.push(i)
		}
	}
	return retVal
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
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_SHORT_CNAT] = colorsEU.dark
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_SHORT_CEU] = colorsEU.mid
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_SHORT_CNEU] = colorsEU.light

		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_SHORT_BNAT] = colorsEU.dark
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_SHORT_BEU] = colorsEU.mid
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_SHORT_BNEU] = colorsEU.light

	} else {		// fixed colors for dot plot
		
		retVal[MS.TXT_BY_LBL_CNAT] = colorsSet1.dark
		retVal[MS.TXT_BY_LBL_CEU] =  colorsSet1.mid
		retVal[MS.TXT_BY_LBL_CNEU] = colorsSet1.light
		
		retVal[MS.TXT_BY_LBL_BNAT] = colorsSet1.dark
		retVal[MS.TXT_BY_LBL_BEU] = colorsSet1.mid
		retVal[MS.TXT_BY_LBL_BNEU] = colorsSet1.light

		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_CNAT] = colorsEU.dark		// see also "firstDifferent" in chart config options
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_CEU] = colorsEU.mid
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_CNEU] = colorsEU.light
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_BNAT] = colorsEU.dark
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_BEU] = colorsEU.mid
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_BNEU] = colorsEU.light

	}
	return retVal
}

export function contractAll(except) {		// but we assume that max 1 can be expanded; instead of "find the 1 expanded"
	iterate(MS.CARD_CONTAINER_DOM_ID, (cardId) => {
		if(cardId!==except) { document.getElementById(cardId).contract() }
	})
}

export function setDefaultSelections(node) {
	const elements = node.querySelectorAll("titled-select")
	for (let i = 0; i < elements.length; i++) {
		elements[i].box.selectDefaults()
	}
}

export function expand(card) {
	contractAll(card.getAttribute("id"))
	card.expand(document.getElementById("anchorSelectCountryOutsideOfCard"))
}

export function filter(cardsOfCategory) {
	const elements = document.querySelectorAll("div [id=cards] chart-card")
	if(cardsOfCategory.length>0) {
		for (var i = 0; i < elements.length; i++) {
			if( cardsOfCategory.includes(elements[i].id) ) {
				elements[i].isVisible=true
			} else {
				elements[i].isVisible=false
			}
		}
	}
}

// this is a singleton behaviour, so NOT for each card.
// assumption: in overview, all cards have the same tooltip style.
// if that assumtion doesn't hold anymore,
// this function would need another parameter (cardId)...
export function setTooltipStyle(numberOfBySelected) {
	TooltipLine.setGroupByCountry(numberOfBySelected !== 1)
	onLineHover([])
}

export function storeSelectedCounts(_numberOfCountriesSelected, _numberOfBySelected) {
	numberOfCountriesSelected = _numberOfCountriesSelected
	numberOfBySelected = _numberOfBySelected
}

// number of selectable items
export function setNOSelectable(cardId, geo, by) {
	const byBox = getBySelectBox(cardId)
	byBox.labelNumber=by
	if(document.getElementById(cardId).isExpanded) {
		const geoBox = document.getElementById(MS.GEO_SELECT_DOM_ID)
		geoBox.labelNumber=geo
	}
}

// these "ids" are billboard.js specific - a substring w/ substitutions of SVG element's class
function onLineHover(ids) {
	if(numberOfCountriesSelected * numberOfBySelected === 6) {
		if(ids.length>0) { 
			TooltipLine.setFilter([ids[0].slice(0,2)])	// let only 1 pass through filter -> show only hovered item-group in tooltip
		} else {
			TooltipLine.setFilter([""])		// effectively filter everything (there is no "" ever) -> no tooltip
		}
	} else {
		TooltipLine.setFilter([])		// filter nothing -> normal tooltip
	}
}
