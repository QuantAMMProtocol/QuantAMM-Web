import { CSSProperties, FC, useCallback, useState } from 'react';
import { Dropdown, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import styles from './productDetailDropdown.module.scss';

const { Text } = Typography;

interface ProductDetailDropdownItem {
  label: string;
  key: number;
}
interface ProductDetailDropdownProps {
  title?: string;
  items: ProductDetailDropdownItem[];
  disabled?: boolean;
  isLoading?: boolean;
  defaultSelectedKey?: number;
  width?: CSSProperties['width'];
  onChangeItem?: (selectedItemKey: string) => void;
}

export const ProductDetailDropdown: FC<ProductDetailDropdownProps> = ({
  title,
  items,
  disabled,
  isLoading,
  defaultSelectedKey,
  width,
  onChangeItem,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(
    defaultSelectedKey ?? 0
  );

  const handleClick = useCallback(
    (event: { key: string }) => {
      const selectedItem = items.find(
        (option) => String(option.key) === event.key
      );
      if (selectedItem) {
        setSelectedIndex(selectedItem.key);
        onChangeItem && onChangeItem(selectedItem.label);
      }
    },
    [items, onChangeItem]
  );

  return (
    <div className={styles['product-detail-dropdown']} style={{ width }}>
      {title && (
        <h6 className={styles['product-detail-dropdown__text']}>{title}</h6>
      )}
      {items && (
        <Dropdown
          menu={{
            items,
            selectable: true,
            defaultSelectedKeys: [String(selectedIndex)],
            onClick: handleClick,
            disabled: disabled,
          }}
        >
          {isLoading ? (
            <Text
              style={{ color: 'var(--secondary-text-color)' }}
              strong
              className={styles['product-detail-dropdown__loading']}
            >
              Calculating
            </Text>
          ) : (
            <div className={styles['product-detail-dropdown__content']}>
              <Text strong className={styles['product-detail-dropdown__text']}>
                {items[selectedIndex]?.label}
              </Text>
              <DownOutlined
                className={styles['product-detail-dropdown__icon']}
              />
            </div>
          )}
        </Dropdown>
      )}
    </div>
  );
};
