import "../components/dropdownBox/dropdownBox.mjs"
import * as Cards from "./ui/cards.mjs"
import * as DropDowns from "./ui/dropDowns.mjs"
import MainMenu from "./ui/mainMenu.mjs"
import Fetcher from "./fetcher.mjs"


export function createUIElements(cfg) {
  console.log("cfg json from vanilla yaml", cfg)
  MainMenu(cfg)
  //createRange()  // time
  const countrySelect = DropDowns.fillCountries(cfg.globals.ui.dropdown.geo)
  const cardIds = Cards.create(cfg, onSelectForOneCard)  // ∀ indicators
}


// from ? to URLfrag
function convert(boxes) {
  let retVal = ""

  for(const box of boxes.boxes) {
    const k = box.dimension
    if(k==="null") {      // "by-SelectBox"
      for(const i in box.selected) {
        const [code, dim, dataSet] =  Object.keys(box.selected[i])[0].split("/")
        //retVal = dataSet + "?" + retVal
        // oh noes, totally different.. TODO
      }
    } else {              // every other box
      const v = Object.keys( Object.values(box.selected)[0] )[0]
      retVal += k+"="+v+"&"
    }
  }

  return retVal
}

// user changed some selection which is relevant for ALL cards
// which is just country box (note: greendeal dashboard behaviour: zoom out => reset all except country)
// so, update charts in all cards
function onSelectForAllCards() {

}

// user changed some selection which is relevant for ONE card
// which is all boxes except country and the slider
// so, update charts in one card
function onSelectForOneCard(ev) {
  Fetcher( convert( Cards.getCurrentSelections(ev.cardId) ) )
}
