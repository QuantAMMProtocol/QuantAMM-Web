import { FC, useMemo } from 'react';
import { AgCharts } from 'ag-charts-react';
import { AgRadialSeriesItemStylerParams } from 'ag-charts-enterprise';
import {
  AgPolarAxisOptions,
  AgPolarSeriesOptions,
  AgRadialSeriesStyle,
  AgTooltipRendererResult,
} from 'ag-charts-community';
import { useAppSelector } from '../../../../app/hooks';
import { MonthlyPerformance, PerformancePeriod } from '../../../../models';
import { selectAgChartTheme } from '../../../themes/themeSlice';
import {
  currencyFormatter,
  percentageFormatter,
} from '../../../../utils/formatters';

type PerformanceGraphData = MonthlyPerformance & {
  trendUp: boolean;
  return: number;
  absReturn: number;
};

interface ProductItemPerformanceGraphProps {
  data: PerformancePeriod[];
  wide?: boolean;
}
const mapPerformanceData = (
  data: PerformancePeriod[]
): PerformanceGraphData[] => {
  const periods = [
    'Inception to Date',
    '7D ROI',
    '1M ROI',
    '3M ROI',
    '6M ROI',
    '1Y ROI',
  ];

  return periods
    .map((period) => {
      const index = periods.indexOf(period);

      return {
        month: period,
        value: data[index]?.sharePrice,
        return: data[index]?.return,
        absReturn: Math.abs(data[index]?.return),
        trendUp: data[index]?.return > 0,
      };
    })
    .filter((item) => item !== undefined);
};

const SCALE_FACTOR = 1.3;

export const ProductItemPerformanceAreaGraph: FC<
  ProductItemPerformanceGraphProps
> = ({ data, wide }) => {
  const mappedData = mapPerformanceData(data);

  const chartTheme = useAppSelector(selectAgChartTheme);

  const performanceList = useMemo(
    () => mappedData.map((item) => item.absReturn),
    [mappedData]
  );
  const min = useMemo(() => Math.min(...performanceList, 0), [performanceList]);

  const max = useMemo(
    () => Math.max(...performanceList, 0.01) * SCALE_FACTOR,
    [performanceList]
  );

  const interval = Math.abs(max - min) / 3;

  const series: AgPolarSeriesOptions[] = useMemo(() => {
    return [
      {
        type: 'nightingale',
        angleKey: 'month',
        radiusKey: 'absReturn',
        radiusName: 'Share Price',
        itemStyler: (
          params: AgRadialSeriesItemStylerParams<PerformanceGraphData>
        ): AgRadialSeriesStyle => {
          return {
            fill:
              Number(params.datum.return) > 0
                ? 'rgba(2, 189, 46, 0.7)'
                : 'rgba(166, 0, 0, 0.7)',
            fillOpacity: 0.7,
            stroke:
              params.datum.return > 0
                ? 'rgba(2, 189, 46, 0.9)'
                : 'rgba(166, 0, 0, 0.9)',
            strokeWidth: 1,
          };
        },
        tooltip: {
          renderer: (params): string | AgTooltipRendererResult => {
            return {
              content: currencyFormatter(params.datum.absReturn),
            };
          },
        },
      },
    ];
  }, []);
  const axes: AgPolarAxisOptions[] = useMemo(() => {
    const crossLines = mappedData.map((item) => ({
      enabled: true,
      type: 'line' as const,
      value: item.month,
      label: wide
        ? {
            enabled: false,
          }
        : {
            enabled: item.value !== 0,
            text: percentageFormatter(item.return),
            color: item.trendUp ? 'green' : 'red',
          },
    }));

    return [
      {
        type: 'angle-category',
        label: wide
          ? {
              enabled: false,
            }
          : {
              fontSize: 10,
              padding: 0,
              orientation: 'parallel',
            },
        crossLines,
      },
      {
        type: 'radius-number',
        nice: true,
        min,
        max,
        interval: {
          step: interval,
        },
        tick: {
          width: 0,
        },
        label: {
          enabled: false,
        },
      },
    ];
  }, [mappedData, interval, min, max, wide]);

  return (
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
  );
};
