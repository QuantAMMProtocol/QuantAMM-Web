import { useMemo, useState } from 'react';
import { AutoComplete, Button, Spin } from 'antd';
import { CloseSquareFilled } from '@ant-design/icons';
import { GetPoolsSummaryQueryVariables } from '../../../../__generated__/graphql-types';
import { useFetchPoolsSummaryByParams } from '../../../../hooks/useFetchPoolsSummaryByParams';

import styles from './comparableProduct.module.scss';

interface ComparableProductDropdownProps {
  params: GetPoolsSummaryQueryVariables;
  onSelect: (poolId: string) => void;
}

export const ComparableProductDropdown = ({
  params,
  onSelect,
}: ComparableProductDropdownProps) => {
  const { data, loading } = useFetchPoolsSummaryByParams(params);

  const [inputValue, setInputValue] = useState('');
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);

  const options = useMemo(
    () =>
      data?.poolGetPools?.map((pool) => ({
        value: `${pool.chain}:${pool.id}`,
        label: pool.name,
      })) ?? [],
    [data?.poolGetPools]
  );

  const handleSelect = (
    _: string,
    option: { value: string; label: string }
  ) => {
    setInputValue(option.label);
    setSelectedPoolId(option.value);
  };

  const handleChange = (value: string) => {
    setInputValue(value);
  };

  const handleClick = () => {
    if (selectedPoolId) {
      onSelect(selectedPoolId);
    }
  };

  return (
    <div className={styles['comparable-product-selector__dropdown__container']}>
      {loading && <Spin size="large" tip="Loading Pools Summary..."></Spin>}
      {!loading && (
        <>
          <AutoComplete
            placeholder="Select a pool"
            options={options}
            value={inputValue}
            filterOption={(inputValue, option) =>
              option?.label.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            allowClear={{ clearIcon: <CloseSquareFilled /> }}
            onChange={handleChange}
            onSelect={handleSelect}
          />
          <Button type="primary" size="large" onClick={handleClick}>
            Select pool
          </Button>
        </>
      )}
    </div>
  );
};
