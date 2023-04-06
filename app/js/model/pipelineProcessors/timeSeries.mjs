import * as MultiDim from "../../../components/multiDimAccess/multiDimAccess.mjs"
import * as MA from "./common/metadataAccess.mjs"
import {get as getKey} from "./common/key.mjs"

/*
adds something like this to output in a cumulative fashion (can be called more than once):
timeSeriesData: [
  [2020,2021,2023],
  [EU,1,2,3],
  [LT,1,2,3]
]
*/
export function process(inputDataFromRequest, inputDataFromCfg, output) {
  if(!output.timeSeriesData) {
    output.timeSeriesData = [output.time]
  }

  const valence = MultiDim.calcOrdinalValence(inputDataFromRequest.size)

  const [byDim, byIdx] = MA.getIndexOfByDimension(inputDataFromRequest.id)
  const geoIdx = MA.getIndexOfDimension(inputDataFromRequest.id, "geo")
  const timeIdx = MA.getIndexOfDimension(inputDataFromRequest.id, "time")

  const byMax = inputDataFromRequest.size[byIdx]  // "by" c_birth or citizen
  const geoMax = inputDataFromRequest.size[geoIdx]
  const timeMax = inputDataFromRequest.size[timeIdx]

  let byLabel = ""
  let geoLabel = ""

  for(let by=0; by<byMax; by++) {
    byLabel = Object.keys(inputDataFromRequest.dimension[byDim].category.index)[by]
    for(let geo=0; geo<geoMax; geo++) {
      geoLabel = Object.keys(inputDataFromRequest.dimension.geo.category.index)[geo]
      const ll = [getKey(byLabel,geoLabel)]   // is unique. used by chart as key for tooltip label mapping to text.
      for(let time=0; time<timeMax; time++) {
        let bla = new Array(inputDataFromRequest.size.length)
        bla.fill(0)
        bla[byIdx] = by
        bla[geoIdx] = geo
        bla[timeIdx] = time
        const i = MultiDim.getIndex(valence, bla)
        if(typeof inputDataFromRequest.value[i] === 'undefined') {
          ll.push(null)
        } else {
          ll.push(inputDataFromRequest.value[i])
        }
      }
      output.timeSeriesData.push(ll)
    }
  }

}
