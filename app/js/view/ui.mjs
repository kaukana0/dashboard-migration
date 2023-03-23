import "../../../components/dropdownBox/dropdownBox.mjs"
import * as Cards from "./modules/cards/cards.mjs"
import * as DropDowns from "./modules/dropDowns.mjs"
import MainMenu from "./modules/mainMenu.mjs"
import * as Url from "../url.mjs"
import Fetcher from "../model/fetcher.mjs"


const containerId = "cards"
let countrySelect

export function createUIElements(cfg) {
  //console.log("cfg json from vanilla yaml", cfg)
  MainMenu(cfg)
  countrySelect = DropDowns.fillCountries("selectCountry", cfg.globals.ui.dropdown.geo)
  countrySelect.callback = onSelectForAllCards
  Cards.create(containerId, cfg, onSelectForOneCard)  // ∀ indicators
  Url.Frag.prepend(cfg.globals.baseURL)
  Url.Frag.append(Url.Frag.getUrlFrag(cfg.globals.dimensions.nonUi))
}

// user changed some selection which affects ALL cards.
// which is actually just the country box 
// so, update charts in all cards
// (note: greendeal dashboard behaviour: zoom out => reset all selections except country)
function onSelectForAllCards() {
  Cards.iterate(containerId, (cardId) => { 
    fetch(cardId)
    updateAttributes(cardId)
  })
}

// user changed some selection that is relevant for ONE card
// which is all boxes except country.
// so, update charts in one card
function onSelectForOneCard(cardId) {
  fetch(cardId) 
  updateAttributes(cardId)
}

function fetch(cardId) {
  Fetcher( [ Url.buildFrag(Cards.getCurrentSelections(cardId)) ], Cards.setData.bind(this, cardId) )
}

function updateAttributes(cardId) {
  document.getElementById(cardId).setAttribute("subtitle", "Number")
  document.getElementById(cardId).setAttribute("right1", Array.from(countrySelect.selected.keys()).join(" ") )
  document.getElementById(cardId).setAttribute("right2", "2023")
}