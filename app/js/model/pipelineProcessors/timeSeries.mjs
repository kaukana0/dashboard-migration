import * as MultiDim from "../../../components/multiDimAccess/multiDimAccess.mjs"
import * as TM from "../common/textMappings.mjs"
import * as Url from "../url.mjs"
import * as EUCode from "../common/euCode.mjs"
import * as BYCode from "../common/byCode.mjs"
import {MS} from "../../common/magicStrings.mjs"

/*
adds something like this to output:

timeSeriesData: [
  [2020,2021,2023],
  [EU,1,2,3],       *
  [LT,1,2,3]        *
]

The order of the * marked arrays determines the order of items 
in chart tooltips and legend.
That's why there is an effort made here to already extract the data
in a given order instead of sorting it after extraction.

The URL has all the info about the exact UI selections.
however, there may be more data available - ie the request might have had some params stripped
so we gotta filter them here.
*/
export function process(inputDataFromRequest, inputDataFromCfg, output) {
  const selectedTime = parseInt(Url.getTime(inputDataFromCfg)[0])    // [from,to]  we only need "from"
  const selectedGeo = Url.getGeo(inputDataFromCfg)

  output.timeSeries = {}
  output.timeSeries.data = [output.time.filter(e=>parseInt(e)>=selectedTime)]

  
  const [byDim, byIdx] = TM.getIndexOfByDimension(inputDataFromRequest.id)
  const geoDimIdx = inputDataFromRequest.id.findIndex(e=>e==="geo")
  const timeDimIdx = inputDataFromRequest.id.findIndex(e=>e==="time")
  
  const geoDimMax = inputDataFromRequest.size[geoDimIdx]
  const timeDimMax = inputDataFromRequest.size[timeDimIdx]
  
  const valence = MultiDim.calcOrdinalValence(inputDataFromRequest.size)

  let byCode
  let geoLabel

  for(let geo=0; geo<geoDimMax; geo++) {

    output.byOrder.forEach( (orderedBy) => {
      const by = inputDataFromRequest.dimension[byDim].category.index[BYCode.replaceRev(orderedBy)]
      // possibly not in data
      if(typeof(by) !== "undefined") {
        byCode = BYCode.replace( Object.keys(inputDataFromRequest.dimension[byDim].category.index)[by] )
        geoLabel = EUCode.replace( Object.keys(inputDataFromRequest.dimension.geo.category.index)[geo] )
        if(typeof geoLabel === "undefined") {console.warn("timeSeries processor: something is fishy, a geo is missing in the input data!")}
        if(selectedGeo.find(e=>e===geoLabel)) {   // filter what isn't selected
          // combi of by/country is a unique compound key. used as display text by chart tooltip and legend
          const ll = [geoLabel + ", " + TM.getByLabelShort(byDim, byCode)] 
          for(let time=0; time<timeDimMax; time++) {
            if(output.time[time]<selectedTime) continue  // filter anything earlier
            let coeff = new Array(inputDataFromRequest.size.length)
            coeff.fill(0)
            coeff[byIdx] = by
            coeff[geoDimIdx] = geo
            coeff[timeDimIdx] = time
            const i = MultiDim.getIndex(valence, coeff)
            if(typeof inputDataFromRequest.value[i] === 'undefined') {
              ll.push(MS.ID_NO_DATAPOINT_TIMESERIES)
            } else {
              ll.push(inputDataFromRequest.value[i])
            }
          }
          output.timeSeries.data.push(ll)
        }
      } else {
        //console.error("timeSeries processor: by not found for orderedBy",orderedBy)
      }
    })
  }
}
