import { baseMacroFactsheetData } from "./baseMacro/baseMacroFactsheetData";
import { FactsheetModel } from "../landing/desktop/factsheetModel";
import { safeHavenFactsheetData } from "./safeHaven/safeHavenfactsheetData";
import { arbitrumMacroFactsheetData } from "./arbitrumMacro/arbitrumMacroFactsheetData";
import { truflationBitcoinFactsheetData } from "./truflationBitcoin/truflationBitcoinFactsheetData";

interface LiveFactsheets{
    factsheets: FactsheetModel[];
}

export const CURRENT_LIVE_FACTSHEETS: LiveFactsheets = {
    factsheets: [
        arbitrumMacroFactsheetData,
        baseMacroFactsheetData,
        safeHavenFactsheetData,
        truflationBitcoinFactsheetData
    ],
};