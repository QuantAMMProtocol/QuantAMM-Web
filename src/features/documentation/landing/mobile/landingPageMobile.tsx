import { BannerMobile } from './bannerMobile';
import { QuantAMMExplainerMobile } from './quantammExplainerMobile';
import { ResearchExplorerMobile } from './researchExplorerMobile';
import { VisionOverviewMobile } from './visionOverviewMobile';
import { TimelineMobile } from './timelineMobile';
import { ContactCompanyMobile } from './contactCompany';
import { StrategySummaryMobile } from './strategySummaryMobile';
import { ProductBannerProps } from '../desktop/bannerProductSection';
import styles from './landingMobile.module.css';

export function LandingPageMobile(props: ProductBannerProps) {
  return (
    <div className={styles.landingRoot}>
      <BannerMobile productData={props.productData} />
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
