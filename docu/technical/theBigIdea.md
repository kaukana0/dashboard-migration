
# The big idea on how this dashboard works


- On creation, every UI element of a card gets domain-specific attributes, which are taken from the config (yaml).

- These attributes include (amongst others) "dimension" and "code" for it's items.

- On selection of any UI element of a card, dimension and code (selected by the user) from all relevant UI elements are collected and stored into a JS-map.

- From that map - and from UI-selection-independent information (coming from yaml) - url.mjs manufactures a URL.

- This URL reflects the user's exact, specific selection.

- Then from this URL, some params are stripped - resulting in more data being requested than what's actually neccessary (i.e. what user selected).

- The raw data received from the back-end is cached - the key being the stripped URL.

- The processors in the pipeline are aware of the full URL to be able to pick out from "too much data" only that subset which reflects what was actually selected by the user.


# Notes


## On page open

- main.mjs -> view.mjs::createUIElements()
- view.mjs -> cards.mjs::create()
- cards.mjs creates N chartCards and their respective slot content (boxes defined in yaml config)
- trigger initial loading of all data via onSelectedForAllCards()
- when data arrives: setData1 and setData2 for the two charts for each card

## chart svg

billboard.js' svg element has to be resized "manually" on two occasions:

- when setting data
  - setData() -> onLoaded billboard.js callback -> resize()
- when expanding/contracting
  - expand/contract -> resize() -> onResized billboard.js callback -> event dispatch
