/*
 this is different from all other selects in that:
 - it's being moved in the DOM between the overview and an expanded card.
 - it's declared in the html and not created via JS.
*/
import * as CommonConstraints from "./commonConstraints.mjs"
import {MS} from "../../../common/magicStrings.mjs"


let id = ""

export function setup(_id, cfg, _groups, callback) {
  id = _id

  const el = document.getElementById(_id)

  CommonConstraints.setGeoSelect(el)

  el.onSelect = CommonConstraints.geoSelectionAllowed
  el.onSelected = callback
  const groups = new Map()
  _groups.forEach((item) => {
    groups.set(item, {})
  })
  el.data = [cfg, groups]

  // this is tricky :-/
  // it's multiselect in the card, single select (w/ multi optics) in the overview.
  // initially, it should be single in the overview, so take the attrib away here.
  // but before taking it away, it has had to be created and filled while being declared "multiselect" !
  el.removeAttribute("multiselect")

  return el
}

export function moveToMainArea() {
  document.getElementById(MS.MAIN_AREA_ANCHOR_DOM_ID).after(document.getElementById(MS.GEO_SELECT_CONTAINER_DOM_ID))
  document.getElementById(MS.GEO_SELECT_DOM_ID).setAttribute("multiselect", "false")
}

export function moveIntoCard(id) {
  document.getElementById(id).after(document.getElementById(MS.GEO_SELECT_CONTAINER_DOM_ID))
  document.getElementById(MS.GEO_SELECT_DOM_ID).setAttribute("multiselect", "true")
}

export function selectFav() {
  const el = document.getElementById(id)
  el.selected = [el.favoriteStar]
}

export function getSelected() {
  return document.getElementById(id).selected
}

export function getFavoriteStar() {
  return document.getElementById(id).favoriteStar
}

export function isEUSelected() {
  return document.getElementById(id).selected.keys().next().value === MS.CODE_EU
}