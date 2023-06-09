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

// this is used by both, geo and by bySelect boxes
// it's called before a wanted selection is approved,
// in order to allow or disallow the selection.
// so this needs to know how many are wanted to be selected
export function selectionAllowed(_numberOfBySelections) {
  if(!bySelect) { console.error("geoSelectConstraint: no bySelect!"); return true; }
  if(!geoSelect) { console.error("geoSelectConstraint: no geoSelect!"); return true; }


  const numberOfGeoSelections = geoSelect.selected.size + (isNumber ? 0 : 1) // assumption: can only select/deselect 1 at a time
  const numberOfBySelections = isNumber ? bySelect.selected.size+_numberOfBySelections : bySelect.selected.size

  console.log(numberOfGeoSelections, numberOfBySelections)

  return numberOfGeoSelections * numberOfBySelections <= 6
}


export function geoSelectionAllowed() {
  const numberOfGeoSelections = geoSelect.selected.size+1
  const numberOfBySelections = bySelect.selected.size
  return numberOfGeoSelections * numberOfBySelections <= 6
}

export function bySelectionAllowed(numberOfSelections) {
  const numberOfGeoSelections = geoSelect.selected.size
  const numberOfBySelections = numberOfSelections===1 ? bySelect.selected.size+1 : numberOfSelections
  console.log("*",bySelect.selected.size,numberOfSelections)
  return numberOfGeoSelections * numberOfBySelections <= 6
}
