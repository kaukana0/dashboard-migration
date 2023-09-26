// if EU is missing in dataset, add it artificially and after-the-fact
// in country series data as "Not available"

import {MS} from "../../common/magicStrings.mjs"

export function process(inputDataFromRequest, inputDataFromCfg, output) {
  if(output["countrySeries"]) {
    if(output.countrySeries.data[0][0]!=="EU") {
      output.countrySeries.data[0].unshift("EU")
      for(let i=1;i<output.countrySeries.data.length;i++) {
        output.countrySeries.data[i].splice(1, 0, MS.ID_NO_DATAPOINT_COUNTRYSERIES)
      }
    }
  }
}
