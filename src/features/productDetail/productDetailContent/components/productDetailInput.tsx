import { ChangeEvent } from 'react';
import { Input } from 'antd';

import styles from './productDetailNumericalInput.module.scss';

interface ProductDetailInputProps {
  label?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const ProductDetailInput = ({
  label,
  value,
  onChange,
  placeholder,
}: ProductDetailInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={styles['product-detail-numerical-input_container']}>
      {label && (
        <div className={styles['product-detail-numerical-input_label']}>
          {label}
        </div>
      )}
      <Input
        value={value}
        onChange={handleChange}
        style={{ width: '100%' }}
        placeholder={placeholder}
      />
    </div>
  );
};
