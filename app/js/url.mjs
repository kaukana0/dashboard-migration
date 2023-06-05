const delim = "&"


// via fragGetters you can make exceptions from the default fragment-building.
// it's an object, who's key corresponds to a boxId/dimension and the value is a function.
export function buildFrag(selections, fragGetters) {
  let retVal = []

  let frag=""
  // first do all boxes except the by-selectBox
  for(let [key, value] of selections.selections.entries()) {
    if(key!=="null") {
      //const valAsString = value.keys().next().value
      if(fragGetters[key]) {
        frag += fragGetters[key](value)
      } else {
        for(let [code, _] of value.entries()) {
          frag += key+"="+code+delim
        }
      }
    } else {
      console.warn("url: null key; is there maybe a selectBox w/o dimension attribute? value:", value)
    }
  }
  retVal.push( Affix.pre + frag + Affix.post )  // TODO: the dataset before the "?"

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