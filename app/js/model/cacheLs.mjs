// LS for "local store"

const updateId = "lastUpdate"

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
  if(retVal) {
    console.debug( `cacheLS: hit id='${id}'.` )
  }
  return retVal
}

function tryToClear() {
  const lastUpdate = window.localStorage.getItem(updateId)
  if(lastUpdate) {
    const last = Date.parse(lastUpdate)
    const oneHour = 1000*60*60
    const oneDay = oneHour*24
    const aMonth = oneDay*31 // pretty convenient for development; you don't need network access anymore for a month
    const duration = oneHour
    //console.debug("cacheLs: ", (Date.now()-last)/duration )
    if(Date.now()-last > duration) {
        localStorage.clear()
        console.log( `cacheLS: cleared` )
    }
  }
}