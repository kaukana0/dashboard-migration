import * as MA from "./common/metadataAccess.mjs"

// TODO
export function process(inputDataFromRequest, inputDataFromCfg, output) {
  if(!output.countrySeries.labels) {
    output.countrySeries.labels = new Map()
  }
/*
  if(MA.getIndexOfByDimension(inputDataFromRequest.id) === "c_birth") {
    output.countrySeries.labels.set("NAT", "Reporting country")
    output.countrySeries.labels.set("EU27_2020_FOR", "EU27 countries (from 2020) except reporting country")
    output.countrySeries.labels.set("NEU27_2020_FOR", "Non-EU27 countries (from 2020) nor reporting country")
  } else {
    output.countrySeries.labels.set("NAT", "Reporting country")
    output.countrySeries.labels.set("EU_FOR", "EU27 countries (from 2020) except reporting country")
    output.countrySeries.labels.set("NEU_FOR", "Non-EU27 countries (from 2020) nor reporting country")
  }
*/

if(MA.getIndexOfByDimension(inputDataFromRequest.id)[0] === "c_birth") {
    output.countrySeries.labels.set("NAT", "Native born")
    output.countrySeries.labels.set("EU_FOR", "Born in EU")
    output.countrySeries.labels.set("NEU_FOR", "Non EU born")
  } else {
    output.countrySeries.labels.set("NAT", "Nationals")
    output.countrySeries.labels.set("EU_FOR", "EU citizens")
    output.countrySeries.labels.set("NEU_FOR", "Non EU citizens")
  }

}