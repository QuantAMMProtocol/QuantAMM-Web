import { Typography } from "antd";

const { Title } = Typography;


export function ContactCompany(){
    return <div
    style={{
      padding: '20px',
      textAlign: 'center',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
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