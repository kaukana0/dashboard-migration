import {MS} from "./magicStrings.mjs"
import * as Logic from "./bySelectBox.mjs"


export function configCountries(id, cfg, callback) {
  const box = document.getElementById(id)
  box.onSelect = callback
  box.selected = ["EU","IT"]
	box.data = [getMapFromObject(cfg), []]
  return document.getElementById(id)
}

//usually sex & age. possibility for more per config.
export function createDropdownBoxes(boxes, datasets) {
  let retVal = []

  for(const i in boxes) {
    const attribs = new Map()
    const boxName = Object.keys(boxes[i])[0]          // eg "age"
    attribs.set("dimension", boxName)
    const items = boxes[i][boxName]["elements"]           // [{label:.., code:..}]

    // something "special" - put additional info in DOM element
    if(boxName===MS.BY_SELECT_ID) {
      if(datasets) {
        attribs.set(MS.DS_ID_BIRTH, datasets["birth"]["id"])
        attribs.set(MS.DS_ID_CITIZEN, datasets["citizen"]["id"])
      } else {
        console.warn("selectBoxes: datasets in yaml missing for:", boxName)
      }
    }

    // a bit of a short-cut cheat. 
    // if groups but not multiselect is needed, change yaml to support that - don't forget to inc. semver in the yaml
    const isMultiselect = boxes[i][boxName]["groups"] ? true : false

    retVal.push({dimId: boxName, docFrag: createDropdown(items, attribs, isMultiselect, boxes[i][boxName]["groups"])})

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
note: only a card wants to know if a selection of a box changed - see cards.mjs::insertAndHookUpBoxes()
*/
function createDropdown(items, attribs, isMultiselect=false, groups={}) {
	const fragment = new DocumentFragment()

	const dropdownBox = document.createElement('ecl-like-select' + (isMultiselect?"-x":""))

  attribs.forEach( (v,k) => dropdownBox.setAttribute(k,v) )

  if(isMultiselect) {   // TODO: it works for now but it's obviously not correct!
    dropdownBox.setAttribute("multiselect",null)
    Logic.imposeConstraints(dropdownBox)
  }

  dropdownBox.data = [getMapFromObject(items), getGroupsFromObject(groups)]
	fragment.appendChild(dropdownBox)

	return fragment
}

// TODO: get rid of this by using Map in the first place
function getMapFromObject(obj) {
  const retVal = new Map()
  for(const e of obj) {
    retVal.set(e.code, e.label)
  }
  return retVal
}

function getGroupsFromObject(obj) {
  const retVal = new Map()
  for (const [k, v] of Object.entries(obj)) {
    retVal.set(k, {text:v,selectable:true})
  }
  return retVal
}