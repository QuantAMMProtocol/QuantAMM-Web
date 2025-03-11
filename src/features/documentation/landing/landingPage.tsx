import { Grid } from 'antd';
import { LandingPageMobile } from './mobile/landingPageMobile';
import LandingPageDesktop from './desktop/landingPageDesktop';

const { useBreakpoint } = Grid;

export function LandingPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;

  return isMobile ? <LandingPageMobile /> : <LandingPageDesktop />;
}

export default LandingPage;
