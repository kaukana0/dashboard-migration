const cache = new Map()

export function store(id, data) {
  if(!cache.has(id)) {
      console.debug( `cache: caching id '${id}'.` )
      cache.set(id,data)
    }
}

export function restore(id) {
  if(cache.has(id)) {
    console.debug( `cache: retrieving id '${id}'.` )
  }
  return cache.get(id)
}
