export default function create(cfg) {
	//const d = new Map()
	//d.set("EU27_2020", 'European Union')
	//d.set("GR", 'Greek')
	//d.set("UG", 'Uganda')
	//console.log(document.querySelector("dropdown-box"))
	//document.querySelector("dropdown-box").data = [d, ["GR"]]
	//document.querySelector("dropdown-box").callback = () => console.log("HOWDY")
	return document.getElementById("selectCountry")
}


export function createDropdownBoxes(id, merged) {
	// cSelectors, sex, age, varying
	for(const d in merged.dimensions.ui.perIndicator.dropdown) {
		document.getElementById("selectCountryAnchorInsideCard"+id).after( createDropdown(merged) )
		console.log(merged.dimensions.ui.perIndicator.dropdown[d])
	}
}


function createDropdown(cfg) {
	const fragment = new DocumentFragment()
	const dropdownBox = document.createElement('dropdown-box')
	fragment.appendChild(dropdownBox)
	return fragment
}


function testLotsOfDropdowns() {
  for(let i=0;i<120;i++) {
    let el = document.createElement('dropdown-box')
    el.setAttribute("selectedText", "Blabla")

    const d = new Map()
    for(let j=0;j<30;j++) {
      d.set(j, 'European Union')
    }
    el.data = [d,[]]

    document.body.append(el)
  }
}

