import { FC } from 'react';
import { AgGauge } from 'ag-charts-react';
import { AgLinearGaugeOptions } from 'ag-charts-community';
import { useAppSelector } from '../../../../app/hooks';
import { selectAgChartTheme, selectTheme } from '../../../themes/themeSlice';

import styles from './productDetailGauge.module.scss';
import { FinancialMetricThresholds } from '../../../../models';

interface ProductDetailGaugeProps {
  values: {
    min: number;
    max: number;
    actual: number;
    target?: number;
  };
  thresholds?: FinancialMetricThresholds;
  steps?: number[];
}

export const ProductDetailGauge: FC<ProductDetailGaugeProps> = ({
  values,
  thresholds,
}) => {
  const isDark = useAppSelector(selectTheme);
  const chartTheme = useAppSelector(selectAgChartTheme);

  const performanceStages = ['', 'POOR', 'GOOD', 'VERY GOOD'];

  if (!thresholds) {
    return <h5 style={{ color: 'red' }}>Thresholds are not defined</h5>;
  }
  const getColorForValue = (value: number): string => {
    if (value <= thresholds.low) {
      return thresholds.veryLowColor;
    } else if (value <= thresholds.medium) {
      return thresholds.lowColor;
    } else if (value <= thresholds.high) {
      return thresholds.mediumColor;
    } else {
      return thresholds.highColor;
    }
  };

  const options: AgLinearGaugeOptions = {
    type: 'linear-gauge',
    container: document.getElementById('myChart'),
    direction: 'horizontal',
    value: values.actual,
    scale: {
      min: values.min,
      max: values.max,
      label: {
        placement: 'after',
        color: isDark ? 'white' : 'black',
        formatter: ({ index }) => {
          return `${performanceStages[index]}`;
        },
      },
      interval: {
        values: [
          thresholds.veryLow,
          thresholds.low,
          thresholds.medium,
          thresholds.high,
        ],
      },
    },
    bar: {
      fillMode: 'continuous',
      fills: [
        { color: thresholds.veryLowColor, stop: thresholds.veryLow },
        { color: thresholds.lowColor, stop: thresholds.low },
        { color: thresholds.mediumColor, stop: thresholds.medium },
        { color: thresholds.highColor, stop: thresholds.high },
        { color: 'rgba(2, 189, 46, 0.6)', stop: thresholds.high },
      ],
    },
    targets: values.target
      ? [
          {
            text: values.target.toFixed(2),
            shape: 'triangle',
            strokeWidth: 2,
            value:
              values.target > values.max
                ? values.max
                : values.target < values.min
                  ? values.min
                  : values.target,
            placement: 'before',
            fill: getColorForValue(values.target),
            stroke: getColorForValue(values.target),
            size: 10,
          },
        ]
      : [],
    segmentation: {
      enabled: true,
      interval: {
        values: [
          thresholds.veryLow,
          thresholds.low,
          thresholds.medium,
          thresholds.high,
        ],
      },
      spacing: 2,
    },
    cornerMode: 'container',
    cornerRadius: 99,
    background: {
      visible: false,
      fill: 'transparent',
    },
    padding: {
      top: 0,
      bottom: 0,
    },
    height: 120,
    theme: chartTheme,
  };

  return (
    <div
      id="product-detail-gauge"
      className={styles['product-detail-gauge__container']}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <AgGauge options={options as any} />
    </div>
  );
};
