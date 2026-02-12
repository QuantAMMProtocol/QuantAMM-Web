import { FC, useMemo } from 'react';
import { AgCharts } from 'ag-charts-react';
import {
  AgAxisLabelFormatterParams,
  AgAreaSeriesOptions,
  AgChartLegendOptions,
  AgNumberAxisOptions,
  AgTimeAxisOptions,
} from 'ag-charts-community';
import 'ag-charts-enterprise';
import { useAppSelector } from '../../../app/hooks';
import { selectAgChartTheme } from '../../themes/themeSlice';
import { Product } from '../../../models';
import { getChartTimeStepsFromProduct } from './helpers';
import {
  getBenchmarkEqualWeightedAmounts,
  getFilteredConstituents,
  getNormalisedAreaData,
  getNormalisedAreaSeries,
  getTimeAxisOption,
} from './productTokenWeightChangeOverTimeUtils';

interface ProductTokenWeightChangeOverTimeGraphProps {
  product: Product;
  isBenchmark?: boolean;
  xAxisOverride?: Partial<AgTimeAxisOptions>;
  yAxisOverride?: Partial<AgNumberAxisOptions>;
  legendOverride?: Partial<AgChartLegendOptions>;
  area?: boolean;
}

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

  const filteredConstituents = useMemo(() => {
    return getFilteredConstituents(product);
  }, [product]);

  const normalisedTimeSeries = useMemo(() => {
    return getChartTimeStepsFromProduct(product.timeSeries ?? []);
  }, [product.timeSeries]);

  const benchmarkEqualWeightedAmounts = useMemo(() => {
    return getBenchmarkEqualWeightedAmounts(
      isBenchmark,
      normalisedTimeSeries,
      filteredConstituents
    );
  }, [isBenchmark, normalisedTimeSeries, filteredConstituents]);

  const normalisedAreaData = useMemo(() => {
    return getNormalisedAreaData(
      normalisedTimeSeries,
      filteredConstituents,
      isBenchmark,
      benchmarkEqualWeightedAmounts
    );
  }, [
    normalisedTimeSeries,
    filteredConstituents,
    isBenchmark,
    benchmarkEqualWeightedAmounts,
  ]);

  const normalisedAreaSeries: AgAreaSeriesOptions[] =
    useMemo((): AgAreaSeriesOptions[] => {
      return getNormalisedAreaSeries(filteredConstituents);
    }, [filteredConstituents]);

  const timeAxisOption: AgTimeAxisOptions = useMemo(() => {
    return getTimeAxisOption(normalisedTimeSeries);
  }, [normalisedTimeSeries]);

  return (
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
        legend: legendOverride ?? {
          enabled: true,
          position: 'bottom',
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
