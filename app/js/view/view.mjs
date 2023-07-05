/*
create UI, handle prominent events, initiate data fetching and data forwarding
*/

import * as Cards from "./modules/cards/cards.mjs"
import * as GeoSelect from "./modules/selects/geoSelect.mjs"
import {MS} from "../common/magicStrings.mjs"
import * as MainMenu from "./modules/mainMenu.mjs"
import * as Url from "../model/url.mjs"
import Fetcher from "../model/fetcher.mjs"
import {getMapFromObject} from "./modules/selects/util.mjs"
import * as CommonConstraints from "./modules/selects/commonConstraints.mjs"

// both used to decide when to update one instead of all cards
let currentlyExpandedId = null
let currentFavoriteStar = ""

export function createUIElements(cfg, triggerInitialRequest) {
  console.debug("cfg json from vanilla yaml", cfg)
  const menuItems = MainMenu.getCategories(cfg)
  MainMenu.create(onSelectMenu, menuItems)
  GeoSelect.setup(MS.GEO_SELECT_DOM_ID, getMapFromObject(cfg.globals.ui.dropdown.geo), cfg.codeList.countryGroups, onGeoSelection)
  currentFavoriteStar = GeoSelect.getFavoriteStar()
  Cards.create(MS.CARD_CONTAINER_DOM_ID, cfg, menuItems, onSelectedForOneCard, onCardExpand, onCardContract)    // ∀ indicators
  Url.Affix.pre = cfg.globals.baseURL
  if(triggerInitialRequest) {
    requestAnimationFrame(()=>onSelectedForAllCards())
  }
}

function onGeoSelection() {
  if(currentlyExpandedId) {
    onSelectedForOneCard(currentlyExpandedId)
  } else {
    onSelectedForAllCards()
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
  const bySel = fetch(cardId) 
  updateCardAttributes(cardId)
  Cards.setTooltipStyle(GeoSelect.getSelected().size, bySel.size)
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
  return boxes.selections.get(MS.BY_SELECT_ID)
}

function updateCardAttributes(cardId) {
  document.getElementById(cardId).setAttribute("right1", Array.from(GeoSelect.getSelected().keys()).join(" ") )
  document.getElementById(cardId).setAttribute("right2", "2023")
}

// menuItemId can be anything, menuItem or submenuItem
function onSelectMenu(menuItemId, parentItemId) {
  const card = document.getElementById("cards").querySelector(`[id=${Cards.getIdFromName(menuItemId)}]`)
  if(card) {  // submenu item
    // filter for the category it belongs to
    Cards.filter(parentItemId)
    Cards.expand(card)
  } else {  // menu item
    Cards.contractAll()
    Cards.filter(menuItemId)
  }
}

function onCardExpand(id) {
  currentlyExpandedId = id
  const anchorEl = document.getElementById(MS.CARD_SLOT_ANCHOR_DOM_ID+id)
  CommonConstraints.setBySelect(anchorEl.nextSibling.childNodes[1])

  GeoSelect.moveIntoCard(MS.CARD_SLOT_ANCHOR_DOM_ID+id)
  document.body.style.overflowY="hidden"
  document.body.style.overflowX="hidden"
  window.scrollTo(0, 0);

  document.getElementById("timeRange"+id).style.display="inline"

  currentFavoriteStar = GeoSelect.getFavoriteStar()
}

function onCardContract(id) {

  GeoSelect.moveToMainArea()
  document.body.style.overflowY="auto"
  document.body.style.overflowX="auto"

  // do this after moving geo-select out, because then it's not affected by
  // setDefaultSelections call.
  const anchorEl = document.getElementById(MS.CARD_SLOT_ANCHOR_DOM_ID+id)
  Cards.setDefaultSelections(anchorEl.parentNode)
  // geo-select's default selection is handeled differently (favStar).
  GeoSelect.selectFav()

  CommonConstraints.setBySelect(null)			// effectively disable those constraints

  if(GeoSelect.getFavoriteStar() === currentFavoriteStar) {
    onSelectedForOneCard(id)
  } else {
    onSelectedForAllCards()
  }

  document.getElementById("timeRange"+id).style.display="none"

  // todo: scroll back to previous pos

  currentlyExpandedId = null
}