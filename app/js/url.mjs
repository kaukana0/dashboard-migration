const delim = "&"

// attention: this assumes, that exactly 1 "by-SelectBox" exists
// because it contains the Dataset-id for the whole request.
export function buildFrag(boxes) {
  let retVal = []

  let frag=""
  // first do all boxes except the by-selectBox
  for(let [key, value] of boxes.boxes.entries()) {
    if(key!=="null") {
      //const valAsString = value.keys().next().value
      for(let [code, _] of value.entries()) {
        frag += key+"="+code+delim
      }
    }
  }

  // now the "by"-selectBox
  let b = boxes.boxes.get("null")
  if(b) {
    for(let [key, value] of b.entries()) {
      retVal.push( Affix.pre+key.dataset+"?"+key.dimension+"="+key.code+delim+frag+Affix.post )
    }
  } else {
    console.error("url: selectBox for by-country/by-citizen missing, so no dataset could be determined either.")
  }

  return retVal
}

// fragments which are appended/prepended to the assembled URL as a whole
export class Affix {
  static pre=""
  static post=""
  static pre_(str) { this.pre = str }
  static post_(str) { this.post = str }  
}

export function getUrlFrag(obj) {
  let retVal = ""
  for(const [k,v] of Object.entries(obj)) {
    retVal += k+"="+v[0].code+delim
  }
  return retVal
}
