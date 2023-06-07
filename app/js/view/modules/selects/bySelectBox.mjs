/*
here is the logic regarding country- and by-select.

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
*/

import * as MS from "./magicStrings.mjs"

const grp_c = new Map()   // TODO: take this from yaml codelist ?
grp_c.set("CNAT","NAT")
grp_c.set("CEU","EU27_2020_FOR")
grp_c.set("CNEU","NEU27_2020_FOR")

const grp_b = new Map()
grp_b.set("BNAT","NAT")
grp_b.set("BEU","EU27_2020_FOR")
grp_b.set("BNEU","NEU27_2020_FOR")

const code2DsId = new Map()
code2DsId.set("CNAT","dataset-country")
code2DsId.set("CEU","dataset-country")
code2DsId.set("CNEU","dataset-country")
code2DsId.set("BNAT","dataset-cbirth")
code2DsId.set("BEU","dataset-cbirth")
code2DsId.set("BNEU","dataset-cbirth")

const code2Dim = new Map()
code2Dim.set("CNAT","country")
code2Dim.set("CEU","country")
code2Dim.set("CNEU","country")
code2Dim.set("BNAT","c_birth")
code2Dim.set("BEU","c_birth")
code2Dim.set("BNEU","c_birth")



export function imposeConstraints(el) {
  el.onSelect = beforeCurrentSelectionHappens.bind(this, el)
  el.onSelected = afterCurrentSelectionHasHappened.bind(this, el)
  return el
}

function beforeCurrentSelectionHappens(domElement, k,v) {

  // A = [], B = Map, return [] of members of B who's key is in A
  function getIntersection(A, B) {
    if(!A) return
    const retVal = []
    for (let k of B.keys()) {
      if (A.includes(k)) { retVal.push(k) }
    }
    return retVal
  }

  domElement.selected = getIntersection(getGroupByKey(k), domElement.selected)

  return true
}

function afterCurrentSelectionHasHappened(domElement, k,v) {
  if(k=="By country of citizenship") {
    domElement.selected = Array.from(grp_c.keys())
  } else if(k=="By country of birth") {
    domElement.selected = Array.from(grp_b.keys())
  }
}

export function getFrag(v) {
  let retVal = ""
  const merged = new Map([...grp_b, ...grp_c])
  for(let [key] of v.entries()) {
    retVal += code2Dim.get(key)+"="+merged.get(key)+"&"  // TODO: magic string!
  }
  return retVal
}

export function getDataset(el) {
  return el.getAttribute( code2DsId.get(el.selected.keys().next().value) )
}

function getGroupByKey(k) {
  const ckeys = Array.from(grp_c.keys())
  const bkeys = Array.from(grp_b.keys())
  if(ckeys.includes(k)) {
    return ckeys
  } else if(bkeys.includes(k)) {
    return bkeys
  } else {
    console.debug("bySelectBox logic: no dimension for key:", k)
    return ""
  }
}