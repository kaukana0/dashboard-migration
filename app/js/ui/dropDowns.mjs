const delim = "/"

export function fillCountries(cfg) {
	document.getElementById("selectCountry").data = [getMapFromObject(cfg), []]
  return document.getElementById("selectCountry")
}

// usually sex & age. more on demand per config.
/*
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
"CODE/DIMENSION/DATASETNAME"

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
          v[l].code = v[l].code + delim + key + delim + datasets[k].id
        }
        ll = ll.concat(v)
      }
      retVal.push({dimId: null, docFrag: createDropdown(null, ll, "multiselect")})
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
}*/
function createDropdown(k, v, attribute) {
	const fragment = new DocumentFragment()
	const dropdownBox = document.createElement('dropdown-box')
  dropdownBox.data = [getMapFromObject(v), []]
  dropdownBox.setAttribute("dimension", k)
  if(attribute) dropdownBox.setAttribute(attribute, null)
	fragment.appendChild(dropdownBox)
	return fragment
}


function getMapFromObject(obj) {
  const retVal = new Map()
  for(const e of obj) {
    retVal.set(e.code, e.label)
  }
  return retVal
}
