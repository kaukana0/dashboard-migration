import "../../../components/dropdownBox/dropdownBox.mjs"
import * as Cards from "./modules/cards/cards.mjs"
import * as DropDowns from "./modules/dropDowns.mjs"
import MainMenu from "./modules/mainMenu.mjs"
import * as Url from "../url.mjs"
import Fetcher from "../model/fetcher.mjs"


const containerId = "cards"
let countrySelect

export function createUIElements(cfg, triggerInitialRequest) {
  console.debug("cfg json from vanilla yaml", cfg)
  MainMenu(cfg)
  countrySelect = DropDowns.fillCountries("selectCountry", cfg.globals.ui.dropdown.geo)
  countrySelect.callback = onSelectForAllCards
  Cards.create(containerId, cfg, onSelectForOneCard)  // ∀ indicators
  Url.Affix.pre_(cfg.globals.baseURL)
  if(triggerInitialRequest) {
    requestAnimationFrame(()=>onSelectForAllCards())
  }
}

// user changed some selection which affects ALL cards,
// so update charts in all cards.
// this actually can only be the country box.
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
  console.debug("fetch for card", cardId)
  // from the card's widgets
  const selections = Cards.getCurrentSelections(cardId)
  // from "global" country select
  selections.boxes.set("geo", countrySelect.selected)
  // non-ui url fragment
  Url.Affix.post_( document.getElementById(cardId).getAttribute("urlfrag") )
  Fetcher( Url.buildFrag(selections), Cards.setData1.bind(this, cardId) )
}

function updateAttributes(cardId) {
  document.getElementById(cardId).setAttribute("subtitle", "Number")
  document.getElementById(cardId).setAttribute("right1", Array.from(countrySelect.selected.keys()).join(" ") )
  document.getElementById(cardId).setAttribute("right2", "2023")
}