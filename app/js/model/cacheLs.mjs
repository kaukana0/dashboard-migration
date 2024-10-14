// LS for "local store"

//import { isReachable } from "../../components/util/util.mjs"

const updateId = "lastUpdate"
let baseURL = ""

export function setBaseUrl(_baseURL) {baseURL=_baseURL}

window.addEventListener('keydown', e => {
  if(e.ctrlKey && e.shiftKey && e.key==="F") {
    localStorage.clear()
    console.log("cacheLS: ctrl+shift+F pressed, cache cleared")
  }
})

export function store(id, data) {
  tryToClear()
  if(!window.localStorage.getItem(id)) {
    const dataString = JSON.stringify(data)
    window.localStorage.setItem(id, dataString)
    window.localStorage.setItem(updateId, Date())
    console.debug( `cacheLS: store id='${id}'.` )
  }
}

export function restore(id) {
  let retVal = window.localStorage.getItem(id)
  if(!retVal) {
    console.debug( `cacheLS: miss id='${id}'.` )
  }
  return retVal
}

// log comments to avoid log spam
function tryToClear() {
  const lastUpdate = window.localStorage.getItem(updateId)
  if(lastUpdate) {
    const last = Date.parse(lastUpdate)

    const oneHour = 1000*60*60
    const oneDay = oneHour*24
    const aMonth = oneDay*31
    const fiveSecs = 5000

    const duration = oneDay

    //console.debug("cacheLs: ", (Date.now()-last)/duration )

    if(Date.now()-last > duration) {
      if(navigator.onLine) {
//        isReachable(baseURL, (is) => {    async messes up the flow
//          if(is) {
              localStorage.clear()
              console.log( `cacheLS: cleared` )
//            } else {
              //console.log( `cacheLS: cached data is obsolete but cache is not cleared because REST endpoint ${baseURL} isn't reachable` )
//            }
//        })
      } else  {
        //console.log( `cacheLS: cached data is obsolete but cache is not cleared because offline` )
      }
    } else {
      // console.log( `cacheLS: cached data is not obsolete, serving data from cache` )
    }
  }
}