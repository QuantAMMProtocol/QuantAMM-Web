import { InputNumber } from 'antd';

import styles from './productDetailNumericalInput.module.scss';

interface ProductDetailNumericalInputProps {
  label?: string;
  value: number | null;
  min: number;
  placeholder?: string;
  onChange: (value: number | null) => void;
}

export const ProductDetailNumericalInput = ({
  label,
  value,
  onChange,
  min,
  placeholder,
}: ProductDetailNumericalInputProps) => {
  return (
    <div className={styles['product-detail-numerical-input_container']}>
      {label && (
        <div className={styles['product-detail-numerical-input_label']}>
          {label}
        </div>
      )}
      <InputNumber
        value={value}
        onChange={onChange}
        min={min}
        style={{ width: '100%' }}
        placeholder={placeholder}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      />
    </div>
  );
};
