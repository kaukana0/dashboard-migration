import {MS} from "../../../common/magicStrings.mjs"
import * as GROUPS from "../../../model/common/groupDefinition.mjs"

export function getBySelectSelectedCount(boxes) {
  let count = 0
  const b = [MS.BY_SELECT_ID, MS.INDIC_MG_ID, MS.INDIC_LEG_FRAM]
  b.forEach(element=>{
    if(boxes.selections.get(element)) {
      count = boxes.selections.get(element).size
    }
  })
  return count  
}

export function isInGroupC(boxes, bySelections) {
  if(bySelections) {
    const keys = bySelections.keys()
    let retVal = ""
    if(boxes.selections.has(MS.BY_SELECT_ID)) {
      const firstSel = Array.from(keys)[0]
      retVal = GROUPS.isInGroupC(firstSel)
    }
    return retVal
  } else {
    return true
  }
}

export function isBySelectBox(id) {
  return [MS.BY_SELECT_ID, MS.INDIC_MG_ID, MS.INDIC_LEG_FRAM].includes(id)
}

export function getBySelectBox(boxes) {
	for(const box of boxes) {
		if(isBySelectBox(box.getAttribute("dimension"))) {
			return box
		}
	}	
}
