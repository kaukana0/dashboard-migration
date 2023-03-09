import * as DropDowns from "./dropDowns.mjs"
import * as Util from "../../components/util/util.mjs"


export default function create(cfg, selectCountry) {
	let retVal = []

	for(const i in cfg.indicators) {
		const merged = Util.mergeObjects(cfg.defaults, cfg.indicators[i])

		const container = document.getElementById("cards")
		const id = "chartCard-"+merged.name.replaceAll(" ", "-")

    container.innerHTML+=`<chart-card id="${id}" anchor="selectCountryParentAnchor"> 
		<div slot="slot1" style="height:50px; display:flex; justify-content: space-evenly; flex-grow:1;">
			<div id="selectCountryAnchorInsideCard${id}"></div>
		 </div>
		</chart-card>`

    requestAnimationFrame( () => {
			const boxes = DropDowns.createDropdownBoxes(id, merged)
			for(const box of boxes) {
				box.firstChild.callback = (e) => {
					const event = new Event("dropdownSelect")
					event.box = box.firstChild
					document.getElementById(id).dispatchEvent(event)
				}
				document.getElementById("selectCountryAnchorInsideCard"+id).after(box)
				document.getElementById(id).addEventListener("expand", () => {
					// move it from parent container into zoomed card
					document.getElementById("selectCountryAnchorInsideCard"+id).after(selectCountry)
				})
				document.getElementById(id).addEventListener("contract", () => {
					// move it out of the card into parent container
					document.getElementById("selectCountryAnchorInMainView").after(selectCountry)
				})
			}
		})

		retVal.push(id)
	}

	return retVal
}
