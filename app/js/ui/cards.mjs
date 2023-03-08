import * as DropDowns from "./dropDowns.mjs"
import * as Util from "../../components/util/util.mjs"


export default function create(cfg, selectCountry) {

	for(const i in cfg.indicators) {
		const merged = Util.mergeObjects(cfg.defaults, cfg.indicators[i])

		const container = document.getElementById("cards")
		const id = "chartCard-"+merged.name.replaceAll(" ", "-")

    container.innerHTML+=`<chart-card id="${id}"> 
		<div slot="slot1" style="height:50px; display:flex; justify-content: space-evenly; flex-grow:1;">
			<div id="selectCountryAnchorInsideCard${id}"></div>
		 </div>
		</chart-card>`

    requestAnimationFrame( () => { 
			bla(id, merged)
			DropDowns.createDropdownBoxes(id, merged)
		})

	}

}


let blabla=true
function bla(id, merged) {
	document.getElementById(id).addEventListener("click", (e)=>{
		if(blabla) {blabla=false} else {return}
		const card = document.getElementById(id)
		if(card.toggleExpansion(document.getElementById("selectCountryParentAnchor"))) {
			window.scrollTo(0,0)
			// move it from parent container into zoomed card
			document.getElementById("selectCountryAnchorInsideCard"+id).after(selectCountry)
		} else {
			// move it out of the zoomed card into parent container
			document.getElementById("selectCountryAnchorInMainView").after(selectCountry)
		}
	})

}