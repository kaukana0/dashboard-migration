/*
this implements the constraint logic concerning by-select.
not regarding inter-box constraints.
*/

import {DEFINITIONS as GROUPS} from "../../../model/common/groupDefinition.mjs"
import {DEFINITIONS as CM} from "../../../model/common/codeMappings.mjs"
import {MS} from "../../../common/magicStrings.mjs"


// onSelected (called after onSelect only if it returns true)
export function tryToSelectWholeGroup(domElement, k,v) {
  if(k===MS.TXT_GRP_C) {
    const x = Array.from(GROUPS.GRP_C.keys())
    x.push(k)
    domElement.selected = x
    return true
  } else if(k===MS.TXT_GRP_B) {
    const x = Array.from(GROUPS.GRP_B.keys())
    x.push(k)
    domElement.selected = x
    return true
  }
  return false
}

export function howManyAreGoingToBeSelected(k) {
  if(k==MS.TXT_GRP_C || k==MS.TXT_GRP_B) {
    return 3
  } else {
    return 1
  }
}

export function getDataset(DOMel) {
  return DOMel.getAttribute( CM.CODE_TO_DSID.get(DOMel.selected.keys().next().value) )
}
