import * as MultiDim from "../../../components/multiDimAccess/multiDimAccess.mjs"
import * as MA from "./common/metadataAccess.mjs"
import * as Url from "../../url.mjs"

/*
extracts data for all countries at a certain time.

adds something like this to output in a cumulative fashion (can be called more than once):
countrySeriesData: [
  ["EU", "BE", "AT"]
  ["EU",1,2,3],
  ["BE",1,2,3],
  ["AT",0,230,50]
]
*/
export function process(inputDataFromRequest, inputDataFromCfg, output) {
  if(!output.countrySeries) {
    output.countrySeries = {}
    output.countrySeries.data = []
    output.countrySeries.data.push( Object.keys(inputDataFromRequest.dimension.geo.category.index) )
  }

  const valence = MultiDim.calcOrdinalValence(inputDataFromRequest.size)
  const geoDimIdx = inputDataFromRequest.id.findIndex(e=>e==="geo")
  const geoDimMax = inputDataFromRequest.size[geoDimIdx]
  const timeDimIdx = inputDataFromRequest.id.findIndex(e=>e==="time")
  const time = Url.getTime(inputDataFromCfg)[0]
  const timeCodeIdx = inputDataFromRequest.dimension.time.category.index[time]
  const [byDim] = MA.getIndexOfByDimension(inputDataFromRequest.id)
  const xByCode = Object.keys(inputDataFromRequest.dimension[byDim].category.index)[0]

  const ll = [xByCode]
  for(let geo=0; geo<geoDimMax; geo++) {
    let bla = new Array(inputDataFromRequest.size.length)
    bla.fill(0)
    bla[geoDimIdx] = geo
    bla[timeDimIdx] = timeCodeIdx
    const i = MultiDim.getIndex(valence, bla)
    if(typeof inputDataFromRequest.value[i] === 'undefined') {
      ll.push(null)
    } else {
      ll.push(inputDataFromRequest.value[i])
    }
  }

  output.countrySeries.data.push(ll)
}
