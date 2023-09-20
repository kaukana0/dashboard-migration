// the central place for mapping things like codes to labels + helpers
// TODO: take from yaml whatever is possible

import {MS} from "../../common/magicStrings.mjs"

const labels = new Map()
labels.set("citizenNAT", MS.TXT_BY_LBL_CNAT)
labels.set("citizenEU_FOR", MS.TXT_BY_LBL_CEU)
labels.set("citizenNEU_FOR", MS.TXT_BY_LBL_CNEU)
labels.set("c_birthNAT", MS.TXT_BY_LBL_BNAT)
labels.set("c_birthEU_FOR", MS.TXT_BY_LBL_BEU)
labels.set("c_birthNEU_FOR", MS.TXT_BY_LBL_BNEU)

const shortLabels = new Map()
shortLabels.set("citizenNAT", MS.TXT_BY_LBL_SHORT_CNAT)
shortLabels.set("citizenEU_FOR", MS.TXT_BY_LBL_SHORT_CEU)
shortLabels.set("citizenNEU_FOR", MS.TXT_BY_LBL_SHORT_CNEU)
shortLabels.set("c_birthNAT", MS.TXT_BY_LBL_SHORT_BNAT)
shortLabels.set("c_birthEU_FOR", MS.TXT_BY_LBL_SHORT_BEU)
shortLabels.set("c_birthNEU_FOR", MS.TXT_BY_LBL_SHORT_BNEU) 

// "by" means: either "by birth country" or "by citizenship"
// returns index and also what the by-dim actually is
export function getIndexOfByDimension(arr) {
  let _dim
  let _idx = -1
  const b = [MS.DIM_LEG_FRAM, MS.DIM_INDIC, MS.DIM_CITIZEN, MS.DIM_BIRTH]
  b.forEach(dim=>{
    const idx = arr.findIndex(e=>e===dim)
    if(idx!==-1 && _idx===-1) {
      _dim=dim,
      _idx=idx
    }
  })
  if(_idx===-1) { console.error("textMappings: dim not found in", arr) }
  return [_dim, _idx]
}

export function getByLabel(byDim, code, _default = "") {
  switch(byDim) {
    case "indic_mg":
    case "leg_fram":
      return code
    default:
      return labels.has(byDim+code) ? labels.get(byDim+code) : _default
  }

}

export function getByLabelShort(byDim, code, _default = "") {
  switch(byDim) {
    case "indic_mg":
    case "leg_fram":
      return code
    default:
      return shortLabels.has(byDim+code) ? shortLabels.get(byDim+code) : _default
  }
}
