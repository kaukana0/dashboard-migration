export function fillCountries(cfg) {
	document.getElementById("selectCountry").data = [getMapFromObject(cfg), []]
  return document.getElementById("selectCountry")
}

export function createDropdownBoxes(id, merged) {
  let retVal = []

	// sex, age and more on demand per config
  const o = merged.dimensions.ui.perIndicator.dropdown
  console.log("part", o)

  for(const [k,v] of Object.entries(o)) {
    retVal.push(createDropdown(k,v))
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
	fragment.appendChild(dropdownBox)
	return fragment
}
