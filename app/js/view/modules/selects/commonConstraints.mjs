/*

this implements the constraint logic - interdependend between both, geo and by-select boxes.

for an overview of the constraints, see selection-logic-overview.ods

*/

let bySelect
let geoSelect


export function setBySelect(el) {bySelect=el}
export function setGeoSelect(el) {geoSelect=el}

// onSelect
export function geoSelectionAllowed(k,v) {
  if(!bySelect || !geoSelect) {return true}
  const isDeselection = Array.from( geoSelect.selected.keys() ).includes(k)
  if(isDeselection) {
    return true
  } else {
    const numberOfGeoSelections = geoSelect.selected.size+1
    const numberOfBySelections = bySelect.selected.size
    if(numberOfBySelections===1 && numberOfGeoSelections<=10) {return true}
    return numberOfGeoSelections * numberOfBySelections <= 6
  }
}

// onSelect
export function bySelectionAllowed(numberOfSelections) {
  if(!bySelect || !geoSelect || numberOfSelections===1) {return true}
  return geoSelect.selected.size * numberOfSelections <= 6
}
