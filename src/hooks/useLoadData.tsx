import { useAppSelector } from '../app/hooks';
import {
  selectPageSize,
  selectPage,
} from '../features/productExplorer/productExplorerSlice';
import { useFetchProductListData } from './useFetchProductListData';

export const useLoadData = () => {
  const pageSize = useAppSelector(selectPageSize);
  const page = useAppSelector(selectPage);

  const { productMap, productMapLoading, productMapError, count } =
    useFetchProductListData(pageSize, page);

  return {
    productMap,
    productMapLoading,
    productMapError,
    productCount: count,
  };
};
