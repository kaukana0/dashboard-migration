
# The big idea on how this dashboard works


- On creation, every UI element of a card gets domain-specific attributes, which are taken from the config (yaml).

- These attributes include (amongst others) "dimension" and "code" for it's items.
  - Note: "dataset" info is being treated in a non-generalized way (see below)

- On selection of any UI element of a card, dimension and code (selected by the user) from all relevant UI elements are collected and stored into a JS-map.

- From that map - and from UI-selection-independent information (coming from yaml) - url.mjs manufactures a URL.

- This URL reflects the user's exact, specific selection.

- Then from this URL, some params are stripped - resulting in more data being requested than what's actually neccessary (i.e. what user selected).
  -  Note: the data for the line chart is a subset of the data for the dot plot

- The raw data received from the back-end is cached - the key being the stripped URL.

- The processors in the pipeline are aware of the full URL to be able to pick out from "too much data" only that subset which reflects what was actually selected by the user.

# Caveats

## dataset information

It is associated w/ the "by" select, because:

- if user selects from the first group, it's the dataset specified under "dataset.citizens"
- if user selects from the second group, it's the dataset specified under "dataset.birth"

drawback of current impl': code like

    if boxName === "Country of citizenship/birth"

i.e. not generalized but specific.

At least, all these occasions can be found via magic strings, which are listed in "js/common/magicStrings.mjs".

## location of domain-specific info

The info coming from config, is attached either to a selectBox (or a range slider) or to a card:

- cards.mjs::create() datasetInfo/etc. -> selectBox attribute
- cards.mjs::create() unit/source link/article link -> card attribute

## by-selector is treated specially

There is no generalization for the "by"-selector.

This means that there is specific implementation for it's selections.

There is a tradeoff when deciding where to put the complexity:

1) either the feature is implemented generally, then the yaml is **slightly more** complex and the implementation is **much more** complex
2) or it's specific, then the yaml stays as **simple** as possible (but isn't flexibe) and the implementation is **more** complex and ugly

The decision made was the latter.

"specific" means, that there are some assumptions which exist quietly without being explicitly understandable by reading the yaml.
It also makes the whole system inflexible in a certain way.
In a very late stage of development (or course, whenever else!) another requirement challenged exactly this inflexibility.
For more discussion about this and a justification of the decision, see also architecture decision record 11, ["Various Breakdowns"](../adr/adr11.md) .


# Notes

## On page open

- main.mjs -> view.mjs::createUIElements()
- view.mjs -> cards.mjs::create()
- cards.mjs creates N chartCards and their respective slot content (boxes defined in yaml config)
- trigger initial loading of all data via onSelectedForAllCards()
- when data arrives: setData1 and setData2 for the two charts for each card

# Logs

No matter if as an introduction or during development, the following logs provide essential information.

- "cfg json from vanilla yaml" - the yaml parsed into a JS object
- "cards: merged cfg for indicator [name of indicator]" - all configs for a specific indicator

the following exist for each indicator

- "inputData" - raw input data (to a pipeline-processor) from the REST service as string
- "data from cfg" - another input parameter to a pipliene-processor. in this application, it's the URL of the REST request
- "output" - what the pipeline-processor outputs - data for billboard.js

Note that during creation of a deployment, evey "log.debug" is being removed.

# Caching strategy

The caching strategy in this context refers to **retention** and **loading behaviour**.

The retention is somewhat configurable while loading behaviour is hardcoded.

## Retention

In the YAML config, "dataRetention" can be set to one of: "inmemory", "localstore" or "none".

The different behaviours are:

- **"localstore"** - data is stored into the browser's local store.
  - Because of the local store, the loaded data is retained, even if the page is being closed or the computer is being powered off.
  - The retention period is **24h** (as per non configurable implementation)
- **"inmemory"** - data is stored in memory.
  - Data is requested once **during a session** and retained unless the page is being closed/reloaded or the computer is being powered off.
- **"none"** - there is a network request for every selection, **always**, even when the same selection was made before.

## General loading behaviour

Data caching is closely related to how data is requested.

- There is one card (aka "tile") for every indicator.
- In general, there is one request for each indicator / card.
- Cards are visible in the overview if an indicator's config "isInOverview" is set to true.
- When opening the page, the data for those cards are requested first.
- After loading, those cards are already displayed, while in the background, data for all other cards are loaded.

When closing an expanded card, what happens w/ regards to network request, depends on the caching strategy:

- none: data for every card (having the default settings) is requested
- inmemory: data for every card (having the default settings) is taken from cache
- localstore: data for every card (having the default settings) is taken from local disk storage

## Per Indicator loading

For each indicator, the following applies:

- More data (than actually selected) can be requested, when taking away parameters from the data-fetch URL
  - Basically decreasing the specificity, making the request "more broad"
- For a request w/ respect to an indicator, "geo" and "time" parameters are actually omitted
- Thus, the requested data **includes all geo and all time available on server**
- If this data is cached (inmemory or localstore), there will not be another network request when users change the selection of country or time. 
- When changing any other selection however, data is requested - again for all countries and for every year.

## Notes

- On error, local store is cleared
- There was an effort to make the caching strategy also dependent on online-status and whether the server is actually reachable.
  - i.e. not clearing local store and indicating to the user the offline-status and possible out-of-date data
  - But this was not implemented.
- There is still room for improvement if neccessary
  - for instance, changing the by-selection - whos default is "By contry of citicenship", so a group of 3 selections - to one of the three selections results in an unneccessary network request.
  - unneccessary, because data is already contained in the group selection
