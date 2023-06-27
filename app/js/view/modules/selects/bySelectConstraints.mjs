/*
this implements the constraint logic concerning by-select.
not regarding inter-box constraints.
*/

import {MS} from "./magicStrings.mjs"
import * as TM from "../../../model/pipelineProcessors/common/textMappings.mjs"

const code2DsId = new Map()
code2DsId.set("citizenNAT", MS.DS_ID_CITIZEN)
code2DsId.set("citizenEU_FOR",  MS.DS_ID_CITIZEN)
code2DsId.set("citizenNEU_FOR", MS.DS_ID_CITIZEN)
code2DsId.set("c_birthNAT", MS.DS_ID_BIRTH)
code2DsId.set("c_birthEU_FOR",  MS.DS_ID_BIRTH)
code2DsId.set("c_birthNEU_FOR", MS.DS_ID_BIRTH)

const code2Dim = new Map()
code2Dim.set("citizenNAT", MS.DIM_CITIZEN)
code2Dim.set("citizenEU_FOR",  MS.DIM_CITIZEN)
code2Dim.set("citizenNEU_FOR", MS.DIM_CITIZEN)
code2Dim.set("c_birthNAT", MS.DIM_BIRTH)
code2Dim.set("c_birthEU_FOR",  MS.DIM_BIRTH)
code2Dim.set("c_birthNEU_FOR", MS.DIM_BIRTH)


export const DEFINITIONS = {
  GRP_C : TM.grp_c,
  GRP_B : TM.grp_b,
  CODE_TO_DSID : code2DsId,
  CODE_TO_DIM : code2Dim
}


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
    domElement.selected = Array.from(TM.grp_c.keys())
  } else if(k=="By country of birth") {
    domElement.selected = Array.from(TM.grp_b.keys())
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
  return DOMel.getAttribute( code2DsId.get(DOMel.selected.keys().next().value) )
}

function getGroupByKey(k) {
  const ckeys = Array.from(TM.grp_c.keys())
  const bkeys = Array.from(TM.grp_b.keys())
  if(ckeys.includes(k)) {
    return ckeys
  } else if(bkeys.includes(k)) {
    return bkeys
  } else {
    console.debug("bySelectBox logic: no dimension for key:", k)
    return ""
  }
}