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
  setAcceptedTermsAndConditions,
} from './productExplorerSlice';
import { ProductExplorerError } from './productExplorerError';
import { ProductItemGrid } from './productItem';
import TermsOfServiceGateModal from '../documentation/landing/termsOfServiceModal';

export default function ProductExplorer() {
  const dispatch = useAppDispatch();
  const [horizontalView, setHorizontalView] = useState(true);

  const handleGateClose = () => dispatch(setAcceptedTermsAndConditions(true));

  const isDark = useAppSelector(selectTheme);
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
    } else if (!isLoadingFilters && filterError) {
      dispatch(loadFilters([]));
    }
  }, [dispatch, filterList, filterError, isLoadingFilters]);

  useEffect(() => {
    if (productMapLoading) {
      dispatch(setLoadingProducts());
    }
    if (!productMapLoading && productMap && !productMapError) {
      dispatch(loadProducts(productMap));
    }
  }, [productMap, productMapLoading, productMapError, dispatch]);

  useEffect(() => {
    if (productCount !== undefined) {
      dispatch(setTotalPools(productCount));
    }
  }, [productCount, dispatch]);

  return (
    <>
      <TermsOfServiceGateModal
        tosUrl="https://quantamm.fi/tos"
        onClose={handleGateClose}
        page="productExplorer"
      />
      <Layout style={{ minHeight: '100vh', padding: 12 }}>
        {productMapError ? (
          <ProductExplorerError />
        ) : (
          <>
            <ProductExplorerFilters
              horizontalView={horizontalView}
              setHorizontalView={setHorizontalView}
              isDark={isDark}
            />
            <ProductItemGrid wide={horizontalView} />
          </>
        )}
      </Layout>
    </>
  );
}

export { ProductExplorer };
