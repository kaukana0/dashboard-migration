// all the boxes for one card

import {MS} from "../../../common/magicStrings.mjs"
import {getMapFromArray} from "../util.mjs"


// "cfg" is the dimensions.ui.dropdown section from the yaml config, converted to json.
// usually sex & age. possibility more, depending on the yaml.
// returns list of objects, which have {dimId:.., html-DocumentFragment:..}
export function createDropdownBoxes(cfg, datasets) {
  let retVal = []

  // TODO: make more comprehensive by using getMapFromArrayWObjects()
  for(const i in cfg) {

    const boxName = Object.keys(cfg[i])[0]          // eg "age"
    if(typeof cfg[i][boxName]["inherit"] !== "undefined" && cfg[i][boxName]["inherit"]===false) {continue}
    const elements = cfg[i][boxName]["elements"]    // [{label:.., code:.., selected:false/true}]
    
    const items = getMapFromArray(elements)
    
    const attribs = new Map()
    attribs.set("dimension", boxName)
    attribs.set("id", Math.floor(Math.random() * 10000))  // doesnt matter which, this is only needed to make it dismissable
    attribs.set("style", "width:200px; margin-right: 20px;")

    // something "special" here - add additional info to DOM element
    if(boxName===MS.BY_SELECT_ID) {
      if(datasets) {
        attribs.set("multiselect", "true")
        attribs.set("style", "width:360px; margin-right: 20px;")
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
note: the structure is assumed in multiple locations: i.e. addBoxEventHandlers, onCardExpand  TODO: find elegant solution for this
*/
function getDocFrag(items, attribs, isMultiselect=false, groups={}, defaultSelections=[]) {
	const fragment = new DocumentFragment()

	const dropdownBox = document.createElement('ecl-like-select-x')
  attribs.forEach( (v,k) => dropdownBox.setAttribute(k,v) )
  dropdownBox.defaultSelections = defaultSelections
  dropdownBox.data = [items, getGroupsFromObject(groups)]
  dropdownBox.style.whiteSpace = "nowrap"
  dropdownBox.style.textOverflow = "ellipsis"
  dropdownBox.textForMultiselect = "Items selected"

  const div = document.createElement('div')

  const labelLeft = document.createElement('a')
  labelLeft.innerHTML = attribs.get("dimension")
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

function getDefaultSelectionsFromObject(obj) {
  const retVal = []
  for(const e of obj) {
    if(e.selected && e.selected===true) { retVal.push(e.code) }
  }
  return retVal
}
