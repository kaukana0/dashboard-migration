export function process(inputData, output) {
    if( inputData && inputData.dimension && inputData.dimension.time && inputData.dimension.time.category && inputData.dimension.time.category.label ) {
        output.time = Object.keys(inputData.dimension.time.category.label)
    } else {
        console.error("processor timeYearly: invalid input")
    }
}