const cache = new Map()

export function store(id, data) {
  if(!cache.has(id)) {
    console.debug( `cache: store id='${id}'.` )
    cache.set(id,JSON.stringify(data))
  }
}

export function restore(id) {
  if(cache.has(id)) {
    console.debug( `cache: hit id='${id}'.` )
  }
  return cache.get(id)
}
