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
  let dim = "c_birth"
  let idx = arr.findIndex(e=>e===dim)
  if(idx===-1) {
    dim = "citizen"
    idx = arr.findIndex(e=>e===dim)
  }
  return [dim, idx]
}

export function getByLabel(byDim, code, _default = "") {
  return labels.has(byDim+code) ? labels.get(byDim+code) : _default
}

export function getByLabelShort(byDim, code, _default = "") {
  return shortLabels.has(byDim+code) ? shortLabels.get(byDim+code) : _default
}
