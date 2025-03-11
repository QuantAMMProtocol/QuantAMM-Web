import { Card, Typography } from "antd";

const { Title } = Typography;

export function VisionOverviewMobile(){
    return <div style={{ padding: '20px' }}>
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
          loading="lazy"
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
          loading="lazy"
          key={index}
          src={`/companies/${img}`}
          alt={img}
          style={{ width: '15%', height: 'auto' }}
        />
      ))}
    </div>
  </div>
}