import { baseMacroFactsheetData } from "./baseMacro/baseMacroFactsheetData";
import { FactsheetModel } from "../landing/desktop/factsheetModel";
import { safeHavenFactsheetData } from "./safeHaven/safeHavenfactsheetData";
import { sonicMacroFactsheetData } from "./sonicMacro/sonicMacroFactsheetData";

interface LiveFactsheets{
    factsheets: FactsheetModel[];
}

export const CURRENT_LIVE_FACTSHEETS: LiveFactsheets = {
    factsheets: [
        sonicMacroFactsheetData,
        baseMacroFactsheetData,
        safeHavenFactsheetData,
    ],
};