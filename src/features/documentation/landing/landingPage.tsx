import { Grid } from 'antd';

import TermsOfServiceGateModal from './termsOfServiceModal';
import { LandingPageMobile } from './mobile/landingPageMobile';
import LandingPageDesktop from './desktop/landingPageDesktop';
import { setAcceptedTermsAndConditions } from '../../productExplorer/productExplorerSlice';
import { useAppDispatch } from '../../../app/hooks';
import { CURRENT_LIVE_FACTSHEETS } from '../factSheets/liveFactsheets';
import { ROUTES } from '../../../routesEnum';

//
const { useBreakpoint } = Grid;

export default function LandingPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;
  const dispatch = useAppDispatch();
  const handleGateClose = () => dispatch(setAcceptedTermsAndConditions(true));

  const featuredPoolIds = new Set<string>([
    ROUTES.TRUFLATIONBITCOINFACTSHEET,
    ROUTES.SAFEHAVENFACTSHEET,
  ]);

  const productData = CURRENT_LIVE_FACTSHEETS.factsheets
    .filter((factsheet) => featuredPoolIds.has(factsheet.poolId))
    .map((factsheet) => ({
      title: factsheet.iconTitle,
      imgSrc: factsheet.factsheetImage.image,
      description: factsheet.iconDescription,
      status: factsheet.status,
      opacity: factsheet.iconOpacity,
      imgWidth: '30%',
      focus: factsheet.iconFocus,
      poolId: factsheet.poolId,
      poolChain: factsheet.poolChain,
      inceptionLpPrice: factsheet.inceptionLpPrice,
      factsheetRoute: '/factsheet/' + factsheet.poolId,
      productExplorerRoute:
        ROUTES.PRODUCT_EXPLORER +
        '/' +
        factsheet.poolChain.toUpperCase() +
        '/' +
        factsheet.poolId,
    }));

  //stub
  //productData.push({
  //  title: 'TradFi BTF',
  //  imgSrc: '/assets/tradFi_BTF.png',
  //  description: ['TradFi is coming. Here is a BTF with DeFi companies known to be on the TradFi radar'],
  //  status: 'COMING SOON',
  //  opacity: 1,
  //  imgWidth: '30%',
  //  focus: false,
  //  poolId: 'badId',
  //  poolChain: 'MAINNET',
  //  factsheetRoute: '/factsheet/' + ROUTES.SONICMACROFACTSHEET,
  //  productExplorerRoute:
  //    ROUTES.PRODUCT_EXPLORER + '/MAINNET/' + ROUTES.SONICMACROFACTSHEET,
  //  inceptionLpPrice: sonicMacroFactsheetData.inceptionLpPrice,
  //});

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
