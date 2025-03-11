import { FC, useMemo } from 'react';
import { AgCharts } from 'ag-charts-react';
import { Typography } from 'antd';
import {
  AgPolarSeriesOptions,
  AgTooltipRendererResult,
} from 'ag-charts-community';
import { useAppSelector } from '../../../app/hooks';
import { ProductPoolConstituents } from '../../../models';
import { selectAgChartTheme } from '../../themes/themeSlice';

import styles from './productItemCompositionGraph.module.scss';

const { Text } = Typography;

interface ProductItemCompositionGraphProps {
  data: ProductPoolConstituents[];
  wide?: boolean;
  showTokenNames?: boolean;
  onTokenNamesClick?: () => void;
}

export const ProductItemCompositionGraph: FC<
  ProductItemCompositionGraphProps
> = ({ data, wide, showTokenNames, onTokenNamesClick }) => {
  const chartTheme = useAppSelector(selectAgChartTheme);

  const totalWeight = data.reduce((acc, item) => acc + item.weight, 0);

  const series: AgPolarSeriesOptions[] = useMemo(() => {
    return [
      {
        type: 'donut',
        sectorLabelKey: 'coin',
        sectorLabel: {
          color: 'rgba(255, 255, 255, 0.85)',
          fontSize: wide ? 7 : 10,
          formatter: (params) => (params.value as string).replace(/\./g, ''),
        },
        angleKey: 'weight',
        innerRadiusRatio: wide ? 0 : 0.6,
        tooltip: {
          renderer: (params): string | AgTooltipRendererResult => {
            return {
              content: new Intl.NumberFormat('en-US', {
                style: 'percent',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(params.datum.weight / totalWeight)),
            };
          },
        },
      },
    ];
  }, [wide, totalWeight]);

  return (
    <div className={styles['product-item__graph-overlay']}>
      {showTokenNames && (
        <div className={styles['product-item__graph-overlay__content']}>
          <Text
            strong
            style={{
              fontSize: wide ? 10 : '',
            }}
            onClick={onTokenNamesClick}
          >
            Token list
          </Text>
        </div>
      )}
      <AgCharts
        options={{
          width: wide ? 100 : 288,
          height: wide ? 100 : 240,
          data,
          series,
          legend: {
            enabled: false,
          },
          overlays: {
            noData: {
              text: 'No data',
            },
          },
          animation: {
            enabled: !wide,
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
