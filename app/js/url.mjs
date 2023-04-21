const delim = "&"

// attention: this assumes, that at least 1 "by-SelectBox" exists
// and that it contains the Dataset-id for a request.
export function buildFrag(selections) {
  let retVal = []

  let frag=""
  // first do all boxes except the by-selectBox
  for(let [key, value] of selections.boxes.entries()) {
    if(key!=="null") {
      //const valAsString = value.keys().next().value
      for(let [code, _] of value.entries()) {
        frag += key+"="+code+delim
      }
    }
  }

  // now the "by"-selectBox
  let b = selections.boxes.get("null")
  if(b) {
    for(let [_key, _] of b.entries()) {
      const key = JSON.parse(_key.replaceAll("'","\""))
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
}

export function getUrlFrag(obj) {
  let retVal = ""
  for(const [k,v] of Object.entries(obj)) {
    retVal += k+"="+v[0].code+delim
  }
  return retVal
}

// input example:
//  https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/ILC_PEPS06N?c_birth=NAT&time=2021&age=Y20-24&sex=T&geo=EU&freq=A&unit=PC&time=2020
// output would be "2021"
export function getTime(url) { return getValues(url, "time") }

// returns list of ["EU","AT",...]
export function getGeo(url) { return getValues(url, "geo") }

function getValues(url, param) {
  return url.match( new RegExp(param+"=([^&]+)", "g") ).map(e=>e.replace(param+"=",""))
}