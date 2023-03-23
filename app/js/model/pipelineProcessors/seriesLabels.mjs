export function process(inputData, output) {
  output.seriesLabels = new Map()

  const byDim = inputData.id[4]   // "c_birth" or "citizen"
  const byMax = inputData.size[4]  // by c_birth or by citizen
  const geoMax = inputData.size[5]

  for(let by=0; by<byMax; by++) {
    const xByCode = Object.keys(inputData.dimension[byDim].category.index)[by]
    const xByLabel = Object.values(inputData.dimension[byDim].category.label)[by]
    for(let geo=0; geo<geoMax; geo++) {
      const xGeoCode = Object.keys(inputData.dimension.geo.category.index)[geo]
      const xGeoLabel = Object.values(inputData.dimension.geo.category.label)[geo]
      output.seriesLabels.set(xByCode+xGeoCode, xGeoLabel+", "+xByLabel)
    }
  }
}