import "../components/dropdownBox/dropdownBox.mjs"
import * as Cards from "./ui/cards.mjs"
import * as DropDowns from "./ui/dropDowns.mjs"
import MainMenu from "./ui/mainMenu.mjs"
import Fetcher from "./fetcher.mjs"


export function createUIElements(cfg) {
  console.log("cfg all", cfg)
  MainMenu(cfg)
  //createRange()  // time
  const countrySelect = DropDowns.fillCountries(cfg.globals.ui.dropdown.geo)
  const cardIds = Cards.create(cfg, onSelectForCard)  // ∀ indicators
}


// from ? to URLfrag
function convert(boxes) {
  let retVal = ""
  for(const x of boxes.boxes) {
    const k = x.dimension
    const v = Object.keys( Object.values(x.selected)[0] )[0]
    retVal += k+"="+v+"&"
  }
  return retVal
}

// user changed some selection which is relevant for ALL cards
// country, range (?? im greendeal das verhalten kucken)
function onSelectForAll() {

}

// user changed some selection which is relevant for ONE card
function onSelectForCard(ev) {
  Fetcher( convert( Cards.getCurrentSelections(ev.cardId) ) )
}
