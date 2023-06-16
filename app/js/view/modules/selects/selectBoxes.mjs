// all the boxes for one card

import {MS} from "./magicStrings.mjs"
import {getMapFromObject} from "./util.mjs"


// "cfg" is the dimensions.ui.dropdown section from the yaml config, converted to json.
// usually sex & age. possibility more, depending on the yaml.
// returns list of objects, which have {dimId:.., html-DocumentFragment:..}
export function createDropdownBoxes(cfg, datasets) {
  let retVal = []

  for(const i in cfg) {
    const attribs = new Map()

    const boxName = Object.keys(cfg[i])[0]          // eg "age"

    const elements = cfg[i][boxName]["elements"]    // [{label:.., code:.., selected:false/true}]
    const items = getMapFromObject(elements)

    attribs.set("dimension", boxName)
    attribs.set("id", Math.floor(Math.random() * 10000))  // doesnt matter which, this is only needed to make it dismissable
    attribs.set("style", "width:250px;")

    // something "special" here - add additional info to DOM element
    if(boxName===MS.BY_SELECT_ID) {
      if(datasets) {
        attribs.set("multiselect", "1")
        attribs.set(MS.DS_ID_CITIZEN, datasets["citizen"]["id"])
        attribs.set(MS.DS_ID_BIRTH, datasets["birth"]["id"])
      } else {
        console.error("selectBoxes: datasets in yaml missing for:", boxName)
      }
    }

    // a bit of a short-cut cheat. 
    // if groups but not multiselect is needed, change yaml to support that - don't forget to inc. semver in the yaml
    const isMultiselect = cfg[i][boxName]["groups"] ? true : false

    retVal.push({dimId: boxName, docFrag: getDocFrag(items, attribs, isMultiselect, cfg[i][boxName]["groups"], getDefaultSelectionsFromObject(elements))})
  }

  return retVal
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
*/
function getDocFrag(items, attribs, isMultiselect=false, groups={}, defaultSelections=[]) {
	const fragment = new DocumentFragment()
	const dropdownBox = document.createElement('ecl-like-select-x')

  attribs.forEach( (v,k) => dropdownBox.setAttribute(k,v) )

  dropdownBox.defaultSelections = defaultSelections
  dropdownBox.data = [items, getGroupsFromObject(groups)]

  fragment.appendChild(dropdownBox)
	return fragment
}


function getGroupsFromObject(obj) {
  const retVal = new Map()
  for (const [k, v] of Object.entries(obj)) {
    retVal.set(k, {text:v,selectable:true})
  }
  return retVal
}

function getDefaultSelectionsFromObject(obj) {
  const retVal = []
  for(const e of obj) {
    if(e.selected && e.selected===true) { retVal.push(e.code) }
  }
  return retVal
}
