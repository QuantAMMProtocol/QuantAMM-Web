import { useEffect } from 'react';
import { useAppDispatch } from '../app/hooks';
import {
  loadingProducts,
  loadProducts,
} from '../features/productExplorer/productExplorerSlice';
import { useFetchProductListData } from './useFetchProductListData';

export const useLoadData = (poolsToLoad: number) => {
  const dispatch = useAppDispatch();

  const {
    data: productData,
    loading: isLoadingProducts,
    error: productError,
  } = useFetchProductListData(poolsToLoad);

  useEffect(() => {
    if (isLoadingProducts) {
      dispatch(loadingProducts());
    }
    if (!isLoadingProducts && productData && !productError) {
      if (productData.length > 0) {
        dispatch(loadProducts(productData));
      }
    }
  }, [productData, dispatch, productError, isLoadingProducts]);

  return {
    isLoadingProducts,
    productData,
    productError,
  };
};
