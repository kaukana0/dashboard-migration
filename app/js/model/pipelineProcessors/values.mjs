import * as MultiDim from "../../../components/multiDimAccess/multiDimAccess.mjs"

/*
adds something like this to output in a cumulative fashion:
[
  [2020,2021,2023],
  [EU,1,2,3],
  [LT,1,2,3]
]
*/
export function process(inputData, output) {
  if(!output.cols) {
    output.cols = [output.time]
  }

  const valence = MultiDim.calcOrdinalValence(inputData.size)

  const byMax = inputData.size[4]  // "by" c_birth or citizen
  const geoMax = inputData.size[5]
  const timeMax = inputData.size[6]

  let byLabel = ""
  let geoLabel = ""
  
  for(let by=0; by<byMax; by++) {
    byLabel = Object.keys(inputData.dimension.c_birth.category.index)[by]
    for(let geo=0; geo<geoMax; geo++) {
      geoLabel = Object.keys(inputData.dimension.geo.category.index)[geo]
      const ll = [byLabel+geoLabel]   // is unique. used by chart as key for tooltip label mapping to text.
      for(let time=0; time<timeMax; time++) {
        const i = MultiDim.getIndex(valence, [0,0,0,0,by,geo,time])
        if(typeof inputData.value[i] === 'undefined') {
          ll.push(null)
        } else {
          ll.push(inputData.value[i])
        }
      }
      output.cols.push(ll)
    }
  }

}