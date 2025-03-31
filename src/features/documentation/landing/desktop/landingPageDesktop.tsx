import { createElement } from 'react';
import { Row } from 'antd';
import { SimulationRunner } from '../../../simulationRunner/simulationRunner';
import { Banner } from './banner';
import { QuantAmmExplainer } from './quantammExplainer';
import { StrategySummary } from './strategySummary';
import { ResearchExplorer } from './researchExplorer';
import { VisionOverview } from './visionOverview';
import { ContactCompany } from './contactCompany';
import { FAQ } from './faq';

const items: { component: React.ComponentType; style: React.CSSProperties }[] =
  [
    { component: Banner, style: { backgroundColor: 'white' } },
    {
      component: QuantAmmExplainer,
      style: {
        backgroundColor: 'red',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      },
    },
    {
      component: StrategySummary,
      style: {
        backgroundColor: '#FFFEF2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
    },
    { component: FAQ, style: { backgroundColor: 'white', height: '100%' } },
    {
      component: ResearchExplorer,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundImage: 'url(./background/sand_background.png)',
        height: '100%',
      },
    },
    {
      component: VisionOverview,
      style: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#162536',
        justifyContent: 'flex-start',
        height: '100%',
      },
    },
    {
      component: SimulationRunner,
      style: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#162536',
        justifyContent: 'flex-start',
        marginTop: '10vh',
      },
    },
    {
      component: ContactCompany,
      style: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#162536',
        justifyContent: 'flex-start',
        marginTop: '10vh',
      },
    },
  ];

export function LandingPageDesktop() {
  return (
    <div
      style={{
        width: '100%',
        height: 'calc(100vh - 40px)',
        padding: '0',
      }}
    >
      {items.map(({ component, style }, index) => (
        <Row key={index} style={style}>
          {createElement(component)}
        </Row>
      ))}
    </div>
  );
}

export default LandingPageDesktop;
