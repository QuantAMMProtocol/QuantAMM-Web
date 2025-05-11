import { FC, useCallback, useMemo, useState } from 'react';
import { AgCharts } from 'ag-charts-react';
import {
  AgCartesianSeriesOptions,
  AgNumberAxisOptions,
  AgTimeAxisOptions,
  AgTooltipRendererResult,
  time
} from 'ag-charts-community';
import { Col, Row, Typography } from 'antd';
import { getTime } from 'date-fns';
import { useAppSelector } from '../../../app/hooks';
import { Product } from '../../../models';
import { selectAgChartTheme } from '../../themes/themeSlice';
import { SimulationResultTimeseries } from '../../simulationRunner/simulationRunnerDtos';
import {
  selectLoadingSimulationRunBreakdown,
  selectProductDetailSelectedTimeRange,
  selectTimeseriesAnalysisByProductId,
} from '../../productExplorer/productExplorerSlice';
import { filterByTimeRange } from './helpers';
import {
  ProductDetailDropdownSelect,
  ProductDetailDropdownSelectOption,
} from './components/productDetailDropdownSelect';
import { ProductDetailGraphTimeRangeSelector } from './components/productDetailGraphTimeRangeSelector';

import styles from './productDetailPoolGraph.module.scss';
const { Title } = Typography;

export interface Marker {
  enabled: boolean;
}

export interface SeriesConfig {
  xKey: string;
  yKey: string;
  yName: string;
  data: number[];
  marker: Marker;
}

export interface SeriesToShow {
  fees?: boolean;
}

interface ProductDetailPoolGraphProps {
  product: Product;
}

export const ProductDetailPoolGraph: FC<ProductDetailPoolGraphProps> = ({
  product,
}) => {
  const [selectedSecondAxis, setSelectedSecondAxis] = useState<
    ProductDetailDropdownSelectOption[]
  >([]);

  const chartTheme = useAppSelector(selectAgChartTheme);

  const selectedTimeRange = useAppSelector(
    selectProductDetailSelectedTimeRange
  );

  const loadingSimulationRunBreakdown = useAppSelector((state) =>
    selectLoadingSimulationRunBreakdown(state, product.id)
  );

  const timeseriesAnalysis = useAppSelector((state) =>
    selectTimeseriesAnalysisByProductId(state, product.id)
  );

  const availableSecondAxisSeries = useMemo(() => {
    return (
      timeseriesAnalysis?.map((element) => {
        return {
          value: element.metricKey,
          label: element.metricName,
        };
      }) ?? []
    );
  }, [timeseriesAnalysis]);

  const handleSecondAxisChange = useCallback(
    (selectedItems: string[]) => {
      if (selectedItems.length > 0) {
        setSelectedSecondAxis(
          availableSecondAxisSeries.filter((item) =>
            selectedItems.includes(item.value)
          )
        );
      } else {
        setSelectedSecondAxis([]);
      }
    },
    [availableSecondAxisSeries]
  );

  const getData = useCallback(
    (timeSeries: SimulationResultTimeseries[]) => {
      const firstAxisData = [
        ...(product.timeSeries ?? [])
          .filter((dataPoint) =>
            filterByTimeRange(dataPoint.timestamp, selectedTimeRange)
          )
          .map((dataPoint) => ({
            date: getTime(dataPoint.timestamp) * 1000,
            value: dataPoint.sharePrice,
            volume: dataPoint.volume24h,
          })),
      ];

      const benchmarkData = [
        ...(product.timeSeries ?? [])
          .filter((dataPoint) =>
            filterByTimeRange(dataPoint.timestamp, selectedTimeRange)
          )
          .map((dataPoint) => {
            return {
              date: getTime(dataPoint.timestamp) * 1000,
              benchmarkValue: dataPoint.hodlSharePrice,
            };
          }),
      ];

      const secondAxisData: { date: number; [key: string]: number }[] = [];

      timeSeries
        .filter((dataPoint) =>
          selectedSecondAxis.some((item) => item.value === dataPoint.metricKey)
        )
        .forEach((dataPoint) => {
          dataPoint.timeSteps
            .filter((timeStep) =>
              filterByTimeRange(timeStep.unix, selectedTimeRange)
            )
            .forEach((timeStep) => {
              secondAxisData.push({
                date: getTime(timeStep.unix) * 1000,
                [dataPoint.metricKey]: timeStep.timeStepTotal,
              });
            });
        });
      return [...firstAxisData, ...benchmarkData, ...secondAxisData];
    },
    [product, selectedSecondAxis, selectedTimeRange]
  );

  const getFirstAxisSeries = useCallback(
    (): AgCartesianSeriesOptions[] => [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'value',
        yName: product.name + ' ($)',
        connectMissingData: false,
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
      {
        type: 'bar',
        xKey: 'date',
        yKey: 'volume',
        yName: 'Volume 24H',
        tooltip: {
          renderer: (params): string | AgTooltipRendererResult => {
            return {
              content: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(params.datum.volume)),
            };
          },
        },
      },
      {
        type: 'line',
        xKey: 'date',
        yKey: 'benchmarkValue',
        yName: 'HODL Value ($)',
        connectMissingData: false,
        tooltip: {
          renderer: (params): string | AgTooltipRendererResult => {
            return {
              content: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(Number(params.datum.benchmarkValue)),
            };
          },
        },
      },
    ],
    [product]
  );

  const getSecondarySeries = useCallback(
    (): AgCartesianSeriesOptions[] =>
      selectedSecondAxis.map((element) => ({
        type: 'line',
        xKey: 'date',
        yKey: element.value,
        yName: element.label,
        connectMissingData: false,
      })),
    [selectedSecondAxis]
  );

  const getSeries = useCallback((): AgCartesianSeriesOptions[] => {
    return [...getFirstAxisSeries(), ...getSecondarySeries()];
  }, [getFirstAxisSeries, getSecondarySeries]);

  const getAxesFormat = useMemo(() => {
    const timeSeriesData = product.timeSeries ?? [];
    const filteredData = timeSeriesData.filter((dataPoint) =>
      filterByTimeRange(dataPoint.timestamp, selectedTimeRange)
    );

    const totalDuration =
      filteredData.length > 0
        ? getTime(filteredData[filteredData.length - 1].timestamp) -
          getTime(filteredData[0].timestamp)
        : 0;

    const oneDay = 24 * 60 * 60 * 1000;
    const oneMonth = 30 * oneDay;

    if (totalDuration <= oneMonth) {
      return '%d %b %Y'; // Format for shorter timeframes (e.g., days)
    } else {
      return '%b %Y'; // Format for longer timeframes (e.g., months and years)
    }
  }, [product.timeSeries, selectedTimeRange]);
  const getIntervalStep = useMemo(() => {
    const timeSeriesData = product.timeSeries ?? [];
    const filteredData = timeSeriesData.filter((dataPoint) =>
      filterByTimeRange(dataPoint.timestamp, selectedTimeRange)
    );

    const totalDuration =
      filteredData.length > 0
        ? (getTime(filteredData[filteredData.length - 1].timestamp) -
          getTime(filteredData[0].timestamp)) * 1000
        : 0;

    const maxDataPoints = 30;
    const oneDay = 24 * 60 * 60 * 1000;

    if (totalDuration <= maxDataPoints * oneDay) {
      console.log('Daily steps');
      return time.day.every(1); // Daily steps
    } else {
      console.log('Monthly steps');
      const interval = Math.ceil(totalDuration / (maxDataPoints * oneDay));
      return time.day.every(interval); // Adjusted interval to fit max data points
    }
  }, [product.timeSeries, selectedTimeRange]);

  const getAxes = useCallback((): (
    | AgNumberAxisOptions
    | AgTimeAxisOptions
  )[] => {
    const result: (AgNumberAxisOptions | AgTimeAxisOptions)[] = [
      {
        type: 'time',
        position: 'bottom',
        nice: true,
        label: {
          format: getAxesFormat,
        },  
        interval: {
          step: getIntervalStep,
        },
        max: getTime(product.timeSeries?.[product.timeSeries.length - 2]?.timestamp ?? 0) * 1000,
        min: getTime(product.timeSeries?.[0]?.timestamp ?? 0) * 1000,
      },
      {
        type: 'number',
        position: 'left',
        keys: ['benchmarkValue', 'value'],
      },
      {
        type: 'number',
        position: 'left',
        max:
          Math.max(
            ...(product.timeSeries ?? [])
              .filter((dataPoint) =>
                filterByTimeRange(dataPoint.timestamp, selectedTimeRange)
              )
              .map((dataPoint) => dataPoint.volume24h)
          ) * 2,
        keys: ['volume'],
        label: {
          enabled: false,
        },
      },
    ];

    const secondaryAxisSeries = getSecondarySeries();

    if (secondaryAxisSeries.length > 0) {
      result.push({
        type: 'number',
        position: 'right',
        keys: selectedSecondAxis.map((item) => item.value),
      });
    }

    return result;
  }, [getAxesFormat, getIntervalStep, product.timeSeries, getSecondarySeries, selectedTimeRange, selectedSecondAxis]);

  return (
    <Row id="graph">
      <Col span={24} className={styles['product-detail-graph__title']}>
        <Title level={4}>Graph</Title>
      </Col>
      <Col span={24}>
        <div className={styles['product-detail-graph-container']}>
          <div className={styles['product-detail-graph__top-right']}>
            <ProductDetailGraphTimeRangeSelector
              selectedTimeRange={selectedTimeRange}
            />
          </div>
          <div className={styles['product-detail-graph__top-left']}>
            <div>
              <ProductDetailDropdownSelect
                isLoading={loadingSimulationRunBreakdown}
                options={availableSecondAxisSeries}
                onSelectedItems={handleSecondAxisChange}
              />
            </div>
          </div>
          <div className={styles['product-detail-graph__mid']}>
            <AgCharts
              options={{
                height: 400,
                navigator: {
                  enabled: false,
                  height: 5,
                  spacing: 6,
                },
                axes: getAxes(),
                data: getData(timeseriesAnalysis ?? []),
                series: getSeries(),
                padding:{
                  right: 50,
                },
                legend: {
                  enabled: true,
                  position: 'top',
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
                    line: {
                      series: {
                        cursor: 'crosshair',
                        marker: {
                          enabled: false,
                        },
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <div className={styles['product-detail-graph__bottom-left']}>
            {/* empty */}
          </div>
          <div className={styles['product-detail-graph__bottom-right']}></div>
        </div>
      </Col>
    </Row>
  );
};
