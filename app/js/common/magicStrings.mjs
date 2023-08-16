// any DOM id's in here have to match the html (in case there's a corresponding element there)

export const MS = {
  DS_ID_CITIZEN : "dataset-citizen",
  DS_ID_BIRTH :   "dataset-birth",

  DIM_CITIZEN: "citizen",
  DIM_BIRTH: "c_birth",
  DIM_INDIC: "indic_mg",    // an alternative to citizen, used only by "Active citizenship" cards

  CODE_EU_DATA: "EU27_2020",    // effectively picks the EU code from the data
  CODE_EU: "EU",                // the one EU code used throughout the sourcecode and config

  CODE_BY_EU_DATA: "EU27_2020_FOR",    // similar for citizen/birth
  CODE_BY_EU: "EU_FOR",
  CODE_BY_NEU_DATA: "NEU27_2020_FOR",
  CODE_BY_NEU: "NEU_FOR",

  BY_SELECT_ID: "Country of citizenship/birth",

  GEO_SELECT_ID: "geo",
  GEO_SELECT_DOM_ID: "selectCountry",
  GEO_SELECT_CONTAINER_DOM_ID: "selectCountryContainer",

  CARD_CONTAINER_DOM_ID: "cards",
  CARD_SLOT_ANCHOR_DOM_ID: "anchorSlotContentOf-",   // it's the row of selectboxes in a card
  MAIN_AREA_ANCHOR_DOM_ID: "anchorSelectCountryOutsideOfCard",  // above the card-area
  DEFAULT_SELECTED_ATTR: "defaultSelected",
  CARD_DOM_ID_PREFIX: "ChartCard-",

  TXT_BY_LBL_SHORT_CNAT: "Nationals",
  TXT_BY_LBL_SHORT_CEU: "EU Citizens",
  TXT_BY_LBL_SHORT_CNEU: "Non EU Citizens",
  TXT_BY_LBL_SHORT_BNAT: "Native-born",
  TXT_BY_LBL_SHORT_BEU: "EU Born",
  TXT_BY_LBL_SHORT_BNEU: "Non EU Born",

  TXT_BY_LBL_CNAT: "Nationals",
  TXT_BY_LBL_CEU: "Citizens of another EU country",
  TXT_BY_LBL_CNEU: "Citizens of a non-EU country",
  TXT_BY_LBL_BNAT: "Native-born",
  TXT_BY_LBL_BEU: "Born in another EU country",
  TXT_BY_LBL_BNEU: "Born in a non-EU country",

  TXT_GRP_C: "By country of citizenship",   //must be similar to yaml. TODO: take from there
  TXT_GRP_B: "By country of birth",

  TXT_NOT_AVAILABLE: "N/A",

  TXT_OVERVIEW: "Home"      // ui text changed late in development process, so the word "overview" is found all over the place and it means the same as "Home"

}
