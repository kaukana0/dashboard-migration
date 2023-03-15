const delim = "&"

// attention: this assumes, that exactly 1 "by-SelectBox" exists
// because it contains the Dataset-id for the whole request.
// it can't handle multiple (or missing) dataset-id information.
export function buildFrag(boxes) {
  let retVal = ""
  let dataSet = ""

  for(const box of boxes.boxes) {
    for(const i in box.selected) {
      if(box.dimension==="null") {      // "by-SelectBox"
          const [code, dim, _dataSet] =  Object.keys(box.selected[i])[0].split("/")
          if(dataSet!=="" && dataSet!==_dataSet) {
            console.error("ui: Too many datasets retrieved from selectBox.")
          }
          dataSet = _dataSet
          retVal += dim+"="+code+delim
      } else {                          // every other box
          const dim = box.dimension
          const code = Object.keys( Object.values(box.selected)[i] )[0]
          retVal += dim+"="+code+delim
      }
    }
  }

  if(dataSet == "") {
    console.error("ui: No dataset retrieved from any of the selectBoxes.")
  }

  return dataSet+"?"+retVal+UrlFrag.retrieve()
}


export class UrlFrag {
  static #urlFrag=""

  static store(cfg) {
    let retVal = ""
    for(const [k,v] of Object.entries(cfg)) {
      retVal += k+"="+v[0].code+delim
      console.log(k,v)
    }
    this.#urlFrag = retVal
    console.log(retVal)
  }
  
  static retrieve() {
    return this.#urlFrag
  }
}
