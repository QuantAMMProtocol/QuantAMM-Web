import { FC, useMemo, useState } from 'react';
import { Button, List, Typography } from 'antd';
import { Product } from '../../../../models';
import { percentageFormatter } from '../../../../utils/formatters';
import { ProductItemCompositionGraph } from '../../../shared';

import styles from './productItemTokenList.module.scss';

const { Text } = Typography;

interface ProductItemTokenListProps {
  product: Product;
}

export const ProductItemTokenList: FC<ProductItemTokenListProps> = ({
  product,
}) => {
  const [showGraph, setShowGraph] = useState(false);

  const totalWeight = useMemo(() => {
    return product.poolConstituents.reduce(
      (acc, token) => acc + token.weight,
      0
    );
  }, [product]);

  const tokenList = useMemo(() => {
    const safeTotalWeight = totalWeight > 0 ? totalWeight : 1;
    const mappedTokens = product.poolConstituents.map((token) => [
      token.coin,
      token.weight / safeTotalWeight,
    ]);

    const firstColumn = mappedTokens.slice(0, 4);
    const secondColumn = mappedTokens.slice(4);

    return secondColumn.length > 0
      ? [firstColumn, secondColumn]
      : [mappedTokens];
  }, [product, totalWeight]);

  const handleTokenNamesClick = () => {
    setShowGraph(false);
  };

  return (
    <>
      {showGraph && (
        <div className={styles['product-item-graph']}>
          <ProductItemCompositionGraph
            wide={true}
            showTokenNames={true}
            onTokenNamesClick={handleTokenNamesClick}
            data={product.poolConstituents}
          />
        </div>
      )}
      {!showGraph && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <div
            style={{ flex: 1 }}
            className={
              tokenList.length > 1
                ? styles['product-item__card-token-list__double']
                : styles['product-item__card-token-list']
            }
          >
            {tokenList.length > 0 &&
              tokenList.map((column, index) => (
                <List
                  key={index}
                  dataSource={column}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        padding: 0,
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text
                        className={styles['product-item__card-token']}
                        title={String(item[0])}
                      >
                        {String(item[0])}
                      </Text>
                      <Text
                        className={styles['product-item__card-token']}
                        style={{
                          marginLeft: 4,
                          minWidth: 35,
                          textAlign: 'right',
                        }}
                      >
                        {percentageFormatter(Number(item[1]) * 100)}
                      </Text>
                    </List.Item>
                  )}
                />
              ))}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              flexDirection: 'column',
            }}
          >
            <Button size="small" type="link" onClick={() => setShowGraph(true)}>
              <Text style={{ fontSize: 10 }}>Token Composition</Text>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
