/*

for example:

"% | Women | 18 to 64 years"

where:

- % is from dimensions.nonUi.unit.label
- "Woman" is from dimensions.ui.subtitle["Sex"].label
- "Age" comes from a currently selected select box item

It might as well be, that Age is from someConfig.label 
and Woman from a selectBox while retaining the same order.


TODO:
this is probably way more complicated then it needs to be.
reason is: requirements changed during development ¯\_(ツ)_/¯
re-evaluate if it's possible to simplify - and if so, do it.
*/

import {reverseMapOrder} from "../../../../../components/util/util.mjs"

const subtitleDelim = " | "


// filter=take only those
export function get(order, boxes, filter) {
  let retVal = ""
  order.forEach( (v,k) => {    // JS WTF: kv switched
    if(typeof filter === "undefined" || filter.includes(k)) {
      if(v) {
        retVal += subtitleDelim + v
      } else {
        if(boxes) {
          retVal += subtitleDelim + Array.from(boxes.selections.get(k).values())    // 1 el for singleselect, pot. more for multiselect      
        }
      }
    }

  })

  return retVal
}


export function getInfoAboutOrder(dropdownsCfg, subtitleCfg, nonUiCfg, excludedItems) {
  const part = new Map()

  const subtitlesTaken = []

  dropdownsCfg.forEach( (v,k) => {    // JS WTF: kv switched

    if(!excludedItems.includes(k)) {
      if(typeof v["inherit"] !== "undefined" && v["inherit"]===false) {
        if(subtitleCfg.has(k)) {
          part.set(k, subtitleCfg.get(k).label)
          subtitlesTaken.push(k)
        } else {
          // if inherit: false in "dimensions.ui" and not exist in "dimensions.ui.subtitles", look in "dimensions.nonUi"
          if(nonUiCfg[k] && nonUiCfg[k][0])
            part.set(k, nonUiCfg[k][0].label)
          else {
            console.debug("subtitle.mjs: bad config for " + k)
          }
        }
      } else {
        part.set(k, null)
      }
    }

  })

  const retVal = reverseMapOrder(part)

  // what's left is appended
  subtitleCfg.forEach( (v,k) => {
    if(!subtitlesTaken.includes(k)) {
      retVal.set(k,v[0].label)
    }
  })

  return retVal
}
