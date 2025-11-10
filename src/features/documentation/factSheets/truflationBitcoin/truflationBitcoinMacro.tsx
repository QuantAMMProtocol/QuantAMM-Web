import { Grid } from 'antd';
import { FactSheetMobile } from '../mobile/factsheetMobile';
import { FactSheetDesktop } from '../desktop/factsheetDesktop';
import { truflationBitcoinFactsheetData } from './truflationBitcoinFactsheetData';

const { useBreakpoint } = Grid;

export default function ArbitrumMacroFactSheet() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;

  return (
    <>
      {isMobile ? <FactSheetMobile model={truflationBitcoinFactsheetData} /> : <FactSheetDesktop model={truflationBitcoinFactsheetData} />}
    </>
  );
}
