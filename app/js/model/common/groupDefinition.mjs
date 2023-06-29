// defines the groups for "byCountry/byBirth"

const grp_c = new Map()   // TODO: take from yaml
grp_c.set("citizenNAT","NAT")
grp_c.set("citizenEU_FOR","EU27_2020_FOR")
grp_c.set("citizenNEU_FOR","NEU27_2020_FOR")

const grp_b = new Map()
grp_b.set("c_birthNAT","NAT")
grp_b.set("c_birthEU_FOR","EU27_2020_FOR")
grp_b.set("c_birthNEU_FOR","NEU27_2020_FOR")

export const DEFINITIONS = {
  GRP_C : grp_c,
  GRP_B : grp_b
}