import { useState } from 'react';
import { Button, Card } from 'antd';
import { GetPoolsSummaryQueryVariables } from '../../../../__generated__/graphql-types';
import { ProductDetailDropdownSelect } from '../components/productDetailDropdownSelect';
import { ProductDetailNumericalInput } from '../components/productDetailNumericalInput';
import { ComparableProductDropdown } from './comparableProductDropdown';
import {
  chains,
  initialParams,
  poolTypes,
} from './comparableProductFormHelper';

import styles from './comparableProduct.module.scss';

interface ComparableProductSelectorProps {
  onSelect: (poolId: string) => void;
}

export const ComparableProductSelector = ({
  onSelect,
}: ComparableProductSelectorProps) => {
  const [params, setParams] =
    useState<GetPoolsSummaryQueryVariables>(initialParams);

  const [initialSearch, setInitialSearch] = useState(false);

  const handleSearchClick = () => {
    setInitialSearch(true);
  };

  const handleChainChange = (selectedItemKeys: string[]) => {
    const selectedChain = chains.find((chain) =>
      selectedItemKeys.includes(chain.value)
    );
    if (selectedChain) {
      setParams((prev) => {
        const updateWhere = { ...prev.where };
        updateWhere.chainIn = [selectedChain.label];

        return {
          ...prev,
          where: updateWhere,
        };
      });
    } else {
      setParams((prev) => {
        const updateWhere = { ...prev.where };
        delete updateWhere.chainIn;

        return {
          ...prev,
          where: updateWhere,
        };
      });
    }
    setInitialSearch(false);
  };

  const handlePoolTypeChange = (selectedItemKeys: string[]) => {
    const selectedPoolType = poolTypes.find((poolType) =>
      selectedItemKeys.includes(poolType.value)
    );
    if (selectedPoolType) {
      setParams((prev) => {
        const updateWhere = { ...prev.where };
        updateWhere.poolTypeIn = [selectedPoolType.label];

        return {
          ...prev,
          where: updateWhere,
        };
      });
    } else {
      setParams((prev) => {
        const updateWhere = { ...prev.where };
        delete updateWhere.poolTypeIn;

        return {
          ...prev,
          where: updateWhere,
        };
      });
    }
    setInitialSearch(false);
  };

  const handleMinTvlChange = (value: number | null) => {
    setParams((prev) => {
      const updateWhere = { ...prev.where };
      updateWhere.minTvl = Number(value) ?? 1000;

      return {
        ...prev,
        where: updateWhere,
      };
    });
    setInitialSearch(false);
  };

  const handleSelect = (poolId: string) => {
    onSelect && onSelect(poolId);
  };

  return (
    <Card className={styles['comparable-product-selector__card']}>
      <div className={styles['comparable-product-selector__card-content']}>
        <ProductDetailDropdownSelect
          label="Chain"
          options={chains}
          placeholder="Any chain"
          onSelectedItems={handleChainChange}
        />

        <ProductDetailDropdownSelect
          label="Pool Type"
          options={poolTypes}
          placeholder="Any pool type"
          onSelectedItems={handlePoolTypeChange}
        />

        <ProductDetailNumericalInput
          label="Min TVL"
          value={params.where?.minTvl ?? 0}
          placeholder="Min TVL"
          onChange={handleMinTvlChange}
          min={1000}
        />

        <Button type="primary" onClick={handleSearchClick}>
          Search
        </Button>
        {initialSearch && (
          <ComparableProductDropdown params={params} onSelect={handleSelect} />
        )}
      </div>
    </Card>
  );
};
