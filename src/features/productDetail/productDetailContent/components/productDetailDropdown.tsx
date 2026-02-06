import { CSSProperties, FC, useCallback, useEffect, useMemo, useState } from 'react';
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
  const [selectedKey, setSelectedKey] = useState<number>(
    defaultSelectedKey ?? items[0]?.key ?? 0
  );

  const selectedItem = useMemo(
    () => items.find((item) => item.key === selectedKey) ?? items[0],
    [items, selectedKey]
  );

  useEffect(() => {
    if (!items.some((item) => item.key === selectedKey) && items[0]) {
      setSelectedKey(items[0].key);
    }
  }, [items, selectedKey]);

  const handleClick = useCallback(
    (event: { key: string }) => {
      const selectedItem = items.find(
        (option) => String(option.key) === event.key
      );
      if (selectedItem) {
        setSelectedKey(selectedItem.key);
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
            selectable: !disabled,
            selectedKeys: [String(selectedKey)],
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
                {selectedItem?.label}
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
