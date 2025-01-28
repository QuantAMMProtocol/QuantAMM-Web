import { FC, useMemo } from 'react';
import { AgCharts } from 'ag-charts-react';
import {
  AgAxisLabelFormatterParams,
  AgAreaSeriesOptions,
  AgChartLegendOptions,
  AgNumberAxisOptions,
  AgTimeAxisOptions,
  time,
} from 'ag-charts-community';
import 'ag-charts-enterprise';
import { useAppSelector } from '../../../app/hooks';
import { selectAgChartTheme } from '../../themes/themeSlice';
import { SimulationRunBreakdown } from '../../simulationResults/simulationResultSummaryModels';
import { FlatWeightTimeStep } from '../../simulationResults/visualisations/simulationResultWeightChart';
import { getChartTimeSteps } from './helpers';

interface WeightChangeOverTimeGraphProps {
  simulationRunBreakdown: SimulationRunBreakdown;
  xAxisOverride?: Partial<AgTimeAxisOptions>;
  yAxisOverride?: Partial<AgNumberAxisOptions>;
  legendOverride?: Partial<AgChartLegendOptions>;
  tickIntervalInMonths?: number;
  area?: boolean;
}

export const WeightChangeOverTimeGraph: FC<WeightChangeOverTimeGraphProps> = ({
  simulationRunBreakdown,
  xAxisOverride,
  yAxisOverride,
  legendOverride,
  tickIntervalInMonths = 3,
}) => {
  const chartTheme = useAppSelector(selectAgChartTheme);

  const normalisedTokenName = (token: string) => {
    return token.replace(/\./g, '-');
  };

  const getNormalisedAreaData = (breakdown: SimulationRunBreakdown) => {
    const result: FlatWeightTimeStep[] = [];
    let data = getChartTimeSteps(breakdown);

    if (data.length > 500) {
      //stacked chart is more cpu intensive, ~500 points is a good balance
      const proportion = Math.ceil(data.length / 500);
      data = data.filter((_, index) => index % proportion === 0);
    }
    data.forEach((item) => {
      const timeStep: FlatWeightTimeStep = {
        date: item.date,
        unix: item.unix,
      };

      item.coinsHeld.forEach((coinHeld) => {
        const lowerCode = coinHeld.coin.coinCode.toLowerCase();
        timeStep[normalisedTokenName(lowerCode)] = coinHeld.weight;
      });

      result.push(timeStep);
    });

    return result;
  };

  const getNormalisedAreaSeries = (
    breakdown: SimulationRunBreakdown
  ): AgAreaSeriesOptions[] => {
    const series: AgAreaSeriesOptions[] = [];
    breakdown.simulationRun.poolConstituents.forEach((constituent) => {
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
  };

  const timeAxisOption: AgTimeAxisOptions = useMemo(() => {
    return {
      type: 'time',
      interval: {
        step: time.month.every(tickIntervalInMonths),
      },
      label: {
        format: '%m-%y',
      },
    };
  }, [tickIntervalInMonths]);

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
        data: getNormalisedAreaData(simulationRunBreakdown),
        axes: [
          { ...timeAxisOption, ...xAxisOverride },
          {
            type: 'number',
            position: 'left',
            label: {
              formatter: (params: AgAxisLabelFormatterParams) => {
                return params.value + '%';
              },
            },
            ...yAxisOverride,
          },
        ],
        series: getNormalisedAreaSeries(simulationRunBreakdown),
        legend: {
          ...legendOverride,
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
