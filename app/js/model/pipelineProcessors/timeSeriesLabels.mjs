import * as TM from "./common/textMappings.mjs"

// cumulative
export function process(inputDataFromRequest, inputDataFromCfg, output) {
  if(!output.timeSeries.labels) {
    output.timeSeries.labels = new Map()
  }

  const [byDim, byIdx] = TM.getIndexOfByDimension(inputDataFromRequest.id)
  const byMax = inputDataFromRequest.size[byIdx]  // "by" c_birth or citizen
  const geoMax = inputDataFromRequest.size[inputDataFromRequest.id.findIndex(e=>e==="geo")]

  for(let by=0; by<byMax; by++) {
    const xByCode = Object.keys(inputDataFromRequest.dimension[byDim].category.index)[by]
    const xByLabel = Object.values(inputDataFromRequest.dimension[byDim].category.label)[by]
    for(let geo=0; geo<geoMax; geo++) {
      const xGeoCode = Object.keys(inputDataFromRequest.dimension.geo.category.index)[geo]
      const xGeoLabel = Object.values(inputDataFromRequest.dimension.geo.category.label)[geo]
      // TODO: map xGeoLabel and xByLabel to something sensible (for the tooltip)
      output.timeSeries.labels.set( TM.getByLabelShort(byDim, xByCode)+", "+xGeoCode, xGeoLabel+", "+TM.getByLabel(byDim, xByCode,  xByLabel) )
    }
  }
}
