import * as MultiDim from "../../../components/multiDimAccess/multiDimAccess.mjs"
import * as MA from "./common/metadataAccess.mjs"
import {get as getKey} from "./common/key.mjs"

/*
adds something like this to output in a cumulative fashion (can be called more than once):
countrySeriesData: [
  [EU,1,2,3],
  [LT,1,2,3]
]
*/
export function process(inputDataFromRequest, inputDataFromCfg, output) {
  if(!output.countrySeriesData) {
    output.countrySeriesData = []
  }
  console.log("ifc",inputDataFromCfg)
  output.countrySeriesData.push(["EU", "BE", "AT"])
  output.countrySeriesData.push(["EU", 30, 350, 200])
  output.countrySeriesData.push(["BE", 10, 330, 100])
  output.countrySeriesData.push(["AT", 0, 230, 50])
}
