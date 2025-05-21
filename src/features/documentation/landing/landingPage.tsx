import { Grid } from 'antd';

import TermsOfServiceGateModal from './termsOfServiceModal';
import { LandingPageMobile } from './mobile/landingPageMobile';
import LandingPageDesktop from './desktop/landingPageDesktop';
import { setAcceptedTermsAndConditions } from '../../productExplorer/productExplorerSlice';
import { useAppDispatch } from '../../../app/hooks';

const { useBreakpoint } = Grid;

export default function LandingPage() {
  const screens   = useBreakpoint();
  const isMobile  = !screens.lg && !screens.xl && !screens.xxl;
  const dispatch = useAppDispatch();
  const handleGateClose = () => dispatch(setAcceptedTermsAndConditions(true));

  return (
    <>
      <TermsOfServiceGateModal
        tosUrl="https://quantamm.fi/tos"
        onClose={handleGateClose}
        isMobile={isMobile}
      />

      {isMobile ? <LandingPageMobile /> : <LandingPageDesktop />}
    </>
  );
}

