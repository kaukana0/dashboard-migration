// useful during development and configuring
export function process(inputData,c,output) {
  console.debug("inputData:", inputData)
  console.debug("data from cfg:", c)
  console.debug("output:", output)

  let txt = ""
  for(let i=0;i<inputData.size.length;i++) {
    if(inputData.size[i]===0) {
      txt += inputData.id[i]+", "
    }
  }
  if(txt) {
    console.warn("analyzer: no data for dimension(s): " + txt)
  }
}