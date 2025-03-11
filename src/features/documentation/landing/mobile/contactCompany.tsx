import { Typography } from "antd";

const { Title } = Typography;

export function ContactCompanyMobile(){
    return <div style={{ padding: '20px', textAlign: 'center' }}>
      <img
        loading="lazy"
        src="/assets/colour_ts.png"
        alt="QuantAMM"
        style={{ width: '100px', height: 'auto' }}
      />
      <Title level={3}>Contact Us</Title>
      <p>Email: info@quantamm.fi</p>
      <p>Twitter: @QuantAMMDefi</p>
    </div>
}