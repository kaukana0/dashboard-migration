import * as MultiDim from "../../../components/multiDimAccess/multiDimAccess.mjs"
import * as MA from "./common/metadataAccess.mjs"
import {get as getKey} from "./common/key.mjs"

/*
adds something like this to output in a cumulative fashion (can be called more than once):
cols: [
  [2020,2021,2023],
  [EU,1,2,3],
  [LT,1,2,3]
]
*/
export function process(inputData, output) {
  if(!output.cols) {
    output.cols = [output.time]
  }

  const valence = MultiDim.calcOrdinalValence(inputData.size)

  const [byDim, byIdx] = MA.getIndexOfByDimension(inputData.id)
  const geoIdx = MA.getIndexOfDimension(inputData.id, "geo")
  const timeIdx = MA.getIndexOfDimension(inputData.id, "time")

  const byMax = inputData.size[byIdx]  // "by" c_birth or citizen
  const geoMax = inputData.size[geoIdx]
  const timeMax = inputData.size[timeIdx]

  let byLabel = ""
  let geoLabel = ""

  for(let by=0; by<byMax; by++) {
    byLabel = Object.keys(inputData.dimension[byDim].category.index)[by]
    for(let geo=0; geo<geoMax; geo++) {
      geoLabel = Object.keys(inputData.dimension.geo.category.index)[geo]
      const ll = [getKey(byLabel,geoLabel)]   // is unique. used by chart as key for tooltip label mapping to text.
      for(let time=0; time<timeMax; time++) {
        let bla = new Array(inputData.size.length)
        bla.fill(0)
        bla[byIdx] = by
        bla[geoIdx] = geo
        bla[timeIdx] = time
        const i = MultiDim.getIndex(valence, bla)
        if(typeof inputData.value[i] === 'undefined') {
          ll.push(null)
        } else {
          ll.push(inputData.value[i])
        }
      }
      output.cols.push(ll)
    }
  }

}
