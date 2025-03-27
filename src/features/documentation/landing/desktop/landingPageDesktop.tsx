import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { SimulationRunner } from '../../../simulationRunner/simulationRunner';
import { Banner } from './banner';
import { QuantAmmExplainer } from './quantammExplainer';
import { StrategySummary } from './strategySummary';
import { ResearchExplorer } from './researchExplorer';
import { VisionOverview } from './visionOverview';
import { ContactCompany } from './contactCompany';
import { FAQ } from './faq';

export function LandingPageDesktop() {
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <Parallax pages={8} style={{ height: '95vh', width: '100%', position: 'relative' }}>
        <ParallaxLayer
          offset={0}
          factor={1}
          style={{ backgroundColor: 'white' }}
        >
          <Banner />
        </ParallaxLayer>

        <ParallaxLayer
          offset={1}
          factor={1}
          style={{
            backgroundColor: '#FFFEF2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <QuantAmmExplainer />
        </ParallaxLayer>

        <ParallaxLayer
          offset={2}
          factor={1}
          style={{
            backgroundColor: '#FFFEF2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <StrategySummary />
        </ParallaxLayer>

        <ParallaxLayer
          offset={3}
          factor={1}
          style={{ backgroundColor: 'white' }}
        >
          <FAQ />
        </ParallaxLayer>

        <ParallaxLayer
          offset={4}
          factor={1}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundImage: 'url(./background/sand_background.png)',
            height: '100%',
          }}
        >
          <ResearchExplorer />
        </ParallaxLayer>

        <ParallaxLayer
          offset={5}
          factor={1}
          style={{
            height: '100%',
          }}
        >
          <VisionOverview />
        </ParallaxLayer>

        <ParallaxLayer
          offset={6}
          factor={1}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#162536',
            justifyContent: 'flex-start',
          }}
        >
          <div style={{ height: '100%', width: '100%' }}>
            <SimulationRunner />
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={7}
          factor={1}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#162536',
            justifyContent: 'flex-start',
          }}
        >
          <ContactCompany />
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}

export default LandingPageDesktop;
