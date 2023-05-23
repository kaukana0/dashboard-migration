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
function selectBoxesLogic() {
  // bySelectLogic
  // constraintLogic
  // switchLogic (line <-> dot)
}

const grp_c = ["NAO","CEU","CNEU"]
const grp_b = ["NAB","BEU","BNEU"]


function beforeCurrentSelectionHappens(k,v) {
  
  const el = document.getElementById("blablub")

  function getIntersection(group, k) {

  }

  if(grp_c.includes(k)) {
    const intersection = structuredClone(el.selected)
    const kkk = intersection.keys()
    for (let k2 of kkk) {
      if (!grp_c.includes(k2)) { intersection.delete(k2) }
    }
    el.selected = intersection
  }

  if(grp_b.includes(k)) {
    const intersection = structuredClone(el.selected)
    const kkk = intersection.keys()
    for (let k2 of kkk) {
      if (!grp_b.includes(k2)) { intersection.delete(k2) }
    }
    el.selected = intersection
  }

  return true
}

function afterCurrentSelectionHasHappened(k,v) {
  if(k=="By country of citizenship") {
    document.getElementById("blablub").selected = grp_c
  }
  if(k=="By country of birth") {
    document.getElementById("blablub").selected = grp_b
  }
}

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
