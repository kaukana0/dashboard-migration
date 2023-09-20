/*
in:
[
    {
        "label": "15 to 74 years",
        "code": "Y15-74"
    },
]

out:
{"15 to 74 years" => "Y15-74", ...}

*/
export function getMapFromArray(arr) {
  const retVal = new Map()
  if(Array.isArray(arr)) {      // JS WTF: typeof [] is "object" 
    for(const e of arr) {
      retVal.set(e.code, e.label)
    }
  }
  return retVal
}


/*
in:
[
  {
    "Age": {
      "items": [
          {
              "label": "15 to 74 years",
              "code": "Y15-74"
          },
      ]
    }
  },
]

out:
map w/ {Age:{items....}}

*/
export function getMapFromArrayWObjects(arr) {
  const retVal = new Map()
  if(Array.isArray(arr)) {
    for(const e of arr) {
      const [[k,v]] = Object.entries(e)
      retVal.set(k,v)
    }
  }
  return retVal
}
