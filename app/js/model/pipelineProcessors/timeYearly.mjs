export function process(inputDataFromRequest, inputDataFromCfg, output) {
    if( inputDataFromRequest && inputDataFromRequest.dimension && inputDataFromRequest.dimension.time && inputDataFromRequest.dimension.time.category && inputDataFromRequest.dimension.time.category.label ) {
        output.time = Object.keys(inputDataFromRequest.dimension.time.category.label)
    } else {
        console.error("processor timeYearly: invalid input")
    }
}