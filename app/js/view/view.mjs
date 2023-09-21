/*
create UI, handle prominent events, initiate data fetching and data forwarding
*/

import * as Cards from "./modules/cards/cards.mjs"
import * as GeoSelect from "./modules/selects/geoSelect.mjs"
import * as Range from "./modules/cards/range.mjs"
import {MS} from "../common/magicStrings.mjs"
import * as MainMenu from "./modules/mainMenu.mjs"
import * as Url from "../model/url.mjs"
import Fetcher from "../model/fetcher.mjs"
import {getMapFromArray} from "./modules/util.mjs"
import * as CommonConstraints from "./modules/selects/commonConstraints.mjs"
import * as GROUPS from "../model/common/groupDefinition.mjs"

// used to decide when to update one instead of all cards (reduce number of chart reloads)
let currentlyExpandedId = null


export function createUIElements(cfg, triggerInitialRequest) {
  console.debug("cfg json from vanilla yaml", cfg)
  document.body.style.overflowX="hidden"
  MainMenu.create(cfg, onSelectMenu)
  GeoSelect.setup(MS.GEO_SELECT_DOM_ID, getMapFromArray(cfg.globals.ui.dropdown.geo), cfg.codeList.countryGroups, onGeoSelection)
  Cards.create(MS.CARD_CONTAINER_DOM_ID, cfg, MainMenu.getCategories(), onSelectedForOneCard, onCardExpand, onCardContract)    // ∀ indicators
  Url.Affix.pre = cfg.globals.baseURL
  if(triggerInitialRequest) {   // TODO: not everything at once. start w/ what is in user's view, do the other stuff in the background quietly/slowly one by one (intersection observer)
    onSelectedForAllCards()
    MainMenu.select(MS.TXT_OVERVIEW)
    Cards.filter(MS.TXT_OVERVIEW)
    setCardLegends(true)
  }
}

function onGeoSelection() {
  if(currentlyExpandedId) {
    onSelectedForOneCard(currentlyExpandedId)
  } else {
    onSelectedForAllCards()
  }
  setCardLegends(GeoSelect.isEUSelected())
}

function setCardLegends(isEU) {
  const c = Cards.getColorSetDefinitions()
  const eu = [c.EU.light, c.EU.mid, c.EU.dark]
  const other = [c.SET1.light, c.SET1.mid, c.SET1.dark]

  Cards.iterate(MS.CARD_CONTAINER_DOM_ID, (cardId) => {
    document.getElementById(cardId).setLegendDotColors(isEU?eu:other)
  })
}

function geoSelectSelectedText() {
  return Array.from(GeoSelect.getSelected().keys()).join(" ")
}

// user changed some selection which affects ALL cards,
// so update charts in all cards.
// this actually can only be the country box.
// (note: greendeal dashboard behaviour: zoom out => reset all selections except country)
function onSelectedForAllCards() {
  let count = -1
  Cards.iterate(MS.CARD_CONTAINER_DOM_ID, (cardId) => { 
    const boxes = fetch(cardId)
    Cards.updateCardAttributes(cardId, boxes, geoSelectSelectedText())
    // this is a bit tricky as it considers only the 1st card. please note comment on setTooltipStyle()
    count = count===-1 ? getBySelectSelectedCount(boxes) : count
  })
  Cards.storeSelectedCounts(GeoSelect.getSelected().size, count)
  Cards.setTooltipStyle(count)
}

// user changed some selection that is relevant for ONE card
// which is all boxes except country.
// so, update charts in one card
function onSelectedForOneCard(cardId) {
  const boxes = fetch(cardId)
  Cards.updateCardAttributes(cardId, boxes, geoSelectSelectedText())

  const count = getBySelectSelectedCount(boxes)
  Cards.storeSelectedCounts(GeoSelect.getSelected().size, count)
  Cards.setTooltipStyle(count)
}

function getBySelectSelectedCount(boxes) {
  let count = 0
  const b = [MS.BY_SELECT_ID, MS.INDIC_MG_ID, MS.INDIC_LEG_FRAM]
  b.forEach(element=>{
    if(boxes.selections.get(element)) {
      count = boxes.selections.get(element).size
    }
  })
  return count  
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

  let isInGroupC = ""    // TODO: refactor, get this out of here
  if(boxes.selections.has(MS.BY_SELECT_ID)) {
    const firstSel = Array.from(boxes.selections.get(MS.BY_SELECT_ID).keys())[0]
    isInGroupC = GROUPS.isInGroupC(firstSel)
  }

  const bla = {} ; bla[MS.BY_SELECT_ID] = Url.getBySelectFrag
  Fetcher( Url.buildFrag(boxes,dataset,bla), Cards.setData.bind(this, cardId, GeoSelect.getSelected(), isInGroupC) )
  return boxes
}

// menuItemId can be anything, menuItem or submenuItem
function onSelectMenu(menuItemId, parentItemId, isParentMenuItem) {
  const card = document.getElementById("cards").querySelector(`[id=${Cards.getIdFromName(menuItemId)}]`)
  if(isParentMenuItem) {
    Cards.contractAll()
    setTimeout(()=> { MainMenu.select(parentItemId) }, 250)  // TODO
    Cards.filter(parentItemId)
  } else {
    Cards.filter(parentItemId)
    Cards.expand(card)
  }
}

function onCardExpand(id) {
  currentlyExpandedId = id
  const anchorEl = document.getElementById(MS.CARD_SLOT_ANCHOR_DOM_ID+id)
  CommonConstraints.setBySelect(anchorEl.nextSibling.childNodes[1])

  GeoSelect.moveIntoCard(MS.CARD_SLOT_ANCHOR_DOM_ID+id)
  document.body.style.overflowY="hidden"
  window.scrollTo(0, 0)

  // this is done here not because of resetting to original value,
  // but to let range WebComponent calculate and display the correct slider position
  // note: setting pos during display:none has no effect
  Range.reset(id)

  MainMenu.select(MainMenu.getMenuItemIds(id)[1])

  Cards.filter( MainMenu.getMenuItemIds(id)[0] )

  document.getElementById("countrySelectLabel").textContent = "Country"
}

function onCardContract(id) {

  GeoSelect.moveToMainArea()
  document.body.style.overflowY="auto"

  Range.reset(id)

  // do this after moving geo-select out, because then it's not affected by
  // setDefaultSelections call.
  const anchorEl = document.getElementById(MS.CARD_SLOT_ANCHOR_DOM_ID+id)
  Cards.setDefaultSelections(anchorEl.parentNode)
  // geo-select's default selection is handeled differently (favStar).
  GeoSelect.selectFav()

  CommonConstraints.setBySelect(null)			// effectively disable those constraints

  // a selection in one expanded card might affect all cards; i.e. favourite star
  // attention: leads to setData on all cards
  onSelectedForAllCards()

  setCardLegends(GeoSelect.isEUSelected())

  MainMenu.select( MainMenu.getMenuItemIds(id)[0] )

  currentlyExpandedId = null

  document.getElementById("countrySelectLabel").textContent = ""
}

export function setupGlobalInfoClick(txt) {
  document.getElementById("globalInfoButton").addEventListener("click", () => {
    document.getElementById("globalModal").setHeader("Information")
    document.getElementById("globalModal").setText(txt)
    document.getElementById("globalModal").show()
  })
}

export function setupSharing(cfg) {
  const btn = document.getElementById("sharingButton")
  btn.addEventListener("click", () => { menu.toggleVisibility() })

  const menu = document.getElementsByTagName("ecl-like-social-share")[0]
  menu.setAttribute("text", cfg.text)
  menu.setAttribute("hashTags", cfg.hashTags)
  menu.setAttribute("mailSubject", cfg.mailSubject)
  menu.setAttribute("mailBody", cfg.mailBody)
}