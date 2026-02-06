import { Timeline, Typography } from "antd";
import styles from "./landingMobile.module.css";

const { Title } = Typography;

export function TimelineMobile() {
    return <div className={styles.mobileSection}>
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
  </div>
}
