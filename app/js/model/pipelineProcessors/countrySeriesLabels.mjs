import * as TM from "./common/textMappings.mjs"

// TODO
export function process(inputDataFromRequest, inputDataFromCfg, output) {
  if(!output.countrySeries.labels) {
    const bla = TM.getIndexOfByDimension(inputDataFromRequest.id)[0] === "c_birth" ? TM.grp_c : TM.grp_b
    output.countrySeries.labels = new Map()
  }
/*
  if(TM.getIndexOfByDimension(inputDataFromRequest.id)[0] === "c_birth") {
    output.countrySeries.labels.set("NAT, EU", "Native born")
    output.countrySeries.labels.set("EU_FOR, EU", "Born in EU")
    output.countrySeries.labels.set("NEU_FOR, EU", "Non EU born")
  } else {
    output.countrySeries.labels.set("NAT, EU", "Nationals")
    output.countrySeries.labels.set("EU_FOR, EU", "EU citizens")
    output.countrySeries.labels.set("NEU_FOR, EU", "Non EU citizens")
  }
*/
  //const dim = TM.getIndexOfByDimension(inputDataFromRequest.id)[0]
  //output.countrySeries.labels.set()

}