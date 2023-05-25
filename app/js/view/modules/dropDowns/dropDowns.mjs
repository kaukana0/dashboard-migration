import * as Logic from "./logic.mjs"
import * as MS from "./magicStrings.mjs"


export function configCountries(id, cfg, callback) {
  const box = document.getElementById(id)
  box.onSelect = callback
  box.selected = ["EU","IT"]
	box.data = [getMapFromObject(cfg), []]
  return document.getElementById(id)
}

/*
usually sex & age. more on demand per config.

cfg expected to be similar to:
[
  {
    "age": [
      {
        "label": "over 65 years",
        "code": "someCode"
      }
    ]
  },
  {
    "sex": [
      {
        "label": "one",
        "code": "two"
      }
    ]
  }
]*/
export function createDropdownBoxes(cfg) {
  let retVal = []

  for(const i in cfg) {
    const k = Object.keys(cfg[i])[0]    // eg "age"
    const v = cfg[i][k]                 // [{label:.., code:..}]
    retVal.push({dimId: k, docFrag: createDropdown(k,v)})
  }

  return retVal
}


/*
it's called "combi" because it's somehow two boxes in one.
one group of the box-entries belongs to one dataset, the other to another.

the keys of it's entries are a compound of this form:
"CODE/DIMENSION/DATASETID"
*/
export function createCombiBoxes(cfg, datasets) {
  let retVal = []

  for(const i in cfg) {     // "bySelect" (just one)
    for(const j in cfg[i]) {  //cBirth, citizen
      let ll = []
      for(const k in cfg[i][j]) {
        const key = Object.keys(cfg[i][j][k])[0]    // dim
        const v = structuredClone( cfg[i][j][k][key].entries )        // [{label,code}]
        for(const l in v) {
          // in contrast to the other dropdowns which have string keys, this has a object as key.
          // effectively making the key of the by-Select-entries a compound of 3 distinct informations.
          // this way we can keep the yaml simple.
          v[l].code = JSON.stringify( {code:v[l].code, dimension:key, dataset:datasets[k].id}, null, null ).replaceAll("\"","'").replaceAll("\r","").replaceAll("\n","")
        }
        ll = ll.concat(v)
      }

      // TODO: take from config!
      const g = new Map()
      g.set(MS.MS.BY_CITIZEN,{selectable:true, text:"By country of citizenship"})
      g.set(MS.MS.BY_BIRTH, {selectable:true, text:"By country of birth"})

      //const box = Logic.imposeConstraints( createDropdown(null, ll, true, g) )

      retVal.push({dimId: null, docFrag: createDropdown(null, ll, true, g)})  //TODO: Not null, some magic string...
    }
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
function createDropdown(k, v, isMultiselect=false, groups=new Map()) {
	const fragment = new DocumentFragment()
	const dropdownBox = document.createElement('ecl-like-select' + (isMultiselect?"-x":""))
  dropdownBox.setAttribute("dimension", k)
  if(isMultiselect) {
    dropdownBox.setAttribute("multiselect",null)
    //dropdownBox.selected = [v[0].code, v[1].code, v[2].code]
    Logic.imposeConstraints(dropdownBox)
  }
  dropdownBox.data = [getMapFromObject(v), groups]
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