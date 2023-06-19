/*
creating an URL and getting infos from an URL
*/

import { DEFINITIONS } from "./view/modules/selects/bySelectConstraints.mjs"
import {MS} from "./view/modules/selects/magicStrings.mjs"

const delim = "&"


// via fragGetters you can make exceptions from the default fragment-building.
// it's an object, who's key corresponds to a boxId/dimension and the value is a function.
export function buildFrag(selections, dataset, fragGetters) {
  let retVal = []

  let frag=""
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
  retVal.push( Affix.pre + dataset + "?" + frag + Affix.post )

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
export function getGeo(url) { return getValues(url, MS.GEO_SELECT_ID) }

function getValues(url, param) {
  const match = url.match( new RegExp(param+"=([^&]+)", "g") )
  if(match) {
    return match.map(e=>e.replace(param+"=",""))
  } else {
    console.error("url: no values for:", param)
    return []
  }
}

export function getBySelectFrag(v) {
  let retVal = ""
  const merged = new Map([...DEFINITIONS.GRP_B, ...DEFINITIONS.GRP_C])
  for(let [key] of v.entries()) {
    retVal += DEFINITIONS.CODE_TO_DIM.get(key)+"="+merged.get(key)+delim
  }
  return retVal
}
