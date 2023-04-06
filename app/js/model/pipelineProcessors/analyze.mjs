// useful during development and configuring
export function process(inputData) {
  let txt = ""
  for(let i=0;i<inputData.size.length;i++) {
    if(inputData.size[i]===0) {
      txt += inputData.id[i]+", "
    }
  }
  if(txt) {
    console.log("analyzer: no data for dimension(s): " + txt)
  }
}