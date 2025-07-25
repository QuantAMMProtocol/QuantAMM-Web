import { Grid } from 'antd';

import { FactSheetDesktop } from '../desktop/factsheetDesktop';
import { safeHavenFactsheetData } from './safeHavenfactsheetData';
import { FactSheetMobile } from '../mobile/factsheetMobile';

const { useBreakpoint } = Grid;

export default function SafeHavenFactSheet() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;

  return (
    <>
      {isMobile ? <FactSheetMobile model={safeHavenFactsheetData} /> : <FactSheetDesktop model={safeHavenFactsheetData} />}
    </>
  );
}
