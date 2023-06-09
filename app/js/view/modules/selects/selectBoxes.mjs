import {MS} from "./magicStrings.mjs"


export function configCountries(id, cfg, callback) {
  const box = document.getElementById(id)
  box.onSelected = callback
	box.data = [getMapFromObject(cfg), new Map()]
  box.selected = ["EU","IT"]
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
        attribs.set("multiselect", "1")
        attribs.set(MS.DS_ID_BIRTH, datasets["birth"]["id"])
        attribs.set(MS.DS_ID_CITIZEN, datasets["citizen"]["id"])
      } else {
        console.warn("selectBoxes: datasets in yaml missing for:", boxName)
      }
    }

    // a bit of a short-cut cheat. 
    // if groups but not multiselect is needed, change yaml to support that - don't forget to inc. semver in the yaml
    const isMultiselect = boxes[i][boxName]["groups"] ? true : false

    retVal.push({dimId: boxName, docFrag: getDocFrag(items, attribs, isMultiselect, boxes[i][boxName]["groups"])})

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
function getDocFrag(items, attribs, isMultiselect=false, groups={}) {
	const fragment = new DocumentFragment()
	const dropdownBox = document.createElement('ecl-like-select-x')

  dropdownBox.style.width = "250px"
  attribs.forEach( (v,k) => dropdownBox.setAttribute(k,v) )

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