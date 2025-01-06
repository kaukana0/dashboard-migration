// useful during development and configuring
// note: "input" and "output" is meant from the pipeline's POV after it ran all processors
export function process(inputData,c,output) {
  console.debug("input data from REST request:", inputData)
  console.debug("input data from cfg:", c)
  console.debug("pipeline's output data:", output)

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