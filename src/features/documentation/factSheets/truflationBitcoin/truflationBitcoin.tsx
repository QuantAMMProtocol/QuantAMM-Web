import { Grid } from 'antd';
import { FactSheetMobile } from '../mobile/factsheetMobile';
import { truflationBitcoinFactsheetData } from './truflationBitcoinFactsheetData';
import { TruflationFactSheetDesktop } from './customTruflationFactsheetDesktop';

const { useBreakpoint } = Grid;

export default function TruflationBitcoinFactSheet() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;

  return (
    <>
      {isMobile ? <FactSheetMobile model={truflationBitcoinFactsheetData} /> : <TruflationFactSheetDesktop model={truflationBitcoinFactsheetData} />}
    </>
  );
}
