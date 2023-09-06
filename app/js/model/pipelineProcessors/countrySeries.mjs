import * as MultiDim from "../../../components/multiDimAccess/multiDimAccess.mjs"
import * as TM from "../common/textMappings.mjs"
import * as Url from "../url.mjs"
import * as EUCode from "../common/euCode.mjs"
import * as BYCode from "../common/byCode.mjs"

/*
extracts data for all countries at a certain time.

adds something like this to output in a cumulative fashion (can be called more than once):
countrySeriesData: [
  ["EU", "BE", "AT"]
  ["NAT",1,2,3],            *
  ["EU_...",1,2,3],         *
  ["NON_EU_..",0,230,50]    *
]

The order of the * marked arrays determines the order of items 
in chart tooltips and legend.
That's why there is an effort made here to already extract the data
in a given order instead of sorting it after extraction.
*/
export function process(inputDataFromRequest, inputDataFromCfg, output) {
  if(!output.countrySeries) {
    output.countrySeries = {}
    output.countrySeries.data = [[]]
  }

  const valence = MultiDim.calcOrdinalValence(inputDataFromRequest.size)
  const geoDimIdx = inputDataFromRequest.id.findIndex(e=>e==="geo")
  const timeDimIdx = inputDataFromRequest.id.findIndex(e=>e==="time")
  const time = Url.getTime(inputDataFromCfg)[0]
  const timeCodeIdx = inputDataFromRequest.dimension.time.category.index[time]
  const [byDim, byIdx] = TM.getIndexOfByDimension(inputDataFromRequest.id)

  output.byOrder.forEach( (orderedBy) => {
    const by = inputDataFromRequest.dimension[byDim].category.index[BYCode.replaceRev(orderedBy)]
    // possibly not in data
    if(typeof(by) !== "undefined") {
      const xByCode = Object.keys(inputDataFromRequest.dimension[byDim].category.index)[by]
      const ll = [TM.getByLabel(byDim, BYCode.replace(xByCode))]    // used as display text by chart tooltip
      // the order of countries comes from a processor which was run before this processor
      output.countryOrder.forEach( country => {
        let coeff = new Array(inputDataFromRequest.size.length)
        const idxGeo = inputDataFromRequest.dimension.geo.category.index[EUCode.replaceRev(country)]
        if(country==="-") {
          output.countrySeries.data[0].push(null)
          ll.push(null)
        } else {
          if(typeof idxGeo !== 'undefined') {
            //output.countrySeries.data[0].push( inputDataFromRequest.dimension.geo.category.label[country] )
            output.countrySeries.data[0].push( country )
    
            coeff.fill(0)
            coeff[byIdx] = by
            coeff[geoDimIdx] = idxGeo
            coeff[timeDimIdx] = timeCodeIdx
            const i = MultiDim.getIndex(valence, coeff)
            if(typeof inputDataFromRequest.value[i] === 'undefined') {
              ll.push(null)
            } else {
              ll.push(inputDataFromRequest.value[i])
            }
          }
        }
      })
  
      output.countrySeries.data.push(ll)
    }

  })

}
