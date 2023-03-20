const cache = new Map()

export function store(id, data) {
  if(!cache.has(id)) {
      //console.log( `cache: caching id '${id}'.` )
      cache[id]=data
    }
}

export function restore(id) {
  return cache.get(id)
}
