/*
in line display:
  by-select logic: when click any birth, citizenships get deselected and vice versa
  constraint logic (spanning 2 selectBoxes):
    when =1 by-selector, all countries are selectable
    when >1 by-selector, make sure #by-selections * #country-selections < 7
    always let users know how many are STILL (not how many are MAX) "selectable" in both select boxes
      let them know by a little annotation above the box' right corner

when switching to vertically connected dot plot (VCDP) display:
  country-select: 
    it gets disabled
    all get automatically selected
    "selectable" info is hidden
  by-select: 
    "selectable" info is hidden
    by-select logic same as in line
    constraint logic like in line is disabled

when switching back to line:
  - ...
*/

let bySelect
let geoSelect


export function setBySelect(el) {bySelect=el}
export function setGeoSelect(el) {geoSelect=el}

export function geoSelectionAllowed() {
  const numberOfGeoSelections = geoSelect.selected.size+1
  const numberOfBySelections = bySelect.selected.size
  return numberOfGeoSelections * numberOfBySelections <= 6
}

export function bySelectionAllowed(numberOfSelections) {
  const numberOfGeoSelections = geoSelect.selected.size
  const numberOfBySelections = numberOfSelections===1 ? bySelect.selected.size+1 : numberOfSelections
  return numberOfGeoSelections * numberOfBySelections <= 6
}
