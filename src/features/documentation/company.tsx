import { Card, Grid, Timeline, Typography } from "antd";
import { VisionOverview } from "./landing/desktop/visionOverview";
import styles from './documentation.module.css';

const { Title } = Typography;

const { useBreakpoint } = Grid;

export default function CompanyPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;

    return (
      isMobile ? <div>
      {/* Company Section */}
      <div className={styles.companySection}>
        <Title level={3}>Our Vision</Title>
        <p>
          At QuantAMM, our vision is to build a passive fund product that
          everyone can understand and access. While ETFs with BTC/ETH are
          coming, we go one step further by bringing generic fund construction
          infrastructure on-chain.
        </p>

        <Title level={3} className={styles.companySectionTitle}>
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
            className={styles.companyFounderCard}
          >
            <img
              src={founder.image}
              alt={founder.name}
              className={styles.companyFounderImage}
            />
            <p>
              <strong>{founder.role}</strong>
            </p>
            <p>{founder.description}</p>
          </Card>
        ))}

        {/* Updated Company Images */}
        <div
          className={styles.companyPartnersWrap}
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
              className={styles.companyPartnerImage}
            />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className={styles.companySection}>
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
            May 2025 - QuantAMM Launches BTF
          </Timeline.Item>
        </Timeline>
      </div></div> : <VisionOverview backgroundColor="#162536"/>
    );
    }
