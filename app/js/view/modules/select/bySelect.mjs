import {MS} from "../../../common/magicStrings.mjs"
import * as GROUPS from "../../../model/common/groupDefinition.mjs"

// these boxes can act as a by-select box. TODO: think about denoting that otherwise, eg in the config
const bySelectBoxIds = [MS.BY_SELECT_ID, MS.INDIC_MG_ID, MS.INDIC_LEG_FRAM]


export function getBySelectSelections(boxes) {
  let retVal = null
  bySelectBoxIds.forEach(e=>{
    if(boxes.selections.get(e) && retVal===null) {
      retVal = boxes.selections.get(e)
    }
  })
  return retVal  
}

export function getBySelectSelectedCount(boxes) {
  return getBySelectSelections(boxes).size
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
  return bySelectBoxIds.includes(id)
}

export function getBySelectBox(boxes) {
	for(const box of boxes) {
		if(isBySelectBox(box.getAttribute("dimension"))) {
			return box
		}
	}	
}
