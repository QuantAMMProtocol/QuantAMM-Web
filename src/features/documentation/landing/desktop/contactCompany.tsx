import { Typography } from "antd";
import styles from "./landingDesktop.module.css";

const { Title } = Typography;


export default function ContactCompany() {
  return (
    <div className={styles.contactRoot}>
      <img
        loading="lazy"
        src="/assets/colour_ts.png"
        alt="QuantAMM"
        className={styles.contactLogo}
      />
      <Title level={3}>Contact Us</Title>
      <p>
        Email: <a href="mailto:info@quantamm.fi">info@quantamm.fi</a>
      </p>
      <p>
        Twitter: <a href="https://x.com/QuantAMMDeFi">@QuantAMMDefi</a>
      </p>
    </div>
  );
}

export { ContactCompany };
