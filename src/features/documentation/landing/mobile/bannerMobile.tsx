import { Button, Card, Typography } from "antd";

const { Title } = Typography;

export function BannerMobile(){
    return <div
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
            <Button block style={{ whiteSpace: 'normal', height: '100%' }}>
              Mega Cap 30 day Trend BTF BTC/ETH/SOL/XRP/USDC
            </Button>
          </div>
          <div style={{ height: '8vh', marginBottom: '5px' }}>
            <Button
              block
              style={{
                whiteSpace: 'normal',
                height: '100%',
              }}
            >
              Meme 7 day Trend BTF DOGE/SHIB/PEPE/USDC
            </Button>
          </div>
          <div style={{ height: '8vh' }}>
            <Button block style={{ whiteSpace: 'normal', height: '100%' }}>
              Safe Haven 30 day Trend BTF BTC/PAXG/XAUt/USDC
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
}