import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Row, Typography } from 'antd';
import { Product } from '../../../../models';
import { ProductModal } from '../../../productDetail/modal/productModal';
import { getBalancerPoolUrl } from '../../../../utils';
import { productExplorerTranslation } from '../../translations';

import styles from './productItem.module.scss';

const { Text } = Typography;

interface ProductItemBottomProps {
  product: Product;
}

export const ProductItemBottom: FC<ProductItemBottomProps> = ({ product }) => {
  const [productModalUrl, setProductModalUrl] = useState<string | undefined>(
    undefined
  );

  const baseBalancerUrl = getBalancerPoolUrl(product.chain, product.id);
  const addLiquidityBalancerPoolUrl = `${baseBalancerUrl}/add-liquidity`;

  const showProductModal = () => {
    setProductModalUrl(addLiquidityBalancerPoolUrl);
  };

  const hideProductModal = () => {
    setProductModalUrl(undefined);
  };

  return (
    <Row className={styles['product-item__card__bottom-container']}>
      <Col span={8}>
        <div className={styles['product-item__card__bottom-chain']}>
          <Text>{productExplorerTranslation[product.chain]}</Text>
        </div>
      </Col>
      <Col offset={4} span={12}>
        <div className={styles['product-item__card__action']}>
          <Button size="small" type="link">
            <Link to={`${String(product.id)}`}>details</Link>
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => showProductModal()}
          >
            deposit
          </Button>
        </div>
      </Col>
      <ProductModal
        isVisible={!!productModalUrl}
        onClose={hideProductModal}
        url={productModalUrl}
      />
    </Row>
  );
};
