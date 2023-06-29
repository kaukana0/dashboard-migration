import * as TM from "../common/textMappings.mjs"
import {MS} from "../../common/magicStrings.mjs"


export function process(inputDataFromRequest, inputDataFromCfg, output) {
  if(!output.countrySeries.labels) {
    output.countrySeries.labels = new Map()
  }

  if(TM.getIndexOfByDimension(inputDataFromRequest.id)[0] === "c_birth") {
    output.countrySeries.labels.set("NAT", MS.TXT_BY_LBL_SHORT_BNAT)
    output.countrySeries.labels.set("EU_FOR", MS.TXT_BY_LBL_SHORT_BEU)
    output.countrySeries.labels.set("NEU_FOR", MS.TXT_BY_LBL_SHORT_BNEU)
  } else {
    output.countrySeries.labels.set("NAT", MS.TXT_BY_LBL_SHORT_CNAT)
    output.countrySeries.labels.set("EU_FOR", MS.TXT_BY_LBL_SHORT_CEU)
    output.countrySeries.labels.set("NEU_FOR", MS.TXT_BY_LBL_SHORT_CNEU)
  }

}