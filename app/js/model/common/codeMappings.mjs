import {MS} from "../../common/magicStrings.mjs"

const code2DsId = new Map()
code2DsId.set(MS.TXT_GRP_C, MS.DS_ID_CITIZEN)
code2DsId.set("citizenNAT", MS.DS_ID_CITIZEN)
code2DsId.set("citizenEU_FOR",  MS.DS_ID_CITIZEN)
code2DsId.set("citizenNEU_FOR", MS.DS_ID_CITIZEN)
code2DsId.set(MS.TXT_GRP_B, MS.DS_ID_CITIZEN)
code2DsId.set("c_birthNAT", MS.DS_ID_BIRTH)
code2DsId.set("c_birthEU_FOR",  MS.DS_ID_BIRTH)
code2DsId.set("c_birthNEU_FOR", MS.DS_ID_BIRTH)

code2DsId.set(MS.NEU_P_HHAB, MS.DS_ID_CITIZEN)   // "Naturalisation rate" indicator
code2DsId.set(MS.EU_P_HHAB, MS.DS_ID_CITIZEN)

const code2Dim = new Map()
code2Dim.set("citizenNAT", MS.DIM_CITIZEN)
code2Dim.set("citizenEU_FOR",  MS.DIM_CITIZEN)
code2Dim.set("citizenNEU_FOR", MS.DIM_CITIZEN)
code2Dim.set("c_birthNAT", MS.DIM_BIRTH)
code2Dim.set("c_birthEU_FOR",  MS.DIM_BIRTH)
code2Dim.set("c_birthNEU_FOR", MS.DIM_BIRTH)

export const DEFINITIONS = {
  CODE_TO_DSID : code2DsId,   // DataSet ID
  CODE_TO_DIM : code2Dim
}