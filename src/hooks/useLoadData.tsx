import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  setLoadingProducts,
  loadProducts,
  selectPageSize,
  selectPage,
  setTotalPools,
} from '../features/productExplorer/productExplorerSlice';
import { useFetchProductListData } from './useFetchProductListData';

export const useLoadData = () => {
  const dispatch = useAppDispatch();

  const pageSize = useAppSelector(selectPageSize);
  const page = useAppSelector(selectPage);

  const { productMap, productMapLoading, productMapError, count } =
    useFetchProductListData(pageSize, page);

  useEffect(() => {
    if (productMapLoading) {
      dispatch(setLoadingProducts());
    }
    if (!productMapLoading && productMap && !productMapError) {
      dispatch(loadProducts(productMap));
    }
  }, [productMap, productMapLoading, productMapError, dispatch]);

  useEffect(() => {
    if (count) {
      dispatch(setTotalPools(count));
    }
  }, [count, dispatch]);

  return {
    productMapError,
  };
};
