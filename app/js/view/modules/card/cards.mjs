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
import * as Selects from "../select/selectBoxes.mjs"
import * as BySelectConstraint from "../select/constraints/bySelectConstraints.mjs"
import * as CommonConstraints from "../select/constraints/commonConstraints.mjs"
import {MS} from "../../../common/magicStrings.mjs"
import * as Url from "../../../model/url.mjs"
import * as Util from "../../../../components/util/util.mjs"
import {getMapFromArray, getMapFromArrayWObjects}  from "../util.mjs"
import * as TooltipLine from "./elements/tooltips/tooltipLineChart.mjs"
import * as TooltipDot from "./elements/tooltips/tooltipDotChart.mjs"
import * as TooltipCommon from "./elements/tooltips/common.mjs"
import "../../../../components/range/range.mjs"							// the WebComponent
import * as Range from "./elements/range.mjs"
import * as Subtitle from "./elements/subtitle.mjs"
import * as PopUpMessage from "../popUpMessage.mjs"
import {isGroup} from "../../../model/common/groupDefinition.mjs"
import {setOverviewCardIds} from "../cardToMenuMapping.mjs"
import {getColorSet, getColorSetDefinitions} from "./elements/colorSets.mjs"
import { isBySelectBox, getBySelectBox as _getBySelectBox } from "../select/bySelect.mjs"

let countryNamesFull = {}		// used by tooltip; via context, meaning: it doesn't come from processors/data but from config
let numberOfCountriesSelected = 0		// TODO: possible to get rid of this?
let numberOfBySelected = 0					// TODO: possible to get rid of this?
const parser = new DOMParser()
const detailLegends = new Map()			// each card gets it's own legend, which is inserted via slot-mechanism

// pretty much the core of processing the YAML
export function create(containerId, cfg, selectedCallback, onCardExpand, onCardContract) {
	let retVal = []
	let overviewCardIds = []

	for(const i in cfg.indicators) {

		const merged = Util.mergeObjects(cfg.indicatorBase, cfg.indicators[i])
		const id = getIdFromName(merged.name)
		
		if(!merged.ignore) {
	
			console.debug("cards: merged cfg for indicator", merged.name, merged, id)

			if(merged["hanSolo"]) {document.getElementById(containerId).innerHTML = ""}			// undocumented feature. for troubleshooting purposes.

			const longTitle = typeof merged.nameLong === "undefined" ? merged.name : merged.nameLong
			const html = MarkUpCode.getCardHtmlString( id, merged.name, longTitle, Url.getUrlFrag(merged.dimensions.nonUi), MS.CARD_SLOT_ANCHOR_DOM_ID )
			const doc = parser.parseFromString(html, "text/html")
			document.getElementById(containerId).appendChild( doc.body.firstElementChild )

			detailLegends.set(id,document.getElementById(MS.DOM_ID_DETAIL_LEGEND+id))

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
	card.addEventListener("expanding", () => { 
		document.getElementById(MS.CARD_CONTAINER_DOM_ID).style.position="absolute"
		onCardExpand(id) 
	})
	card.addEventListener("contracting", () => { 
		document.getElementById(MS.CARD_CONTAINER_DOM_ID).style.position=""
		onCardContract(id) 
	})
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
	setLegendTexts(card, id)

	card.userData = Subtitle.getInfoAboutOrder(
		getMapFromArrayWObjects(merged.dimensions.ui.dropdown), 
		getMapFromArrayWObjects(merged.dimensions.ui.subtitle),
		merged.dimensions.nonUi,
		merged.dimensions.excludeFromSubtitle)
	
	card.setAttribute("infoText", merged.infoText ? merged.infoText : "No information available.")

	card.decimals = typeof merged.decimals === "undefined" ? 1 : merged.decimals

	if(DSIdCard) { card.setAttribute("dataset", DSIdCard) }

	card.lineHoverCallback = onLineHover


	function setLegendTexts(card, cardId) {
		const uu = [MS.TXT_BY_LBL_CNEU, MS.TXT_BY_LBL_CEU, MS.TXT_BY_LBL_CNAT]
		if(cardId===getIdFromName(MS.NAME_CARD_ACTIVE_CITIZENSHIP_1)) {		// :-(
			uu[2] = ""
		}
		if(cardId===getIdFromName(MS.NAME_CARD_ACTIVE_CITIZENSHIP_2)) {
			uu[1] = ""
			uu[2] = ""
		}
		card.setLegendTexts(uu)
	}
}

export function updateCardAttributes(cardId, boxes, textRight) {
  const card = document.getElementById(cardId)
  card.setAttribute("right1", textRight)
  card.setAttribute("right2", "")
  card.setAttribute("subtitle_c", card.getAttribute("unitLong") + Subtitle.get(card.userData, boxes, "Age") )
  card.setAttribute("subtitle_e", card.getAttribute("unitLong") + Subtitle.get(card.userData, null, "Age") )
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

			if(isBySelectBox(box.dimId)) {
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
			if(isBySelectBox(box.dimId)) {
				if(!isGroup(k)) { domEl.selected = [k]	}
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
	const boxSelector = `#${MS.CARD_SLOT_ANCHOR_DOM_ID}${cardId} >  titled-select`
	return document.querySelectorAll(boxSelector)
}

export function getBySelectBox(cardId) {
	return _getBySelectBox( getAllBoxes(cardId) )
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
			highlightIndices:getIndices(data,geoSelections), meta: data.countrySeries.meta
		}, cb)
	})
}

export function updateDetailLegend(cardId, geoSelections, dataSeriesKeys, isInGroupC, bySelectCount) {

	let countries, dots

	if(document.getElementById(cardId).chart1Displayed) {
		countries = Array.from(geoSelections.keys()),
		dots = getTextAndColor(dataSeriesKeys, getColorSet(true, geoSelections))
		detailLegends.get(cardId).show = bySelectCount>=2
	} else {
		countries = ["EU","Others"]
		const c = getColorSetDefinitions()
		dots = new Map()
		if(isInGroupC) {
			dots.set("EU, "+MS.TXT_BY_LBL_SHORT_CNEU, c.EU.light)
			dots.set("EU, "+MS.TXT_BY_LBL_SHORT_CEU,  c.EU.mid)
			dots.set("Others, "+MS.TXT_BY_LBL_SHORT_CNEU, c.SET1.light)
			dots.set("Others, "+MS.TXT_BY_LBL_SHORT_CEU, c.SET1.mid)
			if(bySelectCount>2) {
				dots.set("EU, "+MS.TXT_BY_LBL_SHORT_CNAT, c.EU.dark)
				dots.set("Others, "+MS.TXT_BY_LBL_SHORT_CNAT, c.SET1.dark)
			}
		} else {
			dots.set("EU, "+MS.TXT_BY_LBL_SHORT_BNEU, c.EU.light)
			dots.set("EU, "+MS.TXT_BY_LBL_SHORT_BEU,  c.EU.mid)
			dots.set("EU, "+MS.TXT_BY_LBL_SHORT_BNAT, c.EU.dark)
			dots.set("Others, "+MS.TXT_BY_LBL_SHORT_BNEU, c.SET1.light)
			dots.set("Others, "+MS.TXT_BY_LBL_SHORT_BEU, c.SET1.mid)
			dots.set("Others, "+MS.TXT_BY_LBL_SHORT_BNAT, c.SET1.dark)
		}
		detailLegends.get(cardId).show = bySelectCount>1
	}
	
	detailLegends.get(cardId).content = {countries:countries, dots:dots}

	function getTextAndColor(x,y) {
		const retVal = new Map()
		x.forEach(e=>{
			retVal.set(e, y[e])
		})
		return retVal
	}
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

// filter out (hide) everything except the given
export function filter(cardIdArray) {
	const elements = document.querySelectorAll("div [id=cards] chart-card")
	if(cardIdArray.length>0) {
		for (var i = 0; i < elements.length; i++) {
			if( cardIdArray.includes(elements[i].id) ) {
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
	const byBox = _getBySelectBox(getAllBoxes(cardId))
	byBox.labelNumber=by
	if(document.getElementById(cardId).isExpanded) {
		const geoBox = document.getElementById(MS.GEO_SELECT_DOM_ID)
		geoBox.labelNumber=geo
	}
}

// these "ids" are billboard.js specific - a substring w/ substitutions of SVG element's class
function onLineHover(ids) {
	if(numberOfCountriesSelected>1 && numberOfBySelected>1) {
		if(ids.length>0) { 
			TooltipLine.setFilter([ids[0].slice(0,2)])	// let only 1 pass through filter -> show only hovered item-group in tooltip
		} else {
			TooltipLine.setFilter([""])		// effectively filter everything (there is no "" ever) -> no tooltip
		}
	} else {
		TooltipLine.setFilter([])		// filter nothing -> normal tooltip
	}
}
