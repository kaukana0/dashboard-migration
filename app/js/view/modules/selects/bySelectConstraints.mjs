/*
this implements the constraint logic concerning by-select.
not regarding inter-box constraints.
*/

import {DEFINITIONS as CM} from "../../../model/common/codeMappings.mjs"
import * as GROUPS from "../../../model/common/groupDefinition.mjs"

export function howManyAreGoingToBeSelected(k) {
  if(GROUPS.isGroup(k)) {
    return 3
  } else {
    return 1
  }
}

export function getDataset(DOMel) {
  return DOMel.getAttribute( CM.CODE_TO_DSID.get(DOMel.selected.keys().next().value) )
}
