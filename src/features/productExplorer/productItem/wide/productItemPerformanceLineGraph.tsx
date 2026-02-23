import { FC, useMemo } from 'react';
import { AgCharts } from 'ag-charts-react';
import {
  AgCartesianSeriesOptions,
  AgNumberAxisOptions,
  AgTimeAxisOptions,
  AgTooltipRendererResult,
} from 'ag-charts-community';
import { Typography } from 'antd';
import { useAppSelector } from '../../../../app/hooks';
import { CURRENT_PERFORMANCE_PERIOD, Product } from '../../../../models';
import { selectAgChartTheme } from '../../../themes/themeSlice';
import { filterByTimeRange } from '../../../productDetail/productDetailContent/helpers';
import { getCurrentPerformanceComponent } from '../shared/CurrentPerformance';
import { useHasEnteredViewport } from '../../../../hooks/useHasEnteredViewport';

import styles from './productItemPerformanceLineGraph.module.scss';

const { Text } = Typography;

interface ProductItemPerformanceGraphProps {
  product: Product;
  wide?: boolean;
}
const mapPerformanceData = (product: Product) => {
  const timeSeries = product.timeSeries ?? [];
  const findFirstNonZeroPerformance = timeSeries.findIndex(
    (dataPoint) => dataPoint.sharePrice !== 0
  );

  if (findFirstNonZeroPerformance === -1) {
    return [];
  }

  return timeSeries
    ?.slice(findFirstNonZeroPerformance)
    .filter((dataPoint) =>
      filterByTimeRange(dataPoint.timestamp, CURRENT_PERFORMANCE_PERIOD)
    )
    .map((dataPoint) => ({
      date: dataPoint.timestamp * 1000,
      value: dataPoint.sharePrice,
    }));
};

export const ProductItemPerformanceLineGraph: FC<
  ProductItemPerformanceGraphProps
> = ({ product, wide }) => {
  const { containerRef, hasEnteredViewport } =
    useHasEnteredViewport<HTMLDivElement>();
  const mappedData = useMemo(() => mapPerformanceData(product), [product]);

  const chartTheme = useAppSelector(selectAgChartTheme);
  const chartWidth = wide ? 100 : 288;
  const chartHeight = wide ? 100 : 240;

  const series: AgCartesianSeriesOptions[] = useMemo(() => {
    return [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'value',
        yName: '',
        connectMissingData: true,
        marker: {
          enabled: false,
        },
        tooltip: {
          renderer: (params): string | AgTooltipRendererResult => {
            return {
              content: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(params.datum.value)),
            };
          },
        },
      },
    ];
  }, []);

  const axes: (AgNumberAxisOptions | AgTimeAxisOptions)[] = useMemo(() => {
    return [
      {
        type: 'time',
        position: 'bottom',
        label: {
          enabled: false,
        },
        line: {
          enabled: false,
        },
        gridLine: {
          enabled: false,
        },
      },
      {
        type: 'number',
        position: 'left',
        keys: ['value'],
        gridLine: {
          enabled: false,
        },
        label: {
          enabled: false,
        },
      },
    ];
  }, []);

  const chartOptions = useMemo(
    () => ({
      width: chartWidth,
      height: chartHeight,
      data: mappedData,
      series,
      axes,
      legend: {
        enabled: false,
      },
      overlays: {
        noData: {
          text: 'No data',
        },
      },
      animation: {
        enabled: false,
      },
      theme: {
        baseTheme: chartTheme,
        overrides: {
          common: {
            background: {
              fill: 'transparent',
            },
          },
        },
      },
    }),
    [axes, chartHeight, chartTheme, chartWidth, mappedData, series]
  );

  return (
    <div className={styles['product-item__graph-overlay']} ref={containerRef}>
      <div className={styles['product-item__graph-overlay__content']}>
        <Text strong style={{ fontSize: 10 }}>
          {getCurrentPerformanceComponent(product)}
        </Text>
      </div>
      {hasEnteredViewport ? (
        <AgCharts options={chartOptions} />
      ) : (
        <div style={{ width: chartWidth, height: chartHeight }} />
      )}
    </div>
  );
};
