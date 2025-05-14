import { Grid } from 'antd';
import { BaseMacroFactSheetDesktop } from './desktop/baseMacroDesktop';
import { BaseMacroFactSheetMobile } from './mobile/baseMacroMobile';

const { useBreakpoint } = Grid;

export default function BaseMacroFactSheet() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;

  return (
    <>
      {isMobile ? <BaseMacroFactSheetMobile /> : <BaseMacroFactSheetDesktop />}
    </>
  );
}
