// this is similar in spirit to euCode.mjs
// please see adr12.md, it's written for EUCode but it applies for this as well

import {MS} from "../../common/magicStrings.mjs"

export function replace(str) {
  if(str===MS.CODE_BY_EU_DATA) return MS.CODE_BY_EU
  if(str===MS.CODE_BY_NEU_DATA) return MS.CODE_BY_NEU
  return str
}

export function replaceRev(str) {
  if(str===MS.CODE_BY_EU) return MS.CODE_BY_EU_DATA
  if(str===MS.CODE_BY_NEU) return MS.CODE_BY_NEU_DATA
  return str
}