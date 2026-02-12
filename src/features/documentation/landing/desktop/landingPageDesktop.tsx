import { createElement } from 'react';
import { Row } from 'antd';
import { Banner } from './banner';
import { QuantAmmExplainer } from './quantammExplainer';
import { StrategySummary } from './strategySummary';
import { ResearchExplorer } from './researchExplorer';
import { VisionOverview } from './visionOverview';
import { ContactCompany } from './contactCompany';
import { FAQ } from './faq';
import { ProductBannerProps } from './bannerProductSection';
import styles from './landingDesktop.module.css';

const items: {
  component: React.ComponentType;
  style?: React.CSSProperties;
  className?: string;
}[] = [
  {
    component: QuantAmmExplainer,
    style: { backgroundColor: '#FFFEF2' },
    className: styles.sectionRowCentered,
  },
  {
    component: StrategySummary,
    style: { backgroundColor: '#FFFEF2' },
    className: styles.sectionRow,
  },
  {
    component: FAQ,
    style: { backgroundColor: 'white' },
    className: styles.sectionRow,
  },
  {
    component: ResearchExplorer,
    style: { backgroundImage: 'url(./background/sand_background.png)' },
    className: styles.sectionRow,
  },
  {
    component: VisionOverview,
    style: { backgroundColor: '#162536' },
    className: styles.sectionRow,
  },
  {
    component: ContactCompany,
    style: { backgroundColor: '#162536', marginTop: '10vh' },
    className: styles.sectionRow,
  },
];

export function LandingPageDesktop(props: ProductBannerProps) {
  return (
    <div className={styles.landingRoot}>
      <Row key={'banner'} style={{ backgroundColor: 'white' }}>
        <Banner productData={props.productData} />
      </Row>
      {items.map(({ component, style, className }, index) => (
        <Row key={index} style={style} className={className}>
          {createElement(component)}
        </Row>
      ))}
    </div>
  );
}

export default LandingPageDesktop;
