import { FC, useMemo } from 'react';
import { AgCharts } from 'ag-charts-react';
import {
  AgAxisLabelFormatterParams,
  AgAreaSeriesOptions,
  AgChartLegendOptions,
  AgNumberAxisOptions,
  AgTimeAxisOptions,
  time,
  AgChartThemeName,
} from 'ag-charts-community';
import 'ag-charts-enterprise';
import { useAppSelector } from '../../../app/hooks';
import { selectAgChartTheme } from '../../themes/themeSlice';
import { SimulationRunBreakdown } from '../../simulationResults/simulationResultSummaryModels';
import { FlatWeightTimeStep } from '../../simulationResults/visualisations/simulationResultWeightChart';
import { getChartTimeSteps } from './helpers';

interface WeightChangeOverTimeGraphProps {
  simulationRunBreakdown?: SimulationRunBreakdown;
  yAxisOverride?: Partial<AgNumberAxisOptions>;
  legendOverride?: Partial<AgChartLegendOptions>;
  tickIntervalInMonths?: number;
  area?: boolean;
  overrideChartTheme?: AgChartThemeName;
  overrideXAxisInterval?: number;
}

const normalisedTokenName = (token: string) => token.replace(/\./g, '-');

export const WeightChangeOverTimeGraph: FC<WeightChangeOverTimeGraphProps> = ({
  simulationRunBreakdown,
  yAxisOverride,
  legendOverride,
  tickIntervalInMonths = 6,
  overrideChartTheme,
  overrideXAxisInterval,
}) => {
  const chartTheme = useAppSelector(selectAgChartTheme);

  const normalisedAreaData = useMemo(() => {
    const result: FlatWeightTimeStep[] = [];
    if (!simulationRunBreakdown) {
      return result;
    }
    let data = getChartTimeSteps(simulationRunBreakdown);

    if (data.length > 200) {
      //stacked chart is more cpu intensive, ~500 points is a good balance
      const proportion = Math.ceil(data.length / 200);
      data = data.filter((_, index) => index % proportion === 0);
    }

    data.forEach((item) => {
      const timeStep: FlatWeightTimeStep = {
        date: item.date,
        unix: item.unix,
      };

      item.coinsHeld.forEach((coinHeld) => {
        const lowerCode = coinHeld.coin.coinCode.toLowerCase();
        timeStep[normalisedTokenName(lowerCode)] = (coinHeld.weight ?? 0) * 100;
      });

      result.push(timeStep);
    });

    return result;
  }, [simulationRunBreakdown]);

  const normalisedAreaSeries = useMemo((): AgAreaSeriesOptions[] => {
    if (!simulationRunBreakdown) {
      return [];
    }
    const { simulationRun } = simulationRunBreakdown;
    if (simulationRun?.poolConstituents?.length === 0) {
      return [];
    }

    const series: AgAreaSeriesOptions[] = [];
    simulationRun.poolConstituents.forEach((constituent) => {
      series.push({
        type: 'area',
        xKey: 'unix',
        yKey: normalisedTokenName(constituent.coin.coinCode.toLowerCase()),
        yName: constituent.coin.coinCode,
        normalizedTo: 100,
        stacked: true,
      });
    });

    return series;
  }, [simulationRunBreakdown]);

  const timeAxisOption: AgTimeAxisOptions = useMemo(() => {
    return {
      type: 'time',
      interval: {
        step: time.month.every(overrideXAxisInterval ?? tickIntervalInMonths),
      },
      label: {
        format: '%Y-%m',
      },
    };
  }, [tickIntervalInMonths, overrideXAxisInterval]);

  return (
    <AgCharts
      options={{
        height: 230,
        padding: {
          right: 40,
          top: 20,
          bottom: 20,
          left: 0,
        },
        data: normalisedAreaData,
        axes: [
          { ...timeAxisOption },
          {
            type: 'number',
            position: 'left',
            label: {
              formatter: (params: AgAxisLabelFormatterParams) => {
                return params.value.toFixed(2) + '%';
              },
            },
            ...yAxisOverride,
          },
        ],
        series: normalisedAreaSeries,
        legend: {
          ...legendOverride,
        },
        overlays: {
          noData: {
            text: 'No data',
          },
        },
        theme: {
          baseTheme: overrideChartTheme ? overrideChartTheme : chartTheme,
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
