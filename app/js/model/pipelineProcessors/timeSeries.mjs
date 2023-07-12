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

the URL has all the info about the exact UI selections.
however, there may be more data available - ie the request might have had some params stripped
so we gotta filter them here
*/
export function process(inputDataFromRequest, inputDataFromCfg, output) {
  const selectedTime = parseInt(Url.getTime(inputDataFromCfg)[0])    // [from,to]  we only need "from"
  const selectedGeo = Url.getGeo(inputDataFromCfg)

  output.timeSeries = {}
  output.timeSeries.data = [output.time.filter(e=>parseInt(e)>=selectedTime)]

  
  const [byDim, byIdx] = TM.getIndexOfByDimension(inputDataFromRequest.id)
  const geoDimIdx = inputDataFromRequest.id.findIndex(e=>e==="geo")
  const timeDimIdx = inputDataFromRequest.id.findIndex(e=>e==="time")
  
  const byDimMax = inputDataFromRequest.size[byIdx]  // "by" c_birth or citizen
  const geoDimMax = inputDataFromRequest.size[geoDimIdx]
  const timeDimMax = inputDataFromRequest.size[timeDimIdx]
  
  const valence = MultiDim.calcOrdinalValence(inputDataFromRequest.size)

  let byLabel = ""
  let geoLabel = ""

  for(let by=0; by<byDimMax; by++) {
    byLabel = Object.keys(inputDataFromRequest.dimension[byDim].category.index)[by]
    for(let geo=0; geo<geoDimMax; geo++) {
      geoLabel = Object.keys(inputDataFromRequest.dimension.geo.category.index)[geo]
      if(!selectedGeo.find(e=>e===geoLabel)) continue   // filter what isn't selected
      // combi of by/country is a unique compound key. used as display text by chart tooltip and legend
      const ll = [geoLabel + ", " + TM.getByLabelShort(byDim, byLabel)] 
      for(let time=0; time<timeDimMax; time++) {
        if(output.time[time]<selectedTime) continue  // filter anything earlier
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
