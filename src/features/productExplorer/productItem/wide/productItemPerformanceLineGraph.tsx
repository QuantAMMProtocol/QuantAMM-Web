import { FC, useMemo } from 'react';
import { AgCharts } from 'ag-charts-react';
import {
  AgCartesianSeriesOptions,
  AgNumberAxisOptions,
  AgTimeAxisOptions,
  AgTooltipRendererResult,
} from 'ag-charts-community';
import { Typography } from 'antd';
import { getTime } from 'date-fns';
import { useAppSelector } from '../../../../app/hooks';
import { CURRENT_PERFORMANCE_PERIOD, Product } from '../../../../models';
import { selectAgChartTheme } from '../../../themes/themeSlice';
import { filterByTimeRange } from '../../../productDetail/productDetailContent/helpers';
import { getCurrentPerformanceComponent } from '../shared/CurrentPerformance';

import styles from './productItemPerformanceLineGraph.module.scss';

const { Text } = Typography;

interface ProductItemPerformanceGraphProps {
  product: Product;
  wide?: boolean;
}
const mapPerformanceData = (product: Product) => {
  if (!product.timeSeries) {
    return [];
  }

  const findFirstNonZeroPerformance = product.timeSeries.findIndex(
    (dataPoint) => dataPoint.sharePrice !== 0
  );

  if (findFirstNonZeroPerformance === -1) {
    return [];
  }

  return product.timeSeries
    ?.slice(findFirstNonZeroPerformance)
    .filter((dataPoint) =>
      filterByTimeRange(dataPoint.timestamp, CURRENT_PERFORMANCE_PERIOD)
    )
    .map((dataPoint) => ({
      date: getTime(dataPoint.timestamp) * 1000,
      value: dataPoint.sharePrice,
    }));
};

export const ProductItemPerformanceLineGraph: FC<
  ProductItemPerformanceGraphProps
> = ({ product, wide }) => {
  const mappedData = mapPerformanceData(product);

  const chartTheme = useAppSelector(selectAgChartTheme);

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

  return (
    <div className={styles['product-item__graph-overlay']}>
      <div className={styles['product-item__graph-overlay__content']}>
        <Text strong style={{ fontSize: 10 }}>
          {getCurrentPerformanceComponent(product)}
        </Text>
      </div>
      <AgCharts
        options={{
          width: wide ? 100 : 288,
          height: wide ? 100 : 240,
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
        }}
      />
    </div>
  );
};
