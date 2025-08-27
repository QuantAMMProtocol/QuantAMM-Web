import { Typography } from 'antd';
import { BannerProductSection } from '../desktop/bannerProductSection';
import { ProductBannerProps } from '../desktop/bannerProductSection';

const { Title } = Typography;

export function BannerMobile(props: ProductBannerProps) {
  return (
    <>
    <div
      style={{
        height: '80vh',
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
        <Title level={4} style={{ textAlign: 'center', margin: 0, padding: 0 }}>
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
          DYNAMIC STRATEGY POOLS THAT CAPITALISE ON PRICE VOLATILITY WHILE STILL
          EARNING FEES AND YIELD
        </p>
      </div>
      <div style={{ marginTop: '35vh', height: '90vh', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: '5px 0',
          }}
        >
          <BannerProductSection productData={props.productData} />
        </div>
      </div>
    </div>
    <div style={{height:'85vh', width:'100%', 
        backgroundImage: 'url(./background/hourglass_bottom_extension.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        color: 'white',}}></div>
    </>
  );
}
