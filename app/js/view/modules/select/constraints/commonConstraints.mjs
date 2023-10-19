/*

this implements the constraint logic - interdependend between both, geo and by-select boxes.

for an overview of the constraints, see selection-logic-overview.ods

*/

import {MS} from "../../../../common/magicStrings.mjs"


let bySelect
let geoSelect


export function setBySelect(el) {bySelect=el}
export function setGeoSelect(el) {geoSelect=el}

/* onSelect
return:
0 = ok
1 = 1 idicator & more than 10 countries
2 = >1 indicators & more than 2 countries
*/
export function geoSelectionAllowed(k,v) {
  if(!bySelect || !geoSelect) {return true}
  const isDeselection = Array.from( geoSelect.selected.keys() ).includes(k)
  if(isDeselection) {
    return 0
  } else {
    const numberOfGeoSelections = geoSelect.selected.size+1
    const numberOfBySelections = bySelect.box.selected.size

    if(numberOfBySelections>1) {
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

export function getNOAllowedBySelects(geoCount, cardId) {
  if(cardId===(MS.CARD_DOM_ID_PREFIX+MS.NAME_CARD_ACTIVE_CITIZENSHIP_1).replaceAll(" ","-")) {return 2}    // :-(
  if(cardId===(MS.CARD_DOM_ID_PREFIX+MS.NAME_CARD_ACTIVE_CITIZENSHIP_2).replaceAll(" ","-")) {return 1}
  return geoCount>2 ? 1 : 3
}

export function getNOAllowedGeoSelects(byCount, geoCount) {
  return byCount>1 ? 2-geoCount : 10-geoCount
}