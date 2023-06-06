import * as Logic from "./bySelectBox.mjs"
import * as MS from "./magicStrings.mjs"


export function configCountries(id, cfg, callback) {
  const box = document.getElementById(id)
  box.onSelect = callback
  box.selected = ["EU","IT"]
	box.data = [getMapFromObject(cfg), []]
  return document.getElementById(id)
}

//usually sex & age. possibility for more per config.
export function createDropdownBoxes(cfg) {
  let retVal = []

  for(const i in cfg) {
    const k = Object.keys(cfg[i])[0]    // eg "age"
    const v = cfg[i][k]["elements"]                 // [{label:.., code:..}]
    const isMultiselect = cfg[i][k]["groups"] ? true : false  // a bit of a short-cut cheat. if groups but not multiselect is needed, change yaml to support that - and inc. semver there accordingly
    retVal.push({dimId: k, docFrag: createDropdown(k, v, isMultiselect, cfg[i][k]["groups"])})
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
function createDropdown(k, v, isMultiselect=false, groups={}) {
	const fragment = new DocumentFragment()
	const dropdownBox = document.createElement('ecl-like-select' + (isMultiselect?"-x":""))
  dropdownBox.setAttribute("dimension", k)
  if(isMultiselect) {   // TODO: it works for now but it's obviously not correct!
    dropdownBox.setAttribute("multiselect",null)
    //dropdownBox.selected = [v[0].code, v[1].code, v[2].code]
    Logic.imposeConstraints(dropdownBox)
  }

  dropdownBox.data = [getMapFromObject(v), getGroupsFromObject(groups)]
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