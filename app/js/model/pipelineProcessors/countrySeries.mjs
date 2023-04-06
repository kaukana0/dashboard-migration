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

import * as MultiDim from "../../../components/multiDimAccess/multiDimAccess.mjs"

export function process(inputDataFromRequest, inputDataFromCfg, output) {
  if(!output.countrySeriesData) {
    output.countrySeriesData = []
    output.countrySeriesData.push( Object.keys(inputDataFromRequest.dimension.geo.category.index) )
  }

  const valence = MultiDim.calcOrdinalValence(inputDataFromRequest.size)
  const geoDimIdx = inputDataFromRequest.id.findIndex(e=>e==="geo")
  const geoDimMax = inputDataFromRequest.size[geoDimIdx]
  const timeDimIdx = inputDataFromRequest.id.findIndex(e=>e==="time")
  const time = getTime(inputDataFromRequest)
  const timeCodeIdx = inputDataFromRequest.dimension.time.category.index[time]

  const ll = []
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

  output.countrySeriesData.push(ll)
}

//  https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/ILC_PEPS06N?c_birth=NAT&age=Y20-24&sex=T&geo=EU&freq=A&unit=PC&time=2020
function getTime(url) {
  return "2020"
}
