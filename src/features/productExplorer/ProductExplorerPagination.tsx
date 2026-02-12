import { Pagination } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectPage,
  selectPageSize,
  selectTotalPools,
  setPage,
  setPageSize,
} from './productExplorerSlice';

export const ProductExplorerPagination = () => {
  const dispatch = useAppDispatch();
  const page = useAppSelector(selectPage);
  const pageSize = useAppSelector(selectPageSize);
  const totalPools = useAppSelector(selectTotalPools);

  const handleChange = (newPage: number, newPageSize: number) => {
    if (newPageSize !== pageSize) {
      dispatch(setPageSize(newPageSize));
    }

    if (newPage !== page) {
      dispatch(setPage(newPage));
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
      <Pagination
        align="center"
        current={page}
        pageSize={pageSize}
        total={totalPools}
        onChange={handleChange}
      />
    </div>
  );
};
