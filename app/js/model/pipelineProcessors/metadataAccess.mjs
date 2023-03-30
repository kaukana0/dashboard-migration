export function getIndexOfDimension(arr, dim) {
  for(let i=0;i<arr.length;i++) {
    if(arr[i]===dim) return i
  }
  return -1
}

// "by" is "by birth country" or "by citizenship"
export function getIndexOfByDimension(arr) {
  let dim = "c_birth"
  let idx = getIndexOfDimension(arr, dim)
  if(idx===-1) {
    dim = "citizen"
    idx = getIndexOfDimension(arr, dim)
  }
  return [dim, idx]
}
