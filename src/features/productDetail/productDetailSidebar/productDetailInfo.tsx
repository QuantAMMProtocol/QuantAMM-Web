import { CSSProperties, FC, useMemo } from 'react';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Collapse, CollapseProps, Typography } from 'antd';
import { Product } from '../../../models';
import { ProductDetailSidebarOverview } from './productDetailSidebarOverview';
import { ProductDetailSidebarPoolInfo } from './productDetailSidebarPoolInfo';
// import { ProductDetailSidebarOverviewGraph } from './productDetailSidebarIOverviewGraph';
import { ProductDetailSidebarCompositionGraph } from './productDetailSidebarICompositionGraph';
import { ProductDetailSidebarSocials } from './productDetailSidebarSocials';

import sharedStyles from '../../../shared.module.scss';

import styles from './productDetailSidebar.module.scss';
import { useAppSelector } from '../../../app/hooks';
import { selectProductDetailSelectedTimeRange } from '../../productExplorer/productExplorerSlice';
import { ProductDetailSidebarStrategySummary } from './productDetailSidebarStrategySummary';
import { ProductDetailSidebarPerformanceGraph } from './productDetailSidebarIPerformanceGraph';

const { Title } = Typography;

interface ProductDetailInfoProps {
  product: Product;
}

export const ProductDetailInfo: FC<ProductDetailInfoProps> = ({ product }) => {
  const panelStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
  };

  const selectedTimeRange = useAppSelector(
    selectProductDetailSelectedTimeRange
  );

  const productPerformance = useMemo(() => {
    if (selectedTimeRange == '7d') {
      return product.oneWeekPerformance?.return;
    }
    if (selectedTimeRange == '1m') {
      return product.oneMonthPerformance?.return;
    }
    if (selectedTimeRange == '3m') {
      return product.threeMonthPerformance?.return;
    }
    if (selectedTimeRange == '1y') {
      return product.oneYearPerformance?.return;
    }
    if (selectedTimeRange == 'max') {
      return product.inceptionPerformance?.return;
    }
    return 0;
  }, [product, selectedTimeRange]);

  const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (
    panelStyle
  ) => [
    {
      key: '6',
      label: '',
      children: (
        <div>
          <Title
            className={styles['product-detail-sidebar__top-title']}
            style={{
              marginTop: 0,
              textAlign: 'left',
              marginRight: 0,
              color: 'var(--secondary-text-color)',
            }}
            level={3}
          >
            {product.name}
          </Title>
          <div
            style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}
          ></div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title style={{ margin: 0, textAlign: 'left' }} level={2}>
              $
              {product.timeSeries?.[
                product.timeSeries.length - 1
              ]?.sharePrice.toFixed(2)}
            </Title>
            <span
              style={{
                marginLeft: 10,
                fontSize: '1rem',
                color: performanceSummaryColour(),
              }}
            >
              {productPerformance && productPerformance < 0 ? (
                <CaretDownOutlined />
              ) : (
                <CaretUpOutlined />
              )}
            </span>
            <span
              style={{
                marginLeft: 5,
                fontSize: '1rem',
                color: performanceSummaryColour(),
              }}
            >
              {productPerformance ? productPerformance.toFixed(2) : 'N/A'}%
            </span>
            <span
              style={{
                marginLeft: 5,
                fontSize: '1rem',
                color: performanceSummaryColour(),
              }}
            >
              ({selectedTimeRange})
            </span>
          </div>
        </div>
      ),
      style: panelStyle,
      showArrow: false,
      styles: {
        header: {
          padding: '0',
        },
      },
    },
    {
      key: '9',
      label: '',
      children: <ProductDetailSidebarPerformanceGraph product={product} />,
      style: panelStyle,
      showArrow: false,
      styles: {
        header: {
          padding: '0',
        },
      },
    },

    {
      key: '1',
      label: '',
      children: <ProductDetailSidebarOverview product={product} />,
      style: panelStyle,
      showArrow: false,
      styles: {
        header: {
          padding: '0',
        },
      },
    },
    {
      key: '2',
      label: 'Pool Info',
      children: <ProductDetailSidebarPoolInfo product={product} />,
      style: panelStyle,
      styles: {
        header: {
          padding: '0',
        },
      },
    },
    {
      key: '5',
      label: 'About Pool Type',
      children: <ProductDetailSidebarStrategySummary product={product} />,
      style: panelStyle,
      showArrow: false,
      styles: {
        header: {
          padding: '0',
        },
      },
    },
    {
      key: '4',
      label: 'Pool Composition',
      children: <ProductDetailSidebarCompositionGraph product={product} />,
      style: panelStyle,
      styles: {
        header: {
          padding: '0',
        },
      },
    },
    {
      key: '7',
      label: 'Socials',
      children: <ProductDetailSidebarSocials />,
      style: panelStyle,
    },
  ];

  function performanceSummaryColour(): string {
    if (productPerformance && productPerformance < 0) {
      return 'var(--red)';
    } else if (productPerformance && productPerformance === 0) {
      return 'var(--grey)';
    }
    return 'var(--green)';
  }

  return (
    <div
      className={sharedStyles.scrollable}
      style={{ background: 'transparent' }}
    >
      <Collapse
        items={getItems(panelStyle)}
        defaultActiveKey={['1', '2', '3', '4', '5', '6', '7', '8', '9']}
        bordered={false}
        style={{ background: 'transparent', padding: '0' }}
        size="small"
      ></Collapse>
    </div>
  );
};
