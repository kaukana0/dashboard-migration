// the central place for mapping things like codes to labels

export const grp_c = new Map()   // TODO: take from yaml
grp_c.set("citizenNAT","NAT")
grp_c.set("citizenEU_FOR","EU27_2020_FOR")
grp_c.set("citizenNEU_FOR","NEU27_2020_FOR")

export const grp_b = new Map()
grp_b.set("c_birthNAT","NAT")
grp_b.set("c_birthEU_FOR","EU27_2020_FOR")
grp_b.set("c_birthNEU_FOR","NEU27_2020_FOR")


const labels = new Map()
labels.set("citizenNAT", "Nationals")
labels.set("citizenEU_FOR", "Citizens of another EU country")
labels.set("citizenNEU_FOR", "Citizens of a non-EU country")
labels.set("c_birthNAT", "Native-born")
labels.set("c_birthEU_FOR", "Born in another EU country")
labels.set("c_birthNEU_FOR", "Born in a non-EU country") 


const shortLabels = new Map()
shortLabels.set("citizenNAT", "Nationals")
shortLabels.set("citizenEU_FOR", "EU Citizens")
shortLabels.set("citizenNEU_FOR", "Non EU Citizens")
shortLabels.set("c_birthNAT", "Native-born")
shortLabels.set("c_birthEU_FOR", "EU Born")
shortLabels.set("c_birthNEU_FOR", "Non EU Born") 


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

// TODO: take from yaml
export function getByLabel(byDim, code, _default = "") {
  return labels.has(byDim+code) ? labels.get(byDim+code) : _default
}

export function getByLabelShort(byDim, code, _default = "") {
  return shortLabels.has(byDim+code) ? labels.get(byDim+code) : _default
}
