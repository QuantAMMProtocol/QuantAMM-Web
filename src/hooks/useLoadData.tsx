import { useEffect } from 'react';
import { useAppDispatch } from '../app/hooks';
import {
  setLoadingProducts,
  loadProducts,
} from '../features/productExplorer/productExplorerSlice';
import { useFetchProductListData } from './useFetchProductListData';

export const useLoadData = (poolsToLoad: number) => {
  const dispatch = useAppDispatch();

  const { productList, productListLoading, productListError } =
    useFetchProductListData(poolsToLoad);

  useEffect(() => {
    if (productListLoading) {
      dispatch(setLoadingProducts());
    }
    if (!productListLoading && productList && !productListError) {
      if (productList.length > 0) {
        dispatch(loadProducts(productList));
      }
    }
  }, [productList, productListLoading, productListError, dispatch]);

  return {
    productListError,
  };
};
