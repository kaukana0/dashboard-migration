export function fillCountries(cfg) {
	document.getElementById("selectCountry").data = [getMapFromObject(cfg), []]
  return document.getElementById("selectCountry")
}

// sex, age and more on demand per config
export function createDropdownBoxes(cfg) {
  let retVal = []

  for(const i in cfg) {
    const k = Object.keys(cfg[i])[0]
    const v = cfg[i][k]
    retVal.push({dimId: k, frag: createDropdown(k,v)})
  }

  return retVal
}

function getMapFromObject(obj) {
  const retVal = new Map()
  for(const e of obj) {
    retVal.set(e.code, e.label)
  }
  return retVal
}

function createDropdown(k,v) {
	const fragment = new DocumentFragment()
	const dropdownBox = document.createElement('dropdown-box')
  dropdownBox.data = [getMapFromObject(v), []]
  dropdownBox.setAttribute("dimension", k)
	fragment.appendChild(dropdownBox)
	return fragment
}
