// all the boxes for one card

import {MS} from "../../../common/magicStrings.mjs"


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
    attribs.set("id", Math.floor(Math.random() * 10000))  // doesnt matter which, this is only needed to make it dismissable
    const width = typeof cfg[i][boxName]["width"] === "undefined" ? "200px" : cfg[i][boxName]["width"]
    attribs.set("style", `width:${width}; margin-right: 20px;`)

    const [items, disabledItems, groups, selected] = getItemInfos(cfg[i][boxName]["items"])

    // hardcoded here: add additional info to DOM element
    if(boxName===MS.BY_SELECT_ID) {
      if(datasets && datasets["citizen"] && datasets["birth"]) {
        attribs.set(MS.DS_ID_CITIZEN, datasets["citizen"]["id"])
        attribs.set(MS.DS_ID_BIRTH, datasets["birth"]["id"])
      }
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

/*
k: "sex"
v:
 [
    {
      "label": "Total",
      "code": "TOTAL"
    }
  ]
}
see also cards.mjs::insertAndHookUpBoxes()
note: the structure is assumed in multiple locations: i.e. addBoxEventHandlers, onCardExpand  TODO: find elegant solution for this
*/
function getDocFrag(items, disabledItems, attribs, label, isMultiselect=false, groups={}, defaultSelections=[]) {
	const fragment = new DocumentFragment()

	const dropdownBox = document.createElement('ecl-like-select-x')
  attribs.forEach( (v,k) => dropdownBox.setAttribute(k,v) )
  dropdownBox.defaultSelections = defaultSelections
  dropdownBox.disabledSelections = disabledItems
  if(isMultiselect) {
    dropdownBox.setAttribute("multiselect", "true")
  }
  dropdownBox.data = [items, getGroupsFromObject(groups)]
  dropdownBox.style.whiteSpace = "nowrap"
  dropdownBox.style.textOverflow = "ellipsis"
  dropdownBox.textForMultiselect = "Items selected"

  const div = document.createElement('div')

  const labelLeft = document.createElement('a')
  labelLeft.innerHTML = label
  labelLeft.classList.add("boxLabelLeft")

  div.appendChild(labelLeft)
  div.appendChild(dropdownBox)

  fragment.appendChild(div)
	return fragment
}


function getGroupsFromObject(obj) {
  const retVal = new Map()
  for (const [k, v] of Object.entries(obj)) {
    retVal.set(k, {text:v,selectable:true})
  }
  return retVal
}
