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
import { loadProducts, setAcceptedTermsAndConditions } from '../productExplorer/productExplorerSlice';
import TermsOfServiceGateModal from '../documentation/landing/termsOfServiceModal';

export const ProductDetail = () => {
  const { chain, id } = useParams();

  const dispatch = useAppDispatch();
  const isDark = useAppSelector(selectTheme);

  const handleGateClose = () => dispatch(setAcceptedTermsAndConditions(true));
  
  const { product, productLoading, productError } = useFetchProductData(
    id!.toLowerCase(),
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
      console.log('Product:', product);
      dispatch(loadProducts({ [product.id]: product }));
    }
  }, [product, productLoading, dispatch]);

  console.log('Product:', product);
  return (
    <>
      <TermsOfServiceGateModal
        tosUrl="https://quantamm.fi/tos"
        onClose={handleGateClose}
      />
    <Layout style={{ minHeight: '100vh', padding: 20 }}>
      {productLoading && <Spin />}
      {!productLoading && !productError && !!id && (
        <Layout>
          <ProductDetailSidebar id={id.toLowerCase()} isDark={isDark} />
          <ProductDetailContent id={id.toLowerCase()} />
        </Layout>
      )}
    </Layout>
    </>
    
  );
};
