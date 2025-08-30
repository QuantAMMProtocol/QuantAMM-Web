import { useEffect, useMemo } from 'react';
import { Grid, Layout, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { GqlChain } from '../../__generated__/graphql-types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useFetchProductData } from '../../hooks/useFetchProductData';
import { ProductDetailContent } from './productDetailContent';
import { ProductDetailSidebar } from './productDetailSidebar';
import { selectTheme } from '../themes/themeSlice';
import {
  loadProducts,
  selectProductById,
  setAcceptedTermsAndConditions,
} from '../productExplorer/productExplorerSlice';
import TermsOfServiceGateModal from '../documentation/landing/termsOfServiceModal';

const { useBreakpoint } = Grid;

export const ProductDetail = () => {
  const { chain, id } = useParams();

  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;
  const dispatch = useAppDispatch();
  const isDark = useAppSelector(selectTheme);

  const handleGateClose = () => dispatch(setAcceptedTermsAndConditions(true));

  const { product, productLoading, productError } = useFetchProductData(
    id!.toLowerCase(),
    chain as GqlChain
  );

  const productInStore = useAppSelector((s) =>
    product ? selectProductById(s, product.id) : undefined
  );

  const productSig = useMemo(() => {
    if (!product) return '';
    const ts = product.timeSeries ?? [];
    const last = ts[ts.length - 1];
    return [product.id, ts.length, last?.timestamp, last?.sharePrice].join('|');
  }, [
    product?.id,
    product?.timeSeries?.length,
    product?.timeSeries?.[product?.timeSeries?.length - 1]?.timestamp,
    product?.timeSeries?.[product?.timeSeries?.length - 1]?.sharePrice,
  ]);

  const storeSig = useMemo(() => {
    if (!productInStore) return '';
    const ts = productInStore.timeSeries ?? [];
    const last = ts[ts.length - 1];
    return [
      productInStore.id,
      ts.length,
      last?.timestamp,
      last?.sharePrice,
    ].join('|');
  }, [
    productInStore?.id,
    productInStore?.timeSeries?.length,
    productInStore?.timeSeries?.[productInStore?.timeSeries?.length - 1]
      ?.timestamp,
    productInStore?.timeSeries?.[productInStore?.timeSeries?.length - 1]
      ?.sharePrice,
  ]);

  useEffect(() => {
    if (!product || productLoading) return;
    if (productSig !== storeSig) {
      dispatch(loadProducts({ [product.id]: product }));
    }
  }, [dispatch, product, productLoading, productSig, storeSig]);

  return (
    <>
      <TermsOfServiceGateModal
        tosUrl="https://quantamm.fi/tos"
        onClose={handleGateClose}
        isMobile={isMobile}
        page="productDetail"
      />
      <Layout style={{ minHeight: '100vh', padding: 20 }}>
        {productLoading && <Spin />}
        {!productLoading && !productError && !!id && (
          <Layout>
            {isMobile ? (
              <></>
            ) : (
              <ProductDetailSidebar id={id.toLowerCase()} isDark={isDark} />
            )}
            <ProductDetailContent id={id.toLowerCase()} isMobile={isMobile} />
          </Layout>
        )}
      </Layout>
    </>
  );
};
