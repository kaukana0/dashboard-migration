/*
this implements the constraint logic concerning by-select.
not regarding inter-box constraints.
*/

import {DEFINITIONS as GROUPS} from "../../../model/common/groupDefinition.mjs"
import {DEFINITIONS as CM} from "../../../model/common/codeMappings.mjs"


// onSelect (before onSelect callback is invoked; possibility to supress that from happening)
export function ensureCorrectInterGroupSelection(domElement, k,v) {

  // A = [], B = Map, return [] of members of B who's key is in A
  function getIntersection(A, B) {
    const retVal = []
    if(!A) return
    for (let k of B.keys()) {
      if (A.includes(k)) { retVal.push(k) }
    }
    return retVal
  }

  domElement.selected = getIntersection(getGroupByKey(k), domElement.selected)

  return true
}

// onSelected (called after onSelect only if it returns true)
export function tryToSelectWholeGroup(domElement, k,v) {
  if(k=="By country of citizenship") {
    domElement.selected = Array.from(GROUPS.GRP_C.keys())
  } else if(k=="By country of birth") {
    domElement.selected = Array.from(GROUPS.GRP_B.keys())
  }
}

export function howManyAreGoingToBeSelected(k) {
  if(k=="By country of citizenship" || k=="By country of birth") {
    return 3
  } else {
    return 1
  }
}

export function getDataset(DOMel) {
  return DOMel.getAttribute( CM.CODE_TO_DSID.get(DOMel.selected.keys().next().value) )
}

function getGroupByKey(k) {
  const ckeys = Array.from(GROUPS.GRP_C.keys())
  const bkeys = Array.from(GROUPS.GRP_B.keys())
  if(ckeys.includes(k)) {
    return ckeys
  } else if(bkeys.includes(k)) {
    return bkeys
  } else {
    console.debug("bySelectBox logic: no dimension for key:", k)
    return ""
  }
}