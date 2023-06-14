/*
create UI, handle prominent events, initiate data fetching and data forwarding
*/

import * as Cards from "./modules/cards/cards.mjs"
import * as GeoSelect from "./modules/selects/geoSelect.mjs"
import {MS} from "./modules/selects/magicStrings.mjs"
import * as MainMenu from "./modules/mainMenu.mjs"
import * as Url from "../url.mjs"
import Fetcher from "../model/fetcher.mjs"
import {getMapFromObject} from "./modules/selects/util.mjs"

const containerId = "cards"
let countrySelect

export function createUIElements(cfg, triggerInitialRequest) {
  console.debug("cfg json from vanilla yaml", cfg)
  const categories = MainMenu.getCategories(cfg)
  MainMenu.create(onSelectMenu, categories)
  countrySelect = GeoSelect.setup(MS.GEO_SELECT_DOM_ID, getMapFromObject(cfg.globals.ui.dropdown.geo), onSelectedForAllCards)
  Cards.create(containerId, cfg, categories, onSelectedForOneCard)  // ∀ indicators
  Url.Affix.pre = cfg.globals.baseURL
  if(triggerInitialRequest) {
    requestAnimationFrame(()=>onSelectedForAllCards())
  }
}

// user changed some selection which affects ALL cards,
// so update charts in all cards.
// this actually can only be the country box.
// (note: greendeal dashboard behaviour: zoom out => reset all selections except country)
function onSelectedForAllCards() {
  Cards.iterate(containerId, (cardId) => { 
    fetch(cardId)
    updateCardAttributes(cardId)
  })
}

// user changed some selection that is relevant for ONE card
// which is all boxes except country.
// so, update charts in one card
function onSelectedForOneCard(cardId) {
  fetch(cardId) 
  updateCardAttributes(cardId)
}

function fetch(cardId) {
  console.debug("fetch for card", cardId)
  // from the card's widgets
  const [boxes, dataset] = Cards.getCurrentSelections(cardId)
  // from "global" country select
  boxes.selections.set("geo", countrySelect.selected)
  // non-ui url fragment
  Url.Affix.post = document.getElementById(cardId).getAttribute("urlfrag")
  Url.Affix.post += "time=2019"  // TODO: take from UI element
  const bla = {} ; bla[MS.BY_SELECT_ID] = Url.getBySelectFrag
  Fetcher( Url.buildFrag(boxes,dataset,bla), Cards.setData.bind(this, cardId) )
}

function updateCardAttributes(cardId) {
  document.getElementById(cardId).setAttribute("subtitle", "Number")
  document.getElementById(cardId).setAttribute("right1", Array.from(countrySelect.selected.keys()).join(" ") )
  document.getElementById(cardId).setAttribute("right2", "2023")
}

function onSelectMenu(id) {
  const card = document.getElementById("cards").querySelector(`[id=${Cards.getIdFromName(id)}]`)
  if(card) {
    Cards.expand(card)
  } else {
    Cards.filter(id)
  }
}
