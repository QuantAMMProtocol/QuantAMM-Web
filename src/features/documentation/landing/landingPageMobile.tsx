import { useEffect, useState } from 'react';
import { Button, Card, Typography, Timeline, Collapse } from 'antd';
import { motion } from 'framer-motion';
import { PieChartOutlined, HourglassOutlined } from '@ant-design/icons';
import { getBreakdown, Pool } from '../../../services/breakdownService';
import { SimulationRunBreakdown } from '../../simulationResults/simulationResultSummaryModels';
import { WeightChangeOverTimeGraph } from '../../shared/graphs/weightChangeOverTime';

const { Title } = Typography;

export function LandingPageMobile() {
  const [breakdowns, setBreakdowns] = useState<SimulationRunBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { Panel } = Collapse;

  useEffect(() => {
    const loadBreakdowns = async (
      poolNames: Pool[]
    ): Promise<SimulationRunBreakdown[]> => {
      setLoading(true);
      const fetchedBreakdowns = await Promise.all(
        poolNames.map((poolName) => getBreakdown(poolName))
      );
      setBreakdowns(fetchedBreakdowns);
      return fetchedBreakdowns;
    };

    if (loading) {
      loadBreakdowns(['balancerWeighted', 'quantAMMAntiMomentum'] as Pool[])
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [loading]);

  return (
    <div style={{ width: '100%', padding: '10px', textAlign: 'center' }}>
      {/* Hero Section */}
      <div
        style={{
          height: '100vh',
          backgroundImage: 'url(./background/Hourglass_Dune_80.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          color: 'white',
          width: '100%',
        }}
      >
        <div>
          <Title
            level={4}
            style={{ textAlign: 'center', margin: 0, padding: 0 }}
          >
            MOVE BEYOND LIQUIDITY PROVIDING
          </Title>
          <p
            style={{
              textAlign: 'center',
              fontSize: '7px',
              marginTop: 0,
              paddingTop: 0,
            }}
          >
            CAPITALIZE ON UNDERLYING PRICE MOVEMENTS WHILE STILL EARNING FEES
            AND YIELD
          </p>
        </div>
        <div style={{ marginTop: '40vh' }}>
          <Card
            style={{
              width: '80%',
              margin: '0 auto',
              justifyContent: 'center',
              alignContent: 'center',
              height: '35vh',
            }}
            title={
              <Title level={5} style={{ fontSize: '10px', margin: '5px' }}>
                Upcoming Blockchain Traded Funds
              </Title>
            }
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                padding: '5px 0',
              }}
            >
              <div style={{ height: '8vh', marginBottom: '5px' }}>
                <Button
                  block
                  style={{ whiteSpace: 'normal', height:'100%' }}
                >
                  Mega Cap 30 day Trend BTF BTC/ETH/SOL/XRP/USDC
                </Button>
              </div>
              <div style={{ height: '8vh' ,
                    marginBottom: '5px',}}>
                <Button
                  block
                  style={{
                    whiteSpace: 'normal', height:'100%'
                  }}
                >
                  Meme 7 day Trend BTF DOGE/SHIB/PEPE/USDC
                </Button>
              </div>
              <div style={{ height: '8vh' }}>
                <Button block style={{ whiteSpace: 'normal', height:'100%' }}>
                  Safe Haven 30 day Trend BTF BTC/PAXG/XAUt/USDC
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Graphs Section */}
      <div>
        <Title level={3}>Traditional DEX Pool Holdings</Title>
        <p>Focus on earning trading swap fees and ignore price movements.</p>
        {!loading && breakdowns.length > 0 && (
          <WeightChangeOverTimeGraph
            simulationRunBreakdown={breakdowns[0]}
            overrideXAxisInterval={12}
          />
        )}

        <Title level={3} style={{ marginTop: '20px' }}>
          QuantAMM BTF Pool Holdings
        </Title>
        <p>
          Rebalance holdings to capitalize on prices WHILE still earning fees.
        </p>
        {!loading && breakdowns.length > 1 && (
          <WeightChangeOverTimeGraph
            simulationRunBreakdown={breakdowns[1]}
            overrideXAxisInterval={12}
          />
        )}

        <div
          style={{
            marginTop: '20px',
            textAlign: 'left',
            padding: '10px',
            borderRadius: '10px',
          }}
        >
          <ul
            style={{ padding: '10px', listStyle: 'none', textAlign: 'center' }}
          >
            <li>
              <strong>✅ Broad baskets and Themes</strong>{' '}
              <p style={{ marginTop: 0 }}>No need to be a blockchain expert</p>
            </li>
            <li>
              <strong>✅ Fire and Forget</strong>
              <p style={{ marginTop: 0 }}>
                Automatic, fully on-chain daily rebalancing
              </p>
            </li>
            <li>
              <strong>✅ Low Fees</strong>
              <p style={{ marginTop: 0 }}>No streaming maintenance fees</p>
            </li>
            <li>
              <strong>✅ Trustless</strong>
              <p style={{ marginTop: 0 }}>
                No off-chain stack, no anonymous manager
              </p>
            </li>
            <li>
              <strong>✅ Simplicity</strong>
              <p style={{ marginTop: 0 }}>
                No moving liquidity, no complex trade routing
              </p>
            </li>
            <li>
              <strong>✅ Known Strategies</strong>
              <p style={{ marginTop: 0 }}>
                Simulate performance and risk before investing
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* Research Section */}
      <div style={{ padding: '20px' }}>
        <Collapse>
          <Panel header="Explore Our Research" key="1">
            {[
              {
                title: 'Temporal Function Market Making Litepaper',
                description:
                  'A detailed explanation of the underlying AMM mechanism that makes QuantAMM possible.',
                link: 'https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/6617c4c2381409947dc42c7a_TFMM_litepaper.pdf',
                icon: <PieChartOutlined />,
              },
              {
                title: 'QuantAMM Protocol Litepaper',
                description:
                  'Blockchain Traded Funds: their construction, strategy tuning, and application.',
                link: 'https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/6617c4c260d10f98e065f1ea_QuantAMM_Litepaper.pdf',
                icon: <HourglassOutlined />,
              },
            ].map((paper, index) => (
              <Card
                key={index}
                title={
                  <>
                    {paper.icon} {paper.title}
                  </>
                }
                style={{ marginBottom: '10px' }}
              >
                <p>{paper.description}</p>
                <Button href={paper.link}>View Full Paper</Button>
              </Card>
            ))}
          </Panel>
        </Collapse>
      </div>

      {/* Company Section */}
      <div style={{ padding: '20px' }}>
        <Title level={3}>Our Vision</Title>
        <p>
          At QuantAMM, our vision is to build a passive fund product that
          everyone can understand and access. While ETFs with BTC/ETH are
          coming, we go one step further by bringing generic fund construction
          infrastructure on-chain.
        </p>

        <Title level={3} style={{ marginTop: '20px' }}>
          Our Team
        </Title>
        {[
          {
            name: 'Matthew Willetts',
            role: 'Founder & CEO',
            description:
              'CS Research Fellow @ UCL, PhD in statistics & machine learning @ Oxford.',
            image: '/companies/matthew-willetts.jpg',
          },
          {
            name: 'Christian Harrington',
            role: 'Founder & CTO',
            description:
              'Central OMS technical architect @ Man Group, BA Natural Sciences @ Cambridge.',
            image: '/companies/christian.jpg',
          },
        ].map((founder, index) => (
          <Card
            key={index}
            title={founder.name}
            style={{ marginBottom: '10px' }}
          >
            <img
              src={founder.image}
              alt={founder.name}
              style={{ width: '100px', borderRadius: '50%' }}
            />
            <p>
              <strong>{founder.role}</strong>
            </p>
            <p>{founder.description}</p>
          </Card>
        ))}

        {/* Updated Company Images */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '20px',
          }}
        >
          {[
            '8vc.png',
            '369.png',
            'BalancerV3.png',
            'chainlink_build.png',
            'Mako.png',
            'longhashx.png',
            'Marshland.png',
            'Codehawks.png',
            'Cyfrin.png',
            'Hypernest.png',
          ].map((img, index) => (
            <img
              key={index}
              src={`/companies/${img}`}
              alt={img}
              style={{ width: '50px', height: 'auto', borderRadius: '10px' }}
            />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ padding: '20px' }}>
        <Title level={3}>Our Journey</Title>
        <Timeline>
          <Timeline.Item>H1 2023 - Simulator Build</Timeline.Item>
          <Timeline.Item>
            H2 2023 - Protocol Build and ToB in progress audit
          </Timeline.Item>
          <Timeline.Item>H1 2024 - Balancer V3 Build Conversion</Timeline.Item>
          <Timeline.Item>
            H2 2024 - Cyfrin/Codehawks audits awaiting V3 launch
          </Timeline.Item>
          <Timeline.Item color="green">
            March/April 2025 - QuantAMM Launches BTF
          </Timeline.Item>
        </Timeline>
      </div>

      {/* Contact Us */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Title level={3}>Contact Us</Title>
        <p>Email: contact@quantamm.com</p>
        <p>Twitter: @QuantAMM</p>
      </div>
    </div>
  );
}

export default LandingPageMobile;
