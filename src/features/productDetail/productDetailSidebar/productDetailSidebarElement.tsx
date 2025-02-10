import { FC, HTMLAttributeAnchorTarget } from 'react';
import { Tag, Typography } from 'antd';

import styles from './productDetailInfo.module.scss';

const { Link, Text } = Typography;

interface ProductDetailSidebarElementProps {
  side: 'left' | 'right';
  text: string | JSX.Element;
  href?: string;
  insideTag?: boolean;
  target?: HTMLAttributeAnchorTarget;
  icon?: React.ReactNode;
}

export const ProductDetailSidebarElement: FC<
  ProductDetailSidebarElementProps
> = ({ side, text, href, insideTag = true, target = '_self', icon }) => {
  const className = `product-detail-info__item-${side}`;

  return (
    <div
      className={`${styles[className]} ${styles['product-detail-info__item']}`}
    >
      {href ? (
        <Link
          href={href}
          target={target}
          className={styles['product-detail-info__link']}
        >
          {insideTag ? (
            <Tag className={styles['product-detail-info__tag']}>{text}</Tag>
          ) : (
            text
          )}
          {icon && (
            <span className={styles['product-detail-info__item-icon']}>
              {icon}
            </span>
          )}
        </Link>
      ) : (
        <Text className={styles['product-detail-info__text']}>
          {insideTag ? (
            <Tag className={styles['product-detail-info__tag']}>{text}</Tag>
          ) : (
            text
          )}
          {icon && (
            <span className={styles['product-detail-info__item-icon']}>
              {icon}
            </span>
          )}
        </Text>
      )}
    </div>
  );
};
