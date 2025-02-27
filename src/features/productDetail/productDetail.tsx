import { Layout, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { GqlChain } from '../../__generated__/graphql-types';
import { useAppSelector } from '../../app/hooks';
import { useFinancialAnalysis } from '../../hooks/useFinancialAnalysis';
import { useFetchProductData } from '../../hooks/useFetchProductData';
import { ProductDetailContent } from './productDetailContent';
import { ProductDetailSidebar } from './productDetailSidebar';
import { Benchmark } from '../../models';
import { selectTheme } from '../themes/themeSlice';

export const ProductDetail = () => {
  const { chain, id } = useParams();

  const isDark = useAppSelector(selectTheme);

  const { data: product, loading } = useFetchProductData(
    id!,
    chain as GqlChain
  );

  console.log('product ==>', product, chain, GqlChain.Mainnet, id);

  useFinancialAnalysis({
    product: product!,
    benchmark: Benchmark.HODL,
    loadToSimulator: false,
    shouldRun: product?.timeSeries?.length
      ? product.timeSeries.length > 0
      : false,
  });

  return (
    <Layout style={{ minHeight: '100vh', padding: 20 }}>
      {loading && <Spin />}
      {product && (
        <Layout>
          <ProductDetailSidebar product={product} isDark={isDark} />
          <ProductDetailContent product={product} />
        </Layout>
      )}
    </Layout>
  );
};
