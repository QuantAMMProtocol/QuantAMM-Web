import { useEffect } from 'react';
import { Layout, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { GqlChain } from '../../__generated__/graphql-types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useFinancialAnalysis } from '../../hooks/useFinancialAnalysis';
import { useFetchProductData } from '../../hooks/useFetchProductData';
import { ProductDetailContent } from './productDetailContent';
import { ProductDetailSidebar } from './productDetailSidebar';
import { Benchmark } from '../../models';
import { selectTheme } from '../themes/themeSlice';
import { loadProducts } from '../productExplorer/productExplorerSlice';

export const ProductDetail = () => {
  const { chain, id } = useParams();

  const dispatch = useAppDispatch();
  const isDark = useAppSelector(selectTheme);

  const { product, productLoading, productError } = useFetchProductData(
    id!,
    chain as GqlChain
  );

  useFinancialAnalysis({
    product: product!,
    benchmark: Benchmark.HODL,
    loadToSimulator: false,
    shouldRun: product?.timeSeries?.length
      ? product.timeSeries.length > 0
      : false,
  });

  useEffect(() => {
    if (product && !productLoading) {
      dispatch(loadProducts({ [product.id]: product }));
    }
  }, [product, productLoading, dispatch]);

  return (
    <Layout style={{ minHeight: '100vh', padding: 20 }}>
      {productLoading && <Spin />}
      {!productLoading && !productError && !!id && (
        <Layout>
          <ProductDetailSidebar id={id} isDark={isDark} />
          <ProductDetailContent id={id} />
        </Layout>
      )}
    </Layout>
  );
};
