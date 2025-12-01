import { BannerMobile } from './bannerMobile';
import { QuantAMMExplainerMobile } from './quantammExplainerMobile';
import { ResearchExplorerMobile } from './researchExplorerMobile';
import { VisionOverviewMobile } from './visionOverviewMobile';
import { TimelineMobile } from './timelineMobile';
import { ContactCompanyMobile } from './contactCompany';
import { StrategySummaryMobile } from './strategySummaryMobile';
import { ProductBannerProps } from '../desktop/bannerProductSection';
import { BtfTypesMobile } from './btfTypesMobile';

export function LandingPageMobile(props: ProductBannerProps) {
  
  return (
    <div style={{ width: '100%', padding: '10px', textAlign: 'center' }}>
      <BannerMobile productData={props.productData} />
      <QuantAMMExplainerMobile />
      <StrategySummaryMobile />
      <BtfTypesMobile />
      <ResearchExplorerMobile />
      <VisionOverviewMobile />
      <TimelineMobile />
      <ContactCompanyMobile />
    </div>
  );
}

export default LandingPageMobile;
