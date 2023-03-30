import * as MA from "./metadataAccess.mjs"
import {get as getKey} from "./key.mjs"

// cumulative
export function process(inputData, output) {
  if(!output.seriesLabels) {
    output.seriesLabels = new Map()
  }

  const [byDim, byIdx] = MA.getIndexOfByDimension(inputData.id)
  const byMax = inputData.size[byIdx]  // "by" c_birth or citizen
  const geoMax = inputData.size[MA.getIndexOfDimension(inputData.id, "geo")]

  for(let by=0; by<byMax; by++) {
    const xByCode = Object.keys(inputData.dimension[byDim].category.index)[by]
    const xByLabel = Object.values(inputData.dimension[byDim].category.label)[by]
    for(let geo=0; geo<geoMax; geo++) {
      const xGeoCode = Object.keys(inputData.dimension.geo.category.index)[geo]
      const xGeoLabel = Object.values(inputData.dimension.geo.category.label)[geo]
      output.seriesLabels.set(getKey(xByCode,xGeoCode), xGeoLabel+", "+xByLabel)
    }
  }
}