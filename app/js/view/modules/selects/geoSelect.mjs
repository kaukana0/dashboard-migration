/*
 this is different from all other selects in that:
 - it's being moved in the DOM between the overview and an expanded card.
 - it's declared in the html and not created via JS.
*/
import * as CommonConstraints from "./commonConstraints.mjs"

let id = ""

export function setup(_id, cfg, callback) {
  id = _id

  const el = document.getElementById(_id)

  CommonConstraints.setGeoSelect(el)

  el.onSelect = CommonConstraints.geoSelectionAllowed
  el.onSelected = callback
  el.data = [cfg, new Map()]    // TODO: groups
  //el.selected = ["EU"]

  return el
}

export function moveToFrontpage() {

}

export function moveIntoCard() {
  
}

export function selectFav() {
  const el = document.getElementById(id)
  el.selected = [el.favoriteStar]
}

export function getSelected() {
  return document.getElementById(id).selected
}