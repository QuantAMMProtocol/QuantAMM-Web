import { FC, useMemo } from 'react';
import {
  AgHistogramSeriesOptions,
  AgCategoryAxisOptions,
  AgNumberAxisOptions,
} from 'ag-charts-community';
import { AgCharts } from 'ag-charts-react';
import { useAppSelector } from '../../../app/hooks';
import { selectAgChartTheme } from '../../themes/themeSlice';
import {
  calculateReturnDistribution,
  generateReturnTimestepSeries,
} from '../../simulationResults/simulationReturnCalculator';

interface ReturnDistributionGraphProps {
  marketValues: number[];
  xAxisOverride?: Partial<AgCategoryAxisOptions>;
  yAxisOverride?: Partial<AgNumberAxisOptions>;
}

function getDistributionBarSeries(): AgHistogramSeriesOptions[] {
  const series: AgHistogramSeriesOptions[] = [];

  series.push({
    type: 'histogram',
    xKey: 'percentile',
    yKey: 'count',
    binCount: 100,
    yName: 'count',
    fill: '#e6ce97',
  });

  return series;
}

export const ReturnDistributionGraph: FC<ReturnDistributionGraphProps> = ({
  marketValues = [],
  xAxisOverride,
  yAxisOverride,
}) => {
  const chartTheme = useAppSelector(selectAgChartTheme);

  const data = useMemo(() => {
    return calculateReturnDistribution(
      generateReturnTimestepSeries(marketValues)
    );
  }, [marketValues]);

  return (
    <AgCharts
      options={{
        height: 230,
        padding: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
        },
        data,
        series: getDistributionBarSeries(),
        axes: [
          {
            type: 'number',
            position: 'left',
            title: {
              text: 'Daily Return Count',
            },
            ...yAxisOverride,
          },
          {
            type: 'number',
            position: 'bottom',
            title: {
              text: 'Daily Return (%)',
            },
            ...xAxisOverride,
          },
        ],
        legend: {
          enabled: false,
        },
        overlays: {
          noData: {
            text: 'No data to display',
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
            line: {
              series: {
                stroke: '#DAAB43',
                cursor: 'crosshair',
                marker: {
                  fill: '#DAAB43',
                  enabled: false,
                },
              },
            },
            histogram: {
              axes: {
                number: {
                  gridLine: {
                    enabled: false,
                  },
                },
              },
            },
          },
        },
      }}
    />
  );
};
