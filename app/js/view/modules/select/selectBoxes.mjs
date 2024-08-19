/**
This creates all the boxes for one card.
note: it's done via createElement because innerHTML has some showstopping async-behaviour.
*/

import {MS} from "../../../common/magicStrings.mjs"
import {isBySelectBox} from "../select/bySelect.mjs"


// "cfg" is the dimensions.ui.dropdown section from the yaml config, converted to json.
// usually sex & age. possibility more, depending on the yaml.
// returns list of objects, which have {dimId:.., html-DocumentFragment:..}
export function createDropdownBoxes(cfg, datasets) {
  let retVal = []

  // TODO: make more comprehensive by using getMapFromArrayWObjects()
  for(const i in cfg) {

    const boxName = Object.keys(cfg[i])[0]          // eg "Age"
    if(typeof cfg[i][boxName]["inherit"] !== "undefined" && cfg[i][boxName]["inherit"]===false) {continue}

    const attribs = new Map()
    attribs.set("dimension", boxName)
    attribs.set("aria-label", boxName+" selectbox. Selections are automatically applied to the graph below.")
    attribs.set("id", Math.floor(Math.random() * 10000))  // doesnt matter which, this is only needed to make it dismissable
    
    const width = typeof cfg[i][boxName]["width"] === "undefined" ? "200px" : cfg[i][boxName]["width"]
    attribs.set("style", `min-width:${width}; max-width:400px;`) // flex:1 1 0;

    const [items, disabledItems, groups, selected] = getItemInfos(cfg[i][boxName]["items"])

    // hardcoded here: add additional info to DOM element
    if(isBySelectBox(boxName)) {
      if(datasets && datasets["citizen"] && datasets["birth"]) {
        attribs.set(MS.DS_ID_CITIZEN, datasets["citizen"]["id"])
        attribs.set(MS.DS_ID_BIRTH, datasets["birth"]["id"])
      }
      attribs.set("labelRight", "selectable")
    }

    const isMultiselect = (typeof cfg[i][boxName]["multiselect"] !== "undefined") && cfg[i][boxName]["multiselect"] === true
    const label = (typeof cfg[i][boxName]["label"] === "undefined") ? boxName : cfg[i][boxName]["label"]

    retVal.push({dimId: boxName, docFrag: getDocFrag(items, disabledItems, attribs, label, isMultiselect, groups, selected)})
  }

  return retVal
}

// collect info about certain aspects (of a selectBox's items) 
// into data-structures (which are expected further down the line.)
function getItemInfos(selectBoxItemsCfg) {
  let items = new Map()
  let disabledItems = []
  let groups = {}
  let selected = []

  if(Array.isArray(selectBoxItemsCfg)) {
    for(const e of selectBoxItemsCfg) {
      items.set(e.code, e.label)
      if(typeof e["enabled"] !== "undefined" && e["enabled"]===false) {
        disabledItems.push(e.code)
      }
      if(typeof e["groupStart"] !== "undefined") {
        groups[e.code] = e.groupStart
        if(e.groupSelected && e.groupSelected===true) { selected.push(e.groupStart) }
      }
      if(e.selected && e.selected===true) { selected.push(e.code) }
    }
  } else {
    console.error("selectBoxes: dimensions.ui.dropdown is not an array")
  }

  return [items, disabledItems, groups, selected]
}

// note that the country/geo box is in geoSelect.mjs (because it's not card specific)
function getDocFrag(items, disabledItems, attribs, label, isMultiselect=false, groups={}, defaultSelections=[]) {
  const select = document.createElement('titled-select')

  const dropdownBox = select.box

  attribs.forEach( (v,k) => {
    select.setAttribute(k,v)
    dropdownBox.setAttribute(k,v)
  } )
  if(isMultiselect) {
    dropdownBox.setAttribute("multiselect", "true")
  }
  select.style.whiteSpace = "nowrap"
  select.style.textOverflow = "ellipsis"
  dropdownBox.textForMultiselect = "Items selected"
  dropdownBox.defaultSelections = defaultSelections
  dropdownBox.disabledSelections = disabledItems
  dropdownBox.data = [items, getGroupsFromObject(groups)]

  select.labelLeft = label

  select.classList.add("unifiedSelectboxSize")
  dropdownBox.classList.add("unifiedSelectboxSize")

  const fragment = new DocumentFragment()
  fragment.appendChild(select)
  return fragment
}

function getGroupsFromObject(obj) {
  const retVal = new Map()
  for (const [k, v] of Object.entries(obj)) {
    retVal.set(k, {text:v,selectable:true})
  }
  return retVal
}
