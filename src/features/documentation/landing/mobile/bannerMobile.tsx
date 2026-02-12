import { Typography } from 'antd';
import { BannerProductSection } from '../desktop/bannerProductSection';
import { ProductBannerProps } from '../desktop/bannerProductSection';
import { CurrentPricePollingGate } from '../../../coinData/coinCurrentPricesPolling';
import styles from './landingMobile.module.css';

const { Title } = Typography;

export function BannerMobile(props: ProductBannerProps) {
  return (
    <>
      <CurrentPricePollingGate />
      <div className={styles.bannerRoot}>
        <div>
          <Title level={4} className={styles.bannerTitle}>
            MOVE BEYOND LIQUIDITY PROVIDING
          </Title>
          <p className={styles.bannerSubtitle}>
            DYNAMIC STRATEGY POOLS THAT CAPITALISE ON PRICE VOLATILITY WHILE
            STILL EARNING FEES AND YIELD
          </p>
        </div>
        <div className={styles.bannerContent}>
          <div className={styles.bannerContentInner}>
            <BannerProductSection productData={props.productData} />
          </div>
        </div>
      </div>
      <div className={styles.bannerExtension}></div>
    </>
  );
}
