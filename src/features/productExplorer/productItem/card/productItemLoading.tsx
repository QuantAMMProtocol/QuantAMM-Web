import { Card, Spin } from 'antd';
import { ProductItemBackground } from '../productItemBackground';

import styles from './productItem.module.scss';

export const ProductItemLoading = () => {
  return (
    <div className={styles['product-item__card-container']}>
      <Card className={styles['product-item__card']} hoverable>
        <ProductItemBackground>
          <div className={styles['product-item__card__loading']}>
            <Spin />
          </div>
        </ProductItemBackground>
      </Card>
    </div>
  );
};
