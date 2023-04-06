// "by" is "by birth country" or "by citizenship"
export function getIndexOfByDimension(arr) {
  let dim = "c_birth"
  let idx = arr.findIndex(e=>e===dim)
  if(idx===-1) {
    dim = "citizen"
    idx = arr.findIndex(e=>e===dim)
  }
  return [dim, idx]
}
