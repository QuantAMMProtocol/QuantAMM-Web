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
      <Parallax
        pages={22}
        id="parallax_container"
        style={{ height: '95vh', width: '100%', position: 'relative' }}
      >
        <Banner />
        <ParallaxLayer
          sticky={{ start: 1, end: 2 }}
          factor={1}
          style={{ backgroundColor: 'white' }}
        >
          <QuantAmmExplainer />
        </ParallaxLayer>

        <ParallaxLayer
          speed={0.4}
          factor={1}
          sticky={{ start: 3, end: 5 }}
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
          speed={0.1}
          sticky={{ start: 6, end: 8 }}
          style={{ backgroundColor: 'white' }}
        >
          <FAQ /> 
        </ParallaxLayer>
        <ParallaxLayer
          factor={1}
          sticky={{ start: 9, end: 12 }}
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
          factor={1}
          sticky={{ start: 13, end: 16 }}
          style={{
            height: '100%',
          }}
        >
          <VisionOverview />
        </ParallaxLayer>

        <ParallaxLayer
          speed={0.4}
          sticky={{ start: 17, end: 20 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#162536',
            justifyContent: 'flex-start',
          }}
        >
          <div style={{ height: '100%', width: '100%' }}>
            {' '}
            <SimulationRunner />
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          speed={0.4}
          sticky={{ start: 21, end: 22 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#162536',
            justifyContent: 'flex-start',
          }}
        >
          {/* Contact Us */}
          <ContactCompany />
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}

export default LandingPageDesktop;
