import * as MultiDim from "../../../components/multiDimAccess/multiDimAccess.mjs"
import * as TM from "../common/textMappings.mjs"
import * as Url from "../url.mjs"

/*
adds something like this to output in a cumulative fashion (can be called more than once):
timeSeriesData: [
  [2020,2021,2023],
  [EU,1,2,3],
  [LT,1,2,3]
]
*/
export function process(inputDataFromRequest, inputDataFromCfg, output) {
  if(!output.timeSeries) {
    output.timeSeries = {}
    output.timeSeries.data = [output.time]
  }

  const valence = MultiDim.calcOrdinalValence(inputDataFromRequest.size)

  const [byDim, byIdx] = TM.getIndexOfByDimension(inputDataFromRequest.id)
  const geoDimIdx = inputDataFromRequest.id.findIndex(e=>e==="geo")
  const timeDimIdx = inputDataFromRequest.id.findIndex(e=>e==="time")

  const byDimMax = inputDataFromRequest.size[byIdx]  // "by" c_birth or citizen
  const geoDimMax = inputDataFromRequest.size[geoDimIdx]
  const timeDimMax = inputDataFromRequest.size[timeDimIdx]

  let byLabel = ""
  let geoLabel = ""

  const selectedTime = Url.getTime(inputDataFromCfg)    // TODO: filter by this
  const selectedGeo = Url.getGeo(inputDataFromCfg)

  for(let by=0; by<byDimMax; by++) {
    byLabel = Object.keys(inputDataFromRequest.dimension[byDim].category.index)[by]
    for(let geo=0; geo<geoDimMax; geo++) {
      geoLabel = Object.keys(inputDataFromRequest.dimension.geo.category.index)[geo]
      if(!selectedGeo.find(e=>e===geoLabel)) continue   // filter what isn't selected (and therefore in full URL)
      const ll = [TM.getByLabelShort(byDim, byLabel)+", "+geoLabel]   // is unique. used by chart as key for tooltip label mapping to text.
      for(let time=0; time<timeDimMax; time++) {
        let bla = new Array(inputDataFromRequest.size.length)
        bla.fill(0)
        bla[byIdx] = by
        bla[geoDimIdx] = geo
        bla[timeDimIdx] = time
        const i = MultiDim.getIndex(valence, bla)
        if(typeof inputDataFromRequest.value[i] === 'undefined') {
          ll.push(null)
        } else {
          ll.push(inputDataFromRequest.value[i])
        }
      }
      output.timeSeries.data.push(ll)
    }
  }

}
