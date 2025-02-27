import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useRetrieveFiltersQuery } from '../../services/productRetrievalService';
import { useLoadData } from '../../hooks/useLoadData';
import { selectTheme } from '../themes/themeSlice';
import { ProductExplorerFilters } from './productExplorerFilters';
import { loadingFilters, loadFilters } from './productExplorerSlice';
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

  const { productMapError } = useLoadData();

  useEffect(() => {
    if (isLoadingFilters) {
      dispatch(loadingFilters());
    }

    if (!isLoadingFilters && !filterError && filterList) {
      dispatch(loadFilters(filterList));
    }
  }, [dispatch, filterList, filterError, isLoadingFilters]);

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
