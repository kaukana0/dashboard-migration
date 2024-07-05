
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
