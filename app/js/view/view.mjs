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
import {getCardsOfCategory} from "./modules/cardToMenuMapping.mjs"

// used to decide when to update one instead of all cards (reduce number of chart reloads)
let currentlyExpandedId = null


export function createUIElements(cfg, triggerLoading, cb) {
  console.debug("cfg json from vanilla yaml", cfg)
  document.body.style.overflowX="hidden"
  MainMenu.create(cfg, onSelectMenu)
  GeoSelect.create(getMapFromArray(cfg.globals.ui.dropdown.geo), cfg.codeList.countryGroups, onGeoSelection)
  GeoSelect.moveToMainArea()
  Cards.create(MS.CARD_CONTAINER_DOM_ID, cfg, onSelectedForOneCard, onCardExpand, onCardContract)    // ∀ indicators
  Url.Affix.pre = cfg.globals.baseURL
  if(triggerLoading) { initialRequest(cb) }
}

function initialRequest(cb) {
  const overviewCards = getCardsOfCategory(MS.TXT_OVERVIEW)
  const allOtherCards = getAllIdsExcept(overviewCards)

  // first, fetch only the overview-cards
  onSelectedForAllCards(overviewCards, ()=> {
    MainMenu.select(MS.TXT_OVERVIEW)
    cb()  // continue on w/ whatever initialisation things happen next

    // then the rest
    onSelectedForAllCards(allOtherCards, ()=> {
      Cards.filter(overviewCards)
      setCardLegends(true)
    })

  })

}

function getAllIdsExcept(except) {
  const retVal = []
  Cards.iterate(MS.CARD_CONTAINER_DOM_ID, (cardId, len) => { 
    if(!except.includes(cardId)) {retVal.push(cardId)}
  })
  return retVal
}

function onGeoSelection() {
  if(currentlyExpandedId) {
    onSelectedForOneCard(currentlyExpandedId)
  } else {
    onSelectedForAllCards(null)
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
function onSelectedForAllCards(including, cb) {
  let count = -1
  let i=0
  Cards.iterate(MS.CARD_CONTAINER_DOM_ID, (cardId, len) => { 
    if(!including || (including && including.includes(cardId))) {
      const boxes = fetch(cardId, ()=>{
        onSelectedForOneCard(cardId, null)

        // this is a bit tricky as it considers only the 1st card. please note comment on setTooltipStyle()
        count = count===-1 ? getBySelectSelectedCount(boxes) : count
      })
    }
    i+=1
    if(i===len && cb) {cb()}
  })
  Cards.storeSelectedCounts(GeoSelect.getSelected().size, count)
  Cards.setTooltipStyle(count)
}

// user changed some selection that is relevant for ONE card
// which is all boxes except country and the time-range slider.
// so, update charts in one card
function onSelectedForOneCard(cardId, cb) {
  const boxes = fetch(cardId, ()=> {
    Cards.updateCardAttributes(cardId, boxes, geoSelectSelectedText())

    const byCount = getBySelectSelectedCount(boxes)
    const geoCount = GeoSelect.getSelected().size
    Cards.setNOSelectable(cardId,
      CommonConstraints.getNOAllowedGeoSelects(byCount, geoCount),
      CommonConstraints.getNOAllowedBySelects(geoCount, cardId)
    )

    Cards.storeSelectedCounts(geoCount, byCount)
    Cards.setTooltipStyle(byCount)

    if(cb) {cb()}
  })
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

function fetch(cardId, cb) {
  console.debug("fetch for card", cardId)
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

  const fragGetter = {} ; fragGetter[MS.BY_SELECT_ID] = Url.getBySelectFrag
  Fetcher( Url.buildFrag(boxes,dataset,fragGetter), (data)=>{
    Cards.setData(cardId, GeoSelect.getSelected(), isInGroupC, data, cb)
  } )
  return boxes
}

// menuItemId can be anything, menuItem or submenuItem
function onSelectMenu(menuItemId, parentItemId, isParentMenuItem) {
  const card = document.getElementById("cards").querySelector(`[id=${Cards.getIdFromName(menuItemId)}]`)
  if(isParentMenuItem) {
    Cards.contractAll()
    setTimeout(()=> { MainMenu.select(parentItemId) }, 250)  // TODO
  } else {
    Cards.expand(card)
  }
  Cards.filter(getCardsOfCategory(parentItemId))
}

function onCardExpand(id) {
  currentlyExpandedId = id

  CommonConstraints.setBySelect(Cards.getBySelectBox(id))

  GeoSelect.moveIntoCard(MS.CARD_SLOT_ANCHOR_DOM_ID+id)
  document.body.style.overflowY="hidden"
  window.scrollTo(0, 0)

  // this is done here not because of resetting to original value,
  // but to let range WebComponent calculate and display the correct slider position
  // note: setting pos during display:none has no effect
  Range.reset(id)

  MainMenu.select(MainMenu.getMenuItemIds(id)[1])

  Cards.filter( getCardsOfCategory(MainMenu.getMenuItemIds(id)[0]) )

  document.getElementById(MS.GEO_SELECT_DOM_ID).labelLeft = "Country"
  document.getElementById(MS.GEO_SELECT_DOM_ID).labelRight = "selectable"
  document.getElementById(MS.GEO_SELECT_DOM_ID).showLabels = true
}

function onCardContract(id) {

  GeoSelect.moveToMainArea()
  document.body.style.overflowY="auto"

  Range.reset(id)

  // do this after moving geo-select out, because then it's not affected by
  // setDefaultSelections call.
  const anchorEl = document.getElementById(MS.CARD_SLOT_ANCHOR_DOM_ID+id)
  Cards.setDefaultSelections(anchorEl)
  // geo-select's default selection is handeled differently (favStar).
  GeoSelect.selectFav()

  CommonConstraints.setBySelect(null)			// effectively disable those constraints

  // a selection in one expanded card might affect all cards; i.e. favourite star
  // attention: leads to setData on all cards.
  onSelectedForAllCards() // getAllIdsExcept([id])

  setCardLegends(GeoSelect.isEUSelected())

  MainMenu.select( MainMenu.getMenuItemIds(id)[0] )

  currentlyExpandedId = null

  document.getElementById(MS.GEO_SELECT_DOM_ID).showLabels = false
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
