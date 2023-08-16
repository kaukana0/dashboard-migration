// please see adr12.md

import {MS} from "../../common/magicStrings.mjs"

export function replace(str) {
  if(str===MS.CODE_EU_DATA) return MS.CODE_EU
  return str
}

export function replaceRev(str) {
  if(str===MS.CODE_EU) return MS.CODE_EU_DATA
  return str
}