/*
 this is different from all other selects in that:
 - it's being moved in the DOM between the overview and an expanded card.
 - it's declared in the html and not created via JS.
*/
import * as CommonConstraints from "./commonConstraints.mjs"

export function setup(id, cfg, callback) {
  const box = document.getElementById(id)

  CommonConstraints.setGeoSelect(box)

  box.onSelect = CommonConstraints.geoSelectionAllowed
  box.onSelected = callback
  box.data = [cfg, new Map()]
  box.selected = ["EU"]

  return box
}
