import "../components/dropdownBox/dropdownBox.mjs"
import * as Cards from "./ui/cards.mjs"
import * as DropDowns from "./ui/dropDowns.mjs"
import MainMenu from "./ui/mainMenu.mjs"
import * as Url from "./ui/url.mjs"
import Fetcher from "./fetcher.mjs"


const containerId = "cards"


export function createUIElements(cfg) {
  console.log("cfg json from vanilla yaml", cfg)
  MainMenu(cfg)
  //createRange()  // time
  const countrySelect = DropDowns.fillCountries("selectCountry", cfg.globals.ui.dropdown.geo)
  countrySelect.callback = onSelectForAllCards
  Cards.create(containerId, cfg, onSelectForOneCard)  // ∀ indicators
  Url.UrlFrag.store(cfg.globals.dimensions.nonUi)
}

// user changed some selection which affects ALL cards.
// which is actually just the country box 
// so, update charts in all cards
// (note: greendeal dashboard behaviour: zoom out => reset all except country)
function onSelectForAllCards() {
  Cards.iterate(containerId, (cardId) => { bla(cardId) })
}

// user changed some selection that is relevant for ONE card
// which is all boxes except country and the slider.
// so, update charts in one card
function onSelectForOneCard(ev) {
  bla(ev.cardId)
}

function bla(cardId) {
  const boxes = Cards.getCurrentSelections(cardId)
  //boxes.boxes.push(DropDowns.getCurrentSelectionsCountryBox())
  console.log(  Url.buildFrag(boxes)  )
  //Fetcher.go()
  //Fetcher( convert( Cards.getCurrentSelections(ev.cardId) ) )
}