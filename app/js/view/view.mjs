/*
create UI, handle prominent events, initiate data fetching and data forwarding
*/

import * as Cards from "./modules/card/cards.mjs"
import * as GeoSelect from "./modules/select/geoSelect.mjs"
import * as Range from "./modules/card/elements/range.mjs"
import {MS} from "../common/magicStrings.mjs"
import * as MainMenu from "./modules/mainMenu.mjs"
import * as Url from "../model/url.mjs"
import Fetcher from "../model/fetcher.mjs"
import {getMapFromArray} from "./modules/util.mjs"
import * as CommonConstraints from "./modules/select/constraints/commonConstraints.mjs"
import {getCardsOfCategory} from "./modules/cardToMenuMapping.mjs"
import {getColorSetDefinitions} from "./modules/card/elements/colorSets.mjs"
import {getSeries, getSeriesKeys} from "../../components/chart/chart.mjs"
import {getBySelectSelectedCount, isInGroupC, getBySelectSelections} from "./modules/select/bySelect.mjs"
import * as BackButton from "./backButton.mjs"

// used to decide when to update one instead of all cards (reduce number of chart reloads)
let currentlyExpandedId = null


export function createUIElements(cfg, triggerLoading, cb) {
  console.debug("cfg json from vanilla yaml", cfg)
  //document.body.style.overflowX="hidden"
  MainMenu.create(cfg, onMenuSelected)
  GeoSelect.create(getMapFromArray(cfg.globals.ui.dropdown.geo), cfg.codeList.countryGroups, onGeoSelection)
  GeoSelect.moveToMainArea()
  Cards.create(MS.CARD_CONTAINER_DOM_ID, cfg, onSelectedForOneCard, onCardExpand, onCardContract)    // ∀ indicators
  Url.Affix.pre = cfg.globals.baseURL
  if(triggerLoading) { initialRequest(cb) }
  BackButton.hide()
  BackButton.callback(()=>{
    Cards.contractAll()
  })
}

function initialRequest(cb) {
  const overviewCards = getCardsOfCategory(MS.TXT_OVERVIEW)
  const allOtherCards = getAllIdsExcept(overviewCards)

  // first, fetch only the overview-cards
  onSelectedForAllCards(overviewCards, ()=> {
    MainMenu.select(MS.TXT_OVERVIEW)

    if(allOtherCards.length) {
      // then the rest, sort of parallel in the background
      onSelectedForAllCards(allOtherCards, ()=> {
        Cards.filter(overviewCards)
        setCardLegends(true)
        cb()  // continue on w/ whatever initialisation things happen next
      })
    } else  {
      cb()
    }

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
  const c = getColorSetDefinitions()
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
  Cards.iterate(MS.CARD_CONTAINER_DOM_ID, (cardId, _len) => { 
    const len = including ? including.length : _len
    if(!including || (including && including.includes(cardId))) {
      const boxes = onSelectedForOneCard(cardId, ()=>{
        // this is a bit tricky as it considers only the 1st card. please note comment on setTooltipStyle()
        count = count===-1 ? getBySelectSelectedCount(boxes) : count

        // when promise from http-fetch resolves, setData on card is called,
        // when it's the last card, invoke this fct's callback
        // it's a poor man's Promise.All()
        i+=1
        if(i===len && cb) {cb()}
      }, false)
    }
  })
  Cards.storeSelectedCounts(GeoSelect.getSelected().size, count)
  Cards.setTooltipStyle(count)
}

/*
user changed some selection that is relevant for ONE card
which is all boxes except country and the time-range slider.
so, update charts in one card.

setTooltip is there to consider only 1st tooltip if called from onSelectedForAllCards
*/
function onSelectedForOneCard(cardId, cb, setTooltip=true) {
  const boxes = fetch(cardId, ()=> {
    if(cb) {cb()}
  })

  const byCount = getBySelectSelectedCount(boxes)
  const geoCount = GeoSelect.getSelected().size
  Cards.setNOSelectable(cardId,
    CommonConstraints.getNOAllowedGeoSelects(byCount, geoCount),
    CommonConstraints.getNOAllowedBySelects(geoCount, cardId)
  )

  if(setTooltip) {
    Cards.storeSelectedCounts(geoCount, byCount)
    Cards.setTooltipStyle(byCount)
  }
  
  Cards.updateCardAttributes(cardId, boxes, geoSelectSelectedText())

  return boxes
}


// returns boxes of the card immediately, calls cb() asynchroneously after data is fetched and set on card.
function fetch(cardId, cb) {
  console.debug("fetch for card", cardId)
  // from the card's widgets
  const [boxes, dataset] = Cards.getCurrentSelections(cardId)
  // from "global" country select
  boxes.selections.set(MS.GEO_SELECT_ID, GeoSelect.getSelected())
  // non-ui url fragment
  Url.Affix.post = document.getElementById(cardId).getAttribute("urlfrag")

  const bySelections = getBySelectSelections(boxes)
  const fragGetter = {} ; fragGetter[MS.BY_SELECT_ID] = Url.getBySelectFrag
  const inC = isInGroupC(boxes, bySelections)
  Fetcher( Url.buildFrag(boxes,dataset,fragGetter), (data)=>{
    Cards.setData(cardId, GeoSelect.getSelected(), inC, data, cb)
    if(bySelections) {
      const seriesKeys = getSeriesKeys(getSeries(data.timeSeries.data))
      Cards.updateDetailLegend(cardId, GeoSelect.getSelected(), seriesKeys, inC, bySelections.size)
    } else {
      console.warn("No by selections for", cardId)
    }
  })
  return boxes
}


// menuItemId can be anything, menuItem or submenuItem
function onMenuSelected(menuItemId, parentItemId, isParentMenuItem) {
  const card = document.getElementById("cards").querySelector(`[id=${Cards.getIdFromName(menuItemId)}]`)
  if(isParentMenuItem) {
    Cards.contractAll()
    setTimeout(()=> { MainMenu.select(parentItemId) }, 250)  // TODO
    Cards.filter(getCardsOfCategory(parentItemId))
  } else {
    Cards.expand(card)
    Cards.filter(card.getAttribute("id"))
    MainMenu.close()
  }
}

function onCardExpand(id) {
  currentlyExpandedId = id

  document.getElementById("countrySelectContainer").style.display="none"

  CommonConstraints.setBySelect(Cards.getBySelectBox(id))

  GeoSelect.moveIntoCard(MS.CARD_SLOT_ANCHOR_DOM_ID+id)
  //document.body.style.overflowY="hidden"
  window.scrollTo(0, 1)

  // this is done here not because of resetting to original value,
  // but to let range WebComponent calculate and display the correct slider position
  // note: setting pos during display:none has no effect
  setTimeout( ()=> Range.reset(id), 50)

  MainMenu.select(MainMenu.getMenuItemIds(id)[1])

  Cards.filter(id)

  const y = document.getElementById("anchorExpandedCard").getBoundingClientRect().top + window.scrollY - 1
  document.getElementById(id).setAttribute("offsety", y+"px")

  setCardsActive(false, id)

  BackButton.show()
}

function onCardContract(id) {

  document.getElementById("countrySelectContainer").style.display=""
  
  GeoSelect.moveToMainArea()
  document.body.style.overflowY="auto"

  Range.reset(id)

  // do this after moving geo-select out, because then it's not affected by
  // setDefaultSelections call.
  const anchorEl = document.getElementById(MS.CARD_SLOT_ANCHOR_DOM_ID+id)
  if(anchorEl) {
    Cards.setDefaultSelections(anchorEl)
  } else {
    console.warn("view: no el w/ id", MS.CARD_SLOT_ANCHOR_DOM_ID+id)
  }

  // geo-select's default selection is handeled differently (favStar).
  GeoSelect.selectFav()

  CommonConstraints.setBySelect(null)			// effectively disable those constraints

  // a selection in one expanded card might affect all cards; i.e. favourite star
  // attention: leads to setData on all cards.
  onSelectedForAllCards() // getAllIdsExcept([id])

  setCardLegends(GeoSelect.isEUSelected())

  MainMenu.select( MainMenu.getMenuItemIds(id)[0] )

  Cards.filter( getCardsOfCategory(MainMenu.getMenuItemIds(id)[0]) )

  currentlyExpandedId = null

  setCardsActive(true)

  BackButton.hide()
}

// TODO: refactor; via CSS class!
function setCardsActive(isActive, id) {
  Cards.iterate(MS.CARD_CONTAINER_DOM_ID, (cardId) => {

    if(id && cardId===id) {
    } else {
      if(!isActive) {
        document.getElementById(cardId).setAttribute("inert", true)
        document.getElementById(cardId).setAttribute("data-html2canvas-ignore", true)
      } else {
        document.getElementById(cardId).removeAttribute("inert")
        document.getElementById(cardId).removeAttribute("data-html2canvas-ignore")
      }
    }

  })

  if(!isActive) {
    document.getElementById("footerBottom").setAttribute("inert", true)
  } else {
    document.getElementById("footerBottom").removeAttribute("inert")
  }

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
