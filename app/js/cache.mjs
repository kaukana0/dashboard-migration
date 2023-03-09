const cache = new Map()

export function store(data, id) {
  if(!cache.has(id)) {
      console.log( `cache: caching id '${id}'.` )
      cache[id]=data

    }
}

export function restore(id) {
  return cache.get(id)
}
