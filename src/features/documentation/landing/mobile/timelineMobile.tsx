import { Timeline, Typography } from "antd";
import styles from "./landingMobile.module.css";

const { Title } = Typography;

export function TimelineMobile() {
  const items = [
    { children: 'H1 2023 - Simulator Build' },
    {
      children: 'H2 2023 - Protocol Build and ToB in progress audit',
    },
    { children: 'H1 2024 - Balancer V3 Build Conversion' },
    {
      children: 'H2 2024 - Cyfrin/Codehawks audits awaiting V3 launch',
    },
    { color: 'green', children: 'May 2025 - QuantAMM Launches BTF' },
  ];

    return <div className={styles.mobileSection}>
    <Title level={3}>Our Journey</Title>
    <Timeline items={items} />
  </div>
}
