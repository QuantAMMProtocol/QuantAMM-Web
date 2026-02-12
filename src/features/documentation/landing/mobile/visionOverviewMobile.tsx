import { Typography } from 'antd';
import styles from './landingMobile.module.css';

const { Title } = Typography;

export function VisionOverviewMobile() {
  return (
    <div className={styles.mobileSection}>
      <Title level={3}>Our Vision</Title>
      <p>
        At QuantAMM, our vision is to build a passive fund product that everyone
        can understand and access. While ETFs with BTC/ETH are coming, we go one
        step further by bringing generic fund construction infrastructure
        on-chain.
      </p>

      {/* Updated Company Images */}
      <div className={styles.logoGrid}>
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
            className={styles.logoImage}
          />
        ))}
      </div>
    </div>
  );
}
