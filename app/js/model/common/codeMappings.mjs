import {MS} from "../../common/magicStrings.mjs"

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
code2Dim.set("indicNAT", MS.DIM_CITIZEN)      // an alternative to citizen, used only by "Active citizenship" cards
code2Dim.set("indicEU_FOR",  MS.DIM_CITIZEN)
code2Dim.set("indicNEU_FOR", MS.DIM_CITIZEN)

export const DEFINITIONS = {
  CODE_TO_DSID : code2DsId,   // DataSet ID
  CODE_TO_DIM : code2Dim
}