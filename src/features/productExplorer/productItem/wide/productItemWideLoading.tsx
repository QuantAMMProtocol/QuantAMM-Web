import { Card, Spin } from 'antd';
import { ProductItemBackground } from '../productItemBackground';

import styles from './productItemWide.module.scss';

export const ProductItemWideLoading = () => {
  return (
    <div className={styles['product-item-wide__card-container']}>
      <Card className={styles['product-item__card']} hoverable>
        <ProductItemBackground wide>
          <div className={styles['product-item__card__loading']}>
            <Spin />
          </div>
        </ProductItemBackground>
      </Card>
    </div>
  );
};
