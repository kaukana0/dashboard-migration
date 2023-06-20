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
import * as CommonConstraints from "./modules/selects/commonConstraints.mjs"


let countrySelect
let menuItems

export function createUIElements(cfg, triggerInitialRequest) {
  console.debug("cfg json from vanilla yaml", cfg)
  menuItems = MainMenu.getCategories(cfg)
  MainMenu.create(onSelectMenu, menuItems)
  countrySelect = GeoSelect.setup(MS.GEO_SELECT_DOM_ID, getMapFromObject(cfg.globals.ui.dropdown.geo), onSelectedForAllCards)
  Cards.create(MS.CARD_CONTAINER_DOM_ID, cfg, menuItems, onSelectedForOneCard, onCardExpand, onCardContract)    // ∀ indicators
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
  Cards.iterate(MS.CARD_CONTAINER_DOM_ID, (cardId) => { 
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
  document.getElementById(cardId).indicateLoading()
  // from the card's widgets
  const [boxes, dataset] = Cards.getCurrentSelections(cardId)
  // from "global" country select
  boxes.selections.set(MS.GEO_SELECT_ID, GeoSelect.getSelected())
  // non-ui url fragment
  Url.Affix.post = document.getElementById(cardId).getAttribute("urlfrag")
  Url.Affix.post += "time=2019"  // TODO: take from UI element
  const bla = {} ; bla[MS.BY_SELECT_ID] = Url.getBySelectFrag
  Fetcher( Url.buildFrag(boxes,dataset,bla), Cards.setData.bind(this, cardId) )
}

function updateCardAttributes(cardId) {
  document.getElementById(cardId).setAttribute("subtitle", "Number")
  document.getElementById(cardId).setAttribute("right1", Array.from(GeoSelect.getSelected().keys()).join(" ") )
  document.getElementById(cardId).setAttribute("right2", "2023")
}

// menuItemId can be anything, menuItem or submenuItem
function onSelectMenu(menuItemId) {
  const card = document.getElementById("cards").querySelector(`[id=${Cards.getIdFromName(menuItemId)}]`)
  if(card) {  // submenu item
    // filter for the category it belongs to
    Cards.filter(MainMenu.getSuperMenuItem(menuItemId, menuItems))
    Cards.expand(card)
  } else {  // menu item
    Cards.contractAll()
    Cards.filter(menuItemId)
  }
}

function onCardExpand(id) {
  const anchorEl = document.getElementById(MS.CARD_SLOT_ANCHOR_DOM_ID+id)
  CommonConstraints.setBySelect(anchorEl.nextSibling)

  GeoSelect.moveIntoCard(MS.CARD_SLOT_ANCHOR_DOM_ID+id)
  document.body.style.overflowY="hidden"
  window.scrollTo(0, 0);
}

function onCardContract(id) {
  GeoSelect.moveToMainArea()
  document.body.style.overflowY="scroll"

  // do this after moving geo-select out, because then it's not affected by
  // setDefaultSelections call.
  const anchorEl = document.getElementById(MS.CARD_SLOT_ANCHOR_DOM_ID+id)
  Cards.setDefaultSelections(anchorEl.parentNode)
  // geo-select's default selection is handeled differently (favStar).
  GeoSelect.selectFav()

  CommonConstraints.setBySelect(null)			// effectively disable those constraints

  onSelectedForAllCards()

  // todo: scroll back to previous pos
}