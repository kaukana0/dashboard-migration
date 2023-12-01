import {MS} from "../../../../common/magicStrings.mjs"


export function getColorSetDefinitions() {
	return {
		EU: { dark:"#082b7a", mid:"#0e47cb ", light:"#388ae2" },
		SET1: { dark:"#734221", mid:"#BD6719", light:"#dfb18b" },
		SET2: { dark:"#005500", mid:"#008800", light:"#00BB00" }
	}
}

/* #geoSelections applicable for line chart:
	>2 = assign color from palette by selection (one color after another), indepenent of country
	2 = the same 2 (3-)sets of colors, the first set for the 1st selected contry, 2nd for the 2nd selected
	1 = assign 1 3-set of colors

	in any case, EU always gets the same 3-set of colors.

	returns object, key=by+country val=color

	TODO: surely this can be written a whole lot nicer, yes!?
*/
export function getColorSet(forLineChart, geoSelections) {
	const retVal = {}

	const c = getColorSetDefinitions()
	const colorsEU = c.EU
	const colorsSet1 = c.SET1
	const colorsSet2 = c.SET2

	if(forLineChart) {

    const geoKey = geoSelections.keys().next().value
		if(geoSelections.size===1) {
			retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_CNAT] = colorsSet1.dark
			retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_CEU] = colorsSet1.mid
			retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_CNEU] = colorsSet1.light

			retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_BNAT] = colorsSet1.dark
			retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_BEU] = colorsSet1.mid
			retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_BNEU] = colorsSet1.light

			retVal[geoKey+", "+MS.NEU_P_HHAB] = colorsSet1.light
			retVal[geoKey+", "+MS.EU_P_HHAB] = colorsSet1.mid

      retVal[geoKey+", "+MS.TOTAL] = colorsSet1.light

    } else {

			if(geoSelections.size===2) {
				retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_CNAT] = colorsSet2.dark
				retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_CEU] = colorsSet2.mid
				retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_CNEU] = colorsSet2.light
				retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_BNAT] = colorsSet2.dark
				retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_BEU] = colorsSet2.mid
				retVal[geoKey+", "+MS.TXT_BY_LBL_SHORT_BNEU] = colorsSet2.light
				
				const geoKey2 = Array.from(geoSelections.keys())[1]
				retVal[geoKey2+", "+MS.TXT_BY_LBL_SHORT_CNAT] = colorsSet1.dark
				retVal[geoKey2+", "+MS.TXT_BY_LBL_SHORT_CEU] = colorsSet1.mid
				retVal[geoKey2+", "+MS.TXT_BY_LBL_SHORT_CNEU] = colorsSet1.light
				retVal[geoKey2+", "+MS.TXT_BY_LBL_SHORT_BNAT] = colorsSet1.dark
				retVal[geoKey2+", "+MS.TXT_BY_LBL_SHORT_BEU] = colorsSet1.mid
				retVal[geoKey2+", "+MS.TXT_BY_LBL_SHORT_BNEU] = colorsSet1.light

        retVal[geoKey+", "+MS.NEU_P_HHAB] = colorsSet1.light
        retVal[geoKey+", "+MS.EU_P_HHAB] = colorsSet1.mid

        retVal[geoKey2+", "+MS.NEU_P_HHAB] = colorsSet2.light
        retVal[geoKey2+", "+MS.EU_P_HHAB] = colorsSet2.mid

        retVal[geoKey+", "+MS.TOTAL] = colorsSet1.light
        retVal[geoKey2+", "+MS.TOTAL] = colorsSet2.light

      } else {
				// no operation; meaning no fixed colors, meaning default dynamic color assignment mechanism (from chart WebCompoment)
			}
		}


		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_SHORT_CNAT] = colorsEU.dark
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_SHORT_CEU] = colorsEU.mid
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_SHORT_CNEU] = colorsEU.light

		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_SHORT_BNAT] = colorsEU.dark
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_SHORT_BEU] = colorsEU.mid
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_SHORT_BNEU] = colorsEU.light

    retVal[MS.CODE_EU+", "+MS.NEU_P_HHAB] = colorsEU.light
    retVal[MS.CODE_EU+", "+MS.EU_P_HHAB] = colorsEU.mid

    retVal[MS.CODE_EU+", "+MS.TOTAL] = colorsEU.light

	} else {		// fixed colors for dot plot
		
		retVal[MS.TXT_BY_LBL_CNAT] = colorsSet1.dark
		retVal[MS.TXT_BY_LBL_CEU] =  colorsSet1.mid
		retVal[MS.TXT_BY_LBL_CNEU] = colorsSet1.light
		
		retVal[MS.TXT_BY_LBL_BNAT] = colorsSet1.dark
		retVal[MS.TXT_BY_LBL_BEU] = colorsSet1.mid
		retVal[MS.TXT_BY_LBL_BNEU] = colorsSet1.light

		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_CNAT] = colorsEU.dark		// see also "firstDifferent" in chart config options
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_CEU] = colorsEU.mid
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_CNEU] = colorsEU.light
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_BNAT] = colorsEU.dark
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_BEU] = colorsEU.mid
		retVal[MS.CODE_EU+", "+MS.TXT_BY_LBL_BNEU] = colorsEU.light

	}
	return retVal
}