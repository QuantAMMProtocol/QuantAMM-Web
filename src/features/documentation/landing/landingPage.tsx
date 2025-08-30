import { Grid } from 'antd';

import TermsOfServiceGateModal from './termsOfServiceModal';
import { LandingPageMobile } from './mobile/landingPageMobile';
import LandingPageDesktop from './desktop/landingPageDesktop';
import { setAcceptedTermsAndConditions } from '../../productExplorer/productExplorerSlice';
import { useAppDispatch } from '../../../app/hooks';
import { CURRENT_LIVE_FACTSHEETS } from '../factSheets/liveFactsheets';
import { ROUTES } from '../../../routesEnum';
import { sonicMacroFactsheetData } from '../factSheets/sonicMacro/sonicMacroFactsheetData';

//
const { useBreakpoint } = Grid;

export default function LandingPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;
  const dispatch = useAppDispatch();
  const handleGateClose = () => dispatch(setAcceptedTermsAndConditions(true));

  const productData = CURRENT_LIVE_FACTSHEETS.factsheets.map((factsheet) => ({
    title: factsheet.iconTitle,
    imgSrc: factsheet.factsheetImage.image,
    description: factsheet.iconDescription,
    status: factsheet.status,
    opacity: factsheet.iconOpacity,
    imgWidth: '30%',
    focus: factsheet.iconFocus,
    factsheetRoute: '/factsheet/' + factsheet.poolId,
    productExplorerRoute:
      ROUTES.PRODUCT_EXPLORER +
      '/' +
      factsheet.poolChain.toUpperCase() +
      '/' +
      factsheet.poolId,
  }));

  //stub
  productData.push({
    title: 'TradFi',
    imgSrc: sonicMacroFactsheetData.factsheetImage.image,
    description: ['The sonic ecosystem basket', 'Mega Caps with Yield Focus'],
    status: 'LIVE',
    opacity: 1,
    imgWidth: '30%',
    focus: true,
    factsheetRoute: '/factsheet/' + ROUTES.SONICMACROFACTSHEET,
    productExplorerRoute:
      ROUTES.PRODUCT_EXPLORER + '/MAINNET/' + ROUTES.SONICMACROFACTSHEET,
  });

  return (
    <>
      <TermsOfServiceGateModal
        tosUrl="https://quantamm.fi/tos"
        onClose={handleGateClose}
        isMobile={isMobile}
        page="landingPage"
      />

      {isMobile ? (
        <LandingPageMobile productData={productData} />
      ) : (
        <LandingPageDesktop productData={productData} />
      )}
    </>
  );
}
