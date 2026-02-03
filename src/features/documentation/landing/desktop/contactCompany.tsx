import { Typography } from "antd";

const { Title } = Typography;


export default function ContactCompany(){
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
    <p>Email: <a href="mailto:info@quantamm.fi">info@quantamm.fi</a></p>
    <p>Twitter: <a href="https://x.com/QuantAMMDeFi">@QuantAMMDefi</a></p>
  </div>
}

export { ContactCompany };