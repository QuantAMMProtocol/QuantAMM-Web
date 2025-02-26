import { useEffect } from 'react';
import { useAppDispatch } from '../app/hooks';
import {
  setLoadingProducts,
  loadProducts,
} from '../features/productExplorer/productExplorerSlice';
import { useFetchProductListData } from './useFetchProductListData';

export const useLoadData = (poolsToLoad: number) => {
  const dispatch = useAppDispatch();

  const { productMap, productMapLoading, productMapError } =
    useFetchProductListData(poolsToLoad);

  useEffect(() => {
    if (productMapLoading) {
      dispatch(setLoadingProducts());
    }
    if (!productMapLoading && productMap && !productMapError) {
      dispatch(loadProducts(productMap));
    }
  }, [productMap, productMapLoading, productMapError, dispatch]);

  return {
    productMapError,
  };
};
