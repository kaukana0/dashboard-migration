/*
here is the logic regarding country- and by-selectBoxes.

in line display:
  by-select logic: when click any birth, citizenships get deselected and vice versa
  constraint logic (spanning 2 selectBoxes):
    when =1 by-selector, all countries are selectable
    when >1 by-selector, make sure #by-selections * #country-selections < 7
    always let users know how many are MAX (not how many are STILL) selectable in by and country, respectively

when switching to vertical connectd dot plot display:
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


const grp_c = [MS.MS.BY_CITIZEN,"EU27_2020_FOR","NEU27_2020_FOR"]
const grp_b = [MS.MS.BY_BIRTH,"EU27_2020_FOR","NEU27_2020_FOR"]


function beforeCurrentSelectionHappens(domElement, k,v) {

  // A = [], B = Map, return [] of members of B who's key is in A
  function getIntersection(A, B) {
    const retVal = []
    for (let k of B.keys()) {
      if (A.includes(k)) { retVal.push(k) }
    }
    return retVal
  }

  if(grp_c.includes(k)) {
    domElement.selected = getIntersection(grp_c, domElement.selected)
  } else if(grp_b.includes(k)) {
    domElement.selected = getIntersection(grp_b, domElement.selected)
  }

  return true
}

function afterCurrentSelectionHasHappened(domElement, k,v) {
  if(k=="By country of citizenship") {
    domElement.selected = grp_c
  }
  if(k=="By country of birth") {
    domElement.selected = grp_b
  }
}

export function imposeConstraints(el) {
//  el.onSelect = beforeCurrentSelectionHappens.bind(this, el)

el.onSelect = function(k,v) {
  const tmp = el.onSelect
  beforeCurrentSelectionHappens(k,v)
  tmp(k,v)
}

  el.onSelected = afterCurrentSelectionHasHappened.bind(this, el)
  return el
}

/*
setTimeout( ()=>{

  const d = new Map()

  d.set("NAO", "Nationals")
  d.set("CEU", "Citizens of another EU country")
  d.set("CNEU", "Citizens of a non-EU country")
  d.set("NAB", "Native-born")
  d.set("BEU", "Born in another EU country")
  d.set("BNEU", "Born in a non-EU country")
  d.set("A", "A")
  d.set("B", "B")

  const g = new Map()
  g.set("NAO",{selectable:true, text:"By country of citizenship"})
  g.set("NAB",{selectable:true, text:"By country of birth"})
  g.set("A",{selectable:false, text:"Not selectable group header"})
  g.set("B",{selectable:false})

  document.getElementById("blablub").onSelect = beforeCurrentSelectionHappens
  document.getElementById("blablub").onSelected = afterCurrentSelectionHasHappened
  document.getElementById("blablub").data = [d, g]
},300 )
*/