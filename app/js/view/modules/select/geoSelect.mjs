/*
 this is different from all other selects in that:
 - it's being moved in the DOM between the overview and an expanded card.
 - it's declared in the html and not created via JS.
*/
import * as CommonConstraints from "./constraints/commonConstraints.mjs"
import {MS} from "../../../common/magicStrings.mjs"
import * as PopUpMessage from "../popUpMessage.mjs"


let select

export function create(cfg, _groups, callback) {

  select = document.createElement('titled-select')
  select.setAttribute("id", MS.GEO_SELECT_DOM_ID)
  select.setAttribute("aria-label", "Country selectbox. Selections are automatically applied to the graph below.")

  const box = select.box
  box.setAttribute("dimension", "geo")
  box.setAttribute("favoriteStar", "true")
  box.setAttribute("multiselect", "true")
  box.setAttribute("textForMultiselect", "Countries selected")
  select.setAttribute("style", "min-width:360px; white-space:nowrap; text-overflow:ellipsis;") // flex:1 1 0;
  select.classList.add("unifiedSelectboxSize")
  box.classList.add("unifiedSelectboxSize")
  select.showLabels = false
  select.labelNumber = 1

  CommonConstraints.setGeoSelect(box)

  box.onSelect = selectionAllowed
  box.onSelected = callback
  const groups = new Map()
  _groups.forEach((item) => {
    groups.set(item, {})
  })
  box.data = [cfg, groups]

  // this is tricky :-/
  // the geoSelect is multiselect when it is inside the card,
  // and single select (w/ multi optics) in the overview (when moved outside of any card).
  // initially, it should be single in the overview, so take the attrib away here.
  // but before taking it away, it has had to be created and filled while being declared "multiselect" !
  box.setAttribute("multiselect", "false")

  return box
}

export function moveToMainArea() {
  document.getElementById(MS.MAIN_AREA_ANCHOR_DOM_ID).after(select)
  select.box.setAttribute("multiselect", "false")
  select.showLabels = false
}

export function moveIntoCard(cardAnchorId) {
  document.getElementById(cardAnchorId).insertAdjacentElement("afterbegin", select)
  select.box.setAttribute("multiselect", "true")
  select.labelLeft = "Country"
  select.labelRight = "selectable"
  select.showLabels = true
}

export function selectFav() {
  const box = select.box
  box.selected = [box.favoriteStar]
}

export function getSelected() {
  return select.box.selected
}

export function getFavoriteStar() {
  return select.box.favoriteStar
}

export function isEUSelected() {
  return select.box.selected.keys().next().value === MS.CODE_EU
}

function selectionAllowed(k,v) {
  switch(CommonConstraints.geoSelectionAllowed(k,v)) {
    case 0: return true
    case 1: PopUpMessage.show(PopUpMessage.TEXT.FOR_GEO10); return false
    case 2: PopUpMessage.show(PopUpMessage.TEXT.FOR_GEO2); return false
    default:
      return false
  }
}