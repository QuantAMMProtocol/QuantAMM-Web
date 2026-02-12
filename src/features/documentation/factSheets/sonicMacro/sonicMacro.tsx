import { Grid } from 'antd';
import { FactSheetMobile } from '../mobile/factsheetMobile';
import { FactSheetDesktop } from '../desktop/factsheetDesktop';
import { sonicMacroFactsheetData } from './sonicMacroFactsheetData';

const { useBreakpoint } = Grid;

export default function SonicMacroFactSheet() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;

  return (
    <>
      {isMobile ? (
        <FactSheetMobile model={sonicMacroFactsheetData} />
      ) : (
        <FactSheetDesktop model={sonicMacroFactsheetData} />
      )}
    </>
  );
}
