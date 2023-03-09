import * as Cache from "./cache.mjs"

export default function handle() {
	//updateCards( fetchData( getFrags( getMetadataFromUIElements(), cfgObj ) ) )
	console.log("handling")



	const processingCfg = [
		{
				input: ,
				cache: {
					store: (data, id) => Cache.store(data, id),
					restore: () => Cache.restore(id)
				},
				processors: []
		}
	]


	pipeline.run(
		processingCfg,
		(data) => {
	})


}
