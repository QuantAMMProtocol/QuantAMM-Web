import { Grid } from 'antd';

import { SafeHavenFactSheetMobile } from './mobile/safeHavenMobile';
import { SafeHavenFactSheetDesktop } from './desktop/safeHavenDesktop';

const { useBreakpoint } = Grid;

export default function SafeHavenFactSheet() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;

  return (
    <>
      {isMobile ? <SafeHavenFactSheetMobile /> : <SafeHavenFactSheetDesktop />}
    </>
  );
}
