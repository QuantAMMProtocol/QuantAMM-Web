import { FC, useMemo, useEffect, useState } from 'react';
import { AgCharts } from 'ag-charts-react';
import { Spin } from 'antd';
import {
  AgAxisLabelFormatterParams,
  AgAreaSeriesOptions,
  AgChartLegendOptions,
  AgNumberAxisOptions,
  AgTimeAxisOptions,
} from 'ag-charts-community';
import 'ag-charts-enterprise';
import { format } from 'date-fns';
import { useAppSelector } from '../../../app/hooks';
import { selectAgChartTheme } from '../../themes/themeSlice';
import { Product, ProductPoolConstituents } from '../../../models';
import { getChartTimeStepsFromProduct } from './helpers';

interface ProductTokenWeightChangeOverTimeGraphProps {
  product: Product;
  isBenchmark?: boolean;
  xAxisOverride?: Partial<AgTimeAxisOptions>;
  yAxisOverride?: Partial<AgNumberAxisOptions>;
  legendOverride?: Partial<AgChartLegendOptions>;
  area?: boolean;
}

interface TokenWeightTimeStep {
  dateAsString: string;
  timestamp: number;
  [key: string]: number | string;
}

const normalisedTokenName = (token: string) => {
  return token.replace(/\./g, '-');
};

export const ProductTokenWeightChangeOverTimeGraph: FC<
  ProductTokenWeightChangeOverTimeGraphProps
> = ({
  product,
  isBenchmark,
  xAxisOverride,
  yAxisOverride,
  legendOverride,
}) => {
  const chartTheme = useAppSelector(selectAgChartTheme);

  const [updatingChart, setUpdatingChart] = useState(false);

  useEffect(() => {
    if (product) {
      setUpdatingChart(true);

      setTimeout(() => {
        setUpdatingChart(false);
      }, 1000);
    }
  }, [product]);

  const normalisedTimeSeries = useMemo(() => {
    return getChartTimeStepsFromProduct(product.timeSeries);
  }, [product]);

  const normalisedAreaData = useMemo(() => {
    const result: TokenWeightTimeStep[] = [];

    normalisedTimeSeries.forEach((item) => {
      const timeStep: TokenWeightTimeStep = {
        dateAsString: format(item.timestamp * 1000, 'yyyy-MM-dd'),
        timestamp: item.timestamp * 1000,
      };

      product.poolConstituents.forEach(
        (constituent: ProductPoolConstituents, index: number) => {
          if (isBenchmark) {
            timeStep[normalisedTokenName(constituent.coin.toLowerCase())] =
              Number(constituent.weight) *
              item.tokenPrices[constituent.address];
          } else {
            timeStep[normalisedTokenName(constituent.coin.toLowerCase())] =
              Number(
                item.amounts[index] * item.tokenPrices[constituent.address]
              );
          }
        }
      );

      result.push(timeStep);
    });

    return result;
  }, [normalisedTimeSeries, product, isBenchmark]);

  const normalisedAreaSeries: AgAreaSeriesOptions[] =
    useMemo((): AgAreaSeriesOptions[] => {
      const series: AgAreaSeriesOptions[] = [];

      product.poolConstituents.forEach(
        (constituent: ProductPoolConstituents) => {
          series.push({
            type: 'area',
            xKey: 'timestamp',
            yKey: normalisedTokenName(constituent.coin.toLowerCase()),
            yName: constituent.coin.toLowerCase(),
            normalizedTo: 100,
            stacked: true,
          });
        }
      );

      return series;
    }, [product]);

  const timeAxisOption: AgTimeAxisOptions = useMemo(() => {
    if (normalisedTimeSeries.length < 1) {
      return {
        type: 'time',
      };
    }

    const [first] = normalisedTimeSeries;
    const last = normalisedTimeSeries[normalisedTimeSeries.length - 1];
    const startDate = first.timestamp * 1000;
    const endDate = last.timestamp * 1000;
    const totalDuration = endDate - startDate;

    const ticks: number[] = [startDate];

    if (normalisedTimeSeries.length < 2) {
      return {
        type: 'time',
        interval: {
          values: ticks,
        },
      };
    } else if (normalisedTimeSeries.length < 3) {
      ticks.push(endDate);
    } else {
      ticks.push(startDate + totalDuration / 2);
      ticks.push(endDate);
    }

    return {
      type: 'time',
      nice: false,
      interval: {
        values: ticks,
      },
      label: {
        format: '%d-%m-%y',
      },
      min: startDate,
      max: endDate,
    };
  }, [normalisedTimeSeries]);

  return updatingChart ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin />
    </div>
  ) : (
    <AgCharts
      options={{
        height: 230,
        padding: {
          left: 30,
          right: 30,
          top: 20,
          bottom: 20,
        },
        data: normalisedAreaData,
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
        series: normalisedAreaSeries,
        legend: {
          ...legendOverride,
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
          },
        },
      }}
    />
  );
};
