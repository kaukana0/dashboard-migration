import "../../../components/dropdownBox/dropdownBox.mjs"
import * as Cards from "./modules/cards/cards.mjs"
import * as DropDowns from "./modules/dropDowns.mjs"
import MainMenu from "./modules/mainMenu.mjs"
import * as Url from "../request/url.mjs"
import Fetcher from "../request/fetcher.mjs"


const containerId = "cards"
let countrySelect

export function createUIElements(cfg) {
  //console.log("cfg json from vanilla yaml", cfg)
  MainMenu(cfg)
  //createRange()  // time
  countrySelect = DropDowns.fillCountries("selectCountry", cfg.globals.ui.dropdown.geo)
  countrySelect.callback = onSelectForAllCards
  Cards.create(containerId, cfg, onSelectForOneCard)  // ∀ indicators
  Url.Frag.prepend(cfg.globals.baseURL)
  Url.Frag.append(Url.Frag.getUrlFrag(cfg.globals.dimensions.nonUi))
}

// user changed some selection which affects ALL cards.
// which is actually just the country box 
// so, update charts in all cards
// (note: greendeal dashboard behaviour: zoom out => reset all except country)
function onSelectForAllCards() {
  Cards.iterate(containerId, (cardId) => { onSelectForOneCard(cardId) })
}

// user changed some selection that is relevant for ONE card
// which is all boxes except country.
// so, update charts in one card
function onSelectForOneCard(cardId) {
  Fetcher( [ Url.buildFrag(Cards.getCurrentSelections(cardId)) ], Cards.setData.bind(this, cardId) )
}
