/*

this implements the constraint logic - interdependend between both, geo and by-select boxes.

for an overview of the constraints, see selection-logic-overview.ods

*/

let bySelect
let geoSelect


export function setBySelect(el) {bySelect=el}
export function setGeoSelect(el) {geoSelect=el}

// onSelect
// return 0=ok, 1=more than 10 countries & 1 idicator, 2=more than 2 countries and 3 indicators
export function geoSelectionAllowed(k,v) {
  if(!bySelect || !geoSelect) {return true}
  const isDeselection = Array.from( geoSelect.selected.keys() ).includes(k)
  if(isDeselection) {
    return 0
  } else {
    const numberOfGeoSelections = geoSelect.selected.size+1
    const numberOfBySelections = bySelect.selected.size

    if(numberOfBySelections===3) {
      if(numberOfGeoSelections>2) {
        return 2
      } else {
        return 0
      }
    } else {
      if(numberOfGeoSelections>10) {
        return 1
      } else {
        return 0
      }
    }

  }
}

// onSelect
export function bySelectionAllowed(numberOfSelections) {
  if(!bySelect || !geoSelect || numberOfSelections===1) {return true}
  return geoSelect.selected.size * numberOfSelections <= 6
}
