// defines the groups for "byCountry/byBirth".
// also determines data which is being requested via URL.

import {MS} from "../../common/magicStrings.mjs"

const grp_c = new Map()
grp_c.set("citizenNAT","NAT")
grp_c.set("citizenEU_FOR", MS.CODE_BY_EU_DATA)
grp_c.set("citizenNEU_FOR", MS.CODE_BY_NEU_DATA)

const grp_b = new Map()
grp_b.set("c_birthNAT","NAT")
grp_b.set("c_birthEU_FOR", MS.CODE_BY_EU_DATA)
grp_b.set("c_birthNEU_FOR", MS.CODE_BY_NEU_DATA)

export const DEFINITIONS = {
  GRP_C : grp_c,
  GRP_B : grp_b
}

export function isInGroupC(code) {
  if(grp_b.has(code)) return false
  return true
}

export function isGroup(k) {
  return k===MS.TXT_GRP_C || k===MS.TXT_GRP_B
}
