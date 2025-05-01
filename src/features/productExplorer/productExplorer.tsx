import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useRetrieveFiltersQuery } from '../../services/productRetrievalService';
import { useLoadData } from '../../hooks/useLoadData';
import { selectTheme } from '../themes/themeSlice';
import { ProductExplorerFilters } from './productExplorerFilters';
import {
  loadingFilters,
  loadFilters,
  setLoadingProducts,
  loadProducts,
  setTotalPools,
} from './productExplorerSlice';
import { ProductExplorerError } from './productExplorerError';
import { ProductItemGrid } from './productItem';

export const ProductExplorer = () => {
  const [horizontalView, setHorizontalView] = useState(true);

  const isDark = useAppSelector(selectTheme);
  const dispatch = useAppDispatch();
  const {
    data: filterList,
    isLoading: isLoadingFilters,
    error: filterError,
  } = useRetrieveFiltersQuery();

  const { productMapError, productMapLoading, productMap, productCount } =
    useLoadData();

  useEffect(() => {
    if (isLoadingFilters) {
      dispatch(loadingFilters());
    }

    if (!isLoadingFilters && !filterError && filterList) {
      dispatch(loadFilters(filterList));
    }
  }, [dispatch, filterList, filterError, isLoadingFilters]);

  useEffect(() => {
    if (productMapLoading) {
      dispatch(setLoadingProducts());
    }
    if (!productMapLoading && productMap && !productMapError) {
      console.log('Product Map:', productMap);
      dispatch(loadProducts(productMap));
    }
  }, [productMap, productMapLoading, productMapError, dispatch]);

  useEffect(() => {
    if (productCount) {
      dispatch(setTotalPools(productCount));
    }
  }, [productCount, dispatch]);

  return (
    <Layout style={{ minHeight: '100vh', padding: 12 }}>
      {productMapError ? (
        <ProductExplorerError />
      ) : (
        <>
          <ProductExplorerFilters
            setHorizontalView={setHorizontalView}
            isDark={isDark}
          />
          <ProductItemGrid wide={horizontalView} />
        </>
      )}
    </Layout>
  );
};
