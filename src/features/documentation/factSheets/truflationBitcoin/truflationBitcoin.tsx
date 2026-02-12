import { Grid } from 'antd';
import { truflationBitcoinFactsheetData } from './truflationBitcoinFactsheetData';
import { TruflationFactSheetDesktop } from './customTruflationFactsheetDesktop';
import { TruflationFactSheetMobile } from './customTruflationFactsheetMobile';

const { useBreakpoint } = Grid;

export default function TruflationBitcoinFactSheet() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;

  return (
    <>
      {isMobile ? (
        <TruflationFactSheetMobile model={truflationBitcoinFactsheetData} />
      ) : (
        <TruflationFactSheetDesktop model={truflationBitcoinFactsheetData} />
      )}
    </>
  );
}
