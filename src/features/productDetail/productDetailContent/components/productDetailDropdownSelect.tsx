import { FC, useCallback } from 'react';
import { Select, Typography } from 'antd';

import styles from './productDetailDropdownSelect.module.scss';

const { Text } = Typography;

export interface ProductDetailDropdownSelectOption {
  label: string;
  value: string;
}

interface ProductDetailDropdownSelectProps {
  options: ProductDetailDropdownSelectOption[];
  isLoading?: boolean;
  initialValue?: string;
  label?: string;
  placeholder?: string;
  onSelectedItems?: (selectedItemKeys: string[]) => void;
}

export const ProductDetailDropdownSelect: FC<
  ProductDetailDropdownSelectProps
> = ({
  options,
  isLoading,
  initialValue,
  label,
  placeholder = 'Select data',
  onSelectedItems,
}) => {
  const handleChange = useCallback(
    (selectedKeys: string[] = []) => {
      onSelectedItems && onSelectedItems(selectedKeys);
    },
    [onSelectedItems]
  );

  return (
    <div className={styles['product-detail-dropdown-select_container']}>
      {label && (
        <div className={styles['product-detail-dropdown-select_label']}>
          <Text>{label}</Text>
        </div>
      )}
      <Select
        allowClear
        autoClearSearchValue
        showSearch
        popupMatchSelectWidth
        loading={isLoading}
        disabled={isLoading || options.length === 0}
        className={styles['product-detail-dropdown-select']}
        optionFilterProp="label"
        optionLabelProp="label"
        options={options}
        value={initialValue ? [initialValue] : undefined}
        onChange={handleChange}
        dropdownStyle={{
          width: '300px',
        }}
        placeholder={
          <Text
            className={styles['product-detail-dropdown-select__placeholder']}
          >
            {isLoading ? 'Calculating' : options.length > 0 ? placeholder : 'No Analysis Available'}
          </Text>
        }
      />
    </div>
  );
};
