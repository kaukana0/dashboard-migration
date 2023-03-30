export function get(a,b) {
  const bla = new Map()
  bla.set("NAT", "Nationals")
  bla.set("EU_FOR", "EU Citizens")
  bla.set("NEU_FOR", "Non EU Citizens")
  return bla.get(a)+", "+b
}