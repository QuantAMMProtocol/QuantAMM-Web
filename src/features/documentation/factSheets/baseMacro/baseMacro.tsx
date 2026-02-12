import { Grid } from 'antd';
import { FactSheetMobile } from '../mobile/factsheetMobile';
import { FactSheetDesktop } from '../desktop/factsheetDesktop';
import { baseMacroFactsheetData } from './baseMacroFactsheetData';

const { useBreakpoint } = Grid;

export default function BaseMacroFactSheet() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;

  return (
    <>
      {isMobile ? (
        <FactSheetMobile model={baseMacroFactsheetData} />
      ) : (
        <FactSheetDesktop model={baseMacroFactsheetData} />
      )}
    </>
  );
}
