import { Layout, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useFinancialAnalysis } from '../../hooks/useFinancialAnalysis';
import { useLoadData } from '../../hooks/useLoadData';
import {
  selectProductById,
  selectProducts,
} from '../productExplorer/productExplorerSlice';
import { ProductDetailContent } from './productDetailContent';
import { ProductDetailSidebar } from './productDetailSidebar';
import { Benchmark } from '../../models';
import { INITIAL_LOAD_POOLS_COUNT } from '../../models/constants';
import { selectTheme } from '../themes/themeSlice';
export const ProductDetail = () => {
  const { id } = useParams();

  const isDark = useAppSelector(selectTheme);

  useLoadData(INITIAL_LOAD_POOLS_COUNT);

  const product = selectProductById(useAppSelector(selectProducts), id!);

  useFinancialAnalysis({
    product: product!,
    benchmark: Benchmark.HODL,
    loadToSimulator: false,
    shouldRun: !!product,
  });

  return (
    <Layout style={{ minHeight: '100vh', padding: 20 }}>
      {!product && <Spin />}
      {product && (
        <Layout>
          <ProductDetailSidebar product={product} isDark={isDark} />
          <ProductDetailContent product={product} />
        </Layout>
      )}
    </Layout>
  );
};
