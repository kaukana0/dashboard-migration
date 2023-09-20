// note that it's sorted by country name (not it's ISO 3166-1 Alpha-2 code as seen here)
// TODO: make configurable
export function process(inputDataFromRequest, inputDataFromCfg, output) {
  output.byOrder = [
    "NEU_FOR",
    "EU_FOR",
    "NAT",

    "NEU_P_HHAB",   // "Naturalisation rate" indicator
    "EU_P_HHAB",

    "TOTAL"         // "Long-term residence permits" indicator
  ]
}
