import { MailOutlined, MediumOutlined, XOutlined } from '@ant-design/icons';
import { ProductDetailSidebarElement } from './productDetailSidebarElement';

import styles from './productDetailInfo.module.scss';

export const ProductDetailSidebarSocials = () => {
  return (
    <>
      <div className={styles['product-detail-info__container']}>
        <ProductDetailSidebarElement
          side="left"
          href="https://x.com/QuantAMMDeFi"
          insideTag={false}
          text={<>@QuantAMMDeFi</>}
          icon={<XOutlined />}
        />
      </div>

      <div className={styles['product-detail-info__container']}>
        <ProductDetailSidebarElement
          side="left"
          href="https://medium.com/@QuantAMM"
          insideTag={false}
          text={<>@QuantAMM</>}
          icon={<MediumOutlined />}
        />
      </div>

      <div className={styles['product-detail-info__container']}>
        <ProductDetailSidebarElement
          side="left"
          href="mailto:info@quantamm.fi"
          insideTag={false}
          text={<>Help and Support email</>}
          icon={<MailOutlined />}
        />
      </div>
    </>
  );
};
