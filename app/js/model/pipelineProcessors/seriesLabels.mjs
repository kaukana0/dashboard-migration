import * as MA from "./common/metadataAccess.mjs"
import {get as getKey} from "./common/key.mjs"

// cumulative
export function process(inputDataFromRequest, inputDataFromCfg, output) {
  if(!output.seriesLabels) {
    output.seriesLabels = new Map()
  }

  const [byDim, byIdx] = MA.getIndexOfByDimension(inputDataFromRequest.id)
  const byMax = inputDataFromRequest.size[byIdx]  // "by" c_birth or citizen
  const geoMax = inputDataFromRequest.size[MA.getIndexOfDimension(inputDataFromRequest.id, "geo")]

  for(let by=0; by<byMax; by++) {
    const xByCode = Object.keys(inputDataFromRequest.dimension[byDim].category.index)[by]
    const xByLabel = Object.values(inputDataFromRequest.dimension[byDim].category.label)[by]
    for(let geo=0; geo<geoMax; geo++) {
      const xGeoCode = Object.keys(inputDataFromRequest.dimension.geo.category.index)[geo]
      const xGeoLabel = Object.values(inputDataFromRequest.dimension.geo.category.label)[geo]
      output.seriesLabels.set(getKey(xByCode,xGeoCode), xGeoLabel+", "+xByLabel)
    }
  }
}