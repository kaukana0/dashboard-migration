const delim = "&"

// attention: this assumes, that exactly 1 "by-SelectBox" exists
// because it contains the Dataset-id for the whole request.
// it can't handle multiple (or missing) dataset-id information.
// example of retVal:
// https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/PRC_FSC_IDX?format=JSON&lang=en&freq=M&unit=I15&unit=PCH_M12&indx=PPI&indx=HICP&indx=ACPI&indx=IPI&coicop=CP011&coicop=CP0111&coicop=CP01113&coicop=CP0112&coicop=CP01121&coicop=CP01122&coicop=CP01123&coicop=CP01124&coicop=CP0113&coicop=CP0114&coicop=CP01141&coicop=CP01144&coicop=CP01145&coicop=CP01147&coicop=CP0115&coicop=CP01151&coicop=CP01153&coicop=CP01154&coicop=CP0116&coicop=CP0117&coicop=CP01174&coicop=CP01181&coicop=CP0121&coicop=CP01223&coicop=CP02121&coicop=CP0213&geo=EU27_2020&geo=EA19&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&geo=IS&geo=NO&geo=CH&startPeriod=2005-01&endPeriod=2009-12
export function buildFrag(boxes) {
  let retVal = ""
  let dataset = ""

  for(const box of boxes.boxes) {
    for(let [key, value] of box.selected.entries()) {
      if(box.dimension==="null") {      // "by-SelectBox"
        if(dataset!=="" && dataset!==key.dataset) {
          console.error("ui: Too many datasets retrieved from selectBox.")
        }
        dataset = key.dataset
        retVal += key.dimension+"="+key.code+delim
      } else {                          // every other box
          const code = key
          retVal += box.dimension+"="+code+delim
      }
    }
  }

  if(dataset == "") {
    console.error("ui: No dataset retrieved from any of the selectBoxes.")
  }

  return Affix.pre+dataset+"?"+retVal+Affix.post
}

// fragments which are appended/prepended to the assembled URL as a whole
export class Affix {
  static pre=""
  static post=""
  static pre_(str) { this.pre = str }
  static post_(str) { this.post = str }  
}

export function getUrlFrag(obj) {
  let retVal = ""
  for(const [k,v] of Object.entries(obj)) {
    retVal += k+"="+v[0].code+delim
  }
  return retVal
}
