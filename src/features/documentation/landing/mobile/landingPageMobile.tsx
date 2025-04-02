import { BannerMobile } from './bannerMobile';
import { QuantAMMExplainerMobile } from './quantammExplainerMobile';
import { ResearchExplorerMobile } from './researchExplorerMobile';
import { VisionOverviewMobile } from './visionOverviewMobile';
import { TimelineMobile } from './timelineMobile';
import { ContactCompanyMobile } from './contactCompany';
import { StrategySummaryMobile } from './strategySummaryMobile';

export function LandingPageMobile() {
  
  return (
    <div style={{ width: '100%', padding: '10px', textAlign: 'center' }}>
      <BannerMobile />
      <QuantAMMExplainerMobile />
      <StrategySummaryMobile />
      <ResearchExplorerMobile />
      <VisionOverviewMobile />
      <TimelineMobile />
      <ContactCompanyMobile />
    </div>
  );
}

export default LandingPageMobile;
