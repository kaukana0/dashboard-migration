import "../components/dropdownBox/dropdownBox.mjs"


export function createUIElements(cfg) {
  createMainMenu(cfg)
  //createRange()  // time
  const c = createDopdown() // geo
  createCards(cfg,c )  // ∀ indicators
  //  createDopdown() // cSelectors
  //  createDopdown() // sex
  //  createDopdown() // age
  //  createDopdown() // varying
}


function createMainMenu(cfg) {

	// returns map, key=category name, value=[indicator names]
	function getCategories(cfg) {
		const retVal = new Map()
		for(const i in cfg.indicators) {
			const merged = {...cfg.defaults, ...cfg.indicators[i]}
			if(!retVal.has(merged.category)) {
				retVal.set(merged.category, [])
			}
			retVal.get(merged.category).push(merged.name)
			if(merged.isInOverview) {
				//fetchData(merged.name)
			}
		
		}
		return retVal
	}

	console.log("main menu", getCategories(cfg))

}

function createCards(cfg, selectCountry) {

	for(const i in cfg.indicators) {
		const merged = {...cfg.defaults, ...cfg.indicators[i]}
		console.log("createCards", merged)
		const container = document.getElementById("cards")
		const id = "chartCard-"+merged.name.replaceAll(" ", "-")
		container.innerHTML+=`<chart-card id="${id}"> 
		<div slot="slot1" style="height:50px; display:flex; justify-content: space-evenly; flex-grow:1;">
			<div id="selectCountryAnchorInsideCard${id}"></div>
			<dropdown-box></dropdown-box>  
			<dropdown-box></dropdown-box>  
			<dropdown-box></dropdown-box>  
		 </div>
		</chart-card>`
		requestAnimationFrame( () => {
			document.getElementById(id).addEventListener("click", (e)=>{
				const card = document.getElementById(id)
				if(card.toggleZoom(document.getElementById("selectCountryParentAnchor"))) {
					window.scrollTo(0,0)
					// move it from parent container into zoomed card
					document.getElementById("selectCountryAnchorInsideCard"+id).after(selectCountry)
				} else {
					// move it out of the zoomed card into parent container
					document.getElementById("selectCountryAnchorInMainView").after(selectCountry)
				}
			})
		})

	}
}


function createDopdown(cfg) {
	//const d = new Map()
	//d.set("EU27_2020", 'European Union')
	//d.set("GR", 'Greek')
	//d.set("UG", 'Uganda')
	//console.log(document.querySelector("dropdown-box"))
	//document.querySelector("dropdown-box").data = [d, ["GR"]]
	//document.querySelector("dropdown-box").callback = () => console.log("HOWDY")
	return document.getElementById("selectCountry")
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
