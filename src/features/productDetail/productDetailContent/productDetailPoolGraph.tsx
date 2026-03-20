// productDetailPoolGraph.tsx
import { FC, memo, useCallback, useMemo, useState } from 'react';
import { AgCharts } from 'ag-charts-react';
import type {
  AgCartesianSeriesOptions,
  AgNumberAxisOptions,
  AgTimeAxisOptions,
  AgTooltipRendererResult,
} from 'ag-charts-community';
import { time } from 'ag-charts-community';
import { Grid, Row, Col } from 'antd';

import styles from './productDetailPoolGraph.module.scss';

import { useAppSelector } from '../../../app/hooks';
import { selectAgChartTheme } from '../../themes/themeSlice';
import {
  selectProductById,
  selectProductDetailSelectedTimeRange,
  selectLoadingSimulationRunBreakdown,
  selectTimeseriesAnalysisByProductId,
} from '../../productExplorer/productExplorerSlice';

import {
  ProductDetailDropdownSelect,
  ProductDetailDropdownSelectOption,
} from './components/productDetailDropdownSelect';
import { ProductDetailGraphTimeRangeSelector } from './components/productDetailGraphTimeRangeSelector';
import { filterByTimeRange } from './helpers';
import { getProductDetailTimeAxisPreset } from './productDetailPoolGraphUtils';

const { useBreakpoint } = Grid;

interface ProductDetailPoolGraphImplProps {
  productId: string;
}

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n));
}

const ProductDetailPoolGraphImpl: FC<ProductDetailPoolGraphImplProps> = ({
  productId,
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;

  const [selectedSecondAxis, setSelectedSecondAxis] = useState<
    ProductDetailDropdownSelectOption[]
  >([]);

  const chartTheme = useAppSelector(selectAgChartTheme);
  const selectedTimeRange = useAppSelector(
    selectProductDetailSelectedTimeRange
  );
  const loadingSimulationRunBreakdown = useAppSelector((s) =>
    selectLoadingSimulationRunBreakdown(s, productId)
  );

  const product = useAppSelector((s) => selectProductById(s, productId));
  const productName = product?.name ?? '';
  const timeSeries = useMemo(
    () => product?.timeSeries ?? [],
    [product?.timeSeries]
  );

  const constituents = useMemo(
    () => product?.poolConstituents ?? [],
    [product?.poolConstituents]
  );
  const timeseriesAnalysis = useAppSelector((s) =>
    selectTimeseriesAnalysisByProductId(s, productId)
  );

  const availableSecondAxisSeries: ProductDetailDropdownSelectOption[] =
    useMemo(
      () =>
        (timeseriesAnalysis ?? []).map((a) => ({
          value: a.metricKey,
          label: a.metricName,
        })),
      [timeseriesAnalysis]
    );

  const handleSecondAxisChange = useCallback(
    (selectedItems: string[]) => {
      if (selectedItems.length > 0) {
        setSelectedSecondAxis(
          availableSecondAxisSeries.filter((opt) =>
            selectedItems.includes(opt.value)
          )
        );
      } else {
        setSelectedSecondAxis([]);
      }
    },
    [availableSecondAxisSeries]
  );

  const tsLen = timeSeries.length;

  const filteredTs = useMemo(
    () =>
      timeSeries.filter((pt) =>
        filterByTimeRange(pt.timestamp, selectedTimeRange)
      ),
    [timeSeries, selectedTimeRange]
  );

  const chartData: ({
    date: number;
    value?: number;
    volume?: number;
    benchmarkValue?: number;
  } & Record<string, number>)[] = useMemo(() => {
    if (!filteredTs.length) return [];

    const base = filteredTs.map((dp) => ({
      date: dp.timestamp * 1000,
      value: dp.sharePrice,
      volume: dp.volume24h,
    }));

    let benchmarkData: { date: number; benchmarkValue: number }[] = [];
    const hasTokenArrays =
      Array.isArray(filteredTs[0].tokenPriceArray) &&
      filteredTs[0].tokenPriceArray.length > 0 &&
      Array.isArray(filteredTs[0].amounts) &&
      filteredTs[0].amounts.length > 0;

    if (hasTokenArrays) {
      const t0 = filteredTs[0];
      const snapshotPriceTotalLiquidity =
        (t0.tokenPriceArray ?? [])
          .map((x, i) => (t0.amounts?.[i] ?? 0) * x)
          .reduce((acc, curr) => acc + curr, 0) ?? 0;

      const hodlAmounts =
        (t0.tokenPriceArray ?? []).map(
          (x, _i, arr) => snapshotPriceTotalLiquidity / (arr.length || 1) / x
        ) ?? [];

      const hodlTotalShares = t0.totalShares ?? 0;
      const snapshotScalingFactor =
        (t0.sharePrice * (t0.totalShares ?? 1)) /
        (snapshotPriceTotalLiquidity || 1);

      benchmarkData = filteredTs.map((dp) => {
        let hodlTotalLiquidity = 0;
        for (let j = 0; j < (dp.amounts?.length ?? 0); j++) {
          const tokenAddr = constituents[j]?.address;
          const px = tokenAddr ? dp.tokenPrices[tokenAddr] : undefined;
          if (px != null) {
            hodlTotalLiquidity += (hodlAmounts[j] ?? 0) * px;
          }
        }
        return {
          date: dp.timestamp * 1000,
          benchmarkValue:
            filteredTs.length < tsLen
              ? (hodlTotalLiquidity * snapshotScalingFactor) /
                (hodlTotalShares || 1)
              : dp.hodlSharePrice,
        };
      });
    } else {
      benchmarkData = filteredTs.map((dp) => ({
        date: dp.timestamp * 1000,
        benchmarkValue: dp.hodlSharePrice,
      }));
    }

    const secondAxisRows: { date: number; [k: string]: number }[] = [];
    (timeseriesAnalysis ?? []).forEach((metric) => {
      if (!selectedSecondAxis.find((m) => m.value === metric.metricKey)) return;
      metric.timeSteps
        .filter((ts) => filterByTimeRange(ts.unix, selectedTimeRange))
        .forEach((ts) => {
          secondAxisRows.push({
            date: ts.unix * 1000,
            [metric.metricKey]: ts.timeStepTotal,
          });
        });
    });

    return [...base, ...benchmarkData, ...secondAxisRows];
  }, [
    filteredTs,
    selectedTimeRange,
    selectedSecondAxis,
    timeseriesAnalysis,
    constituents,
    tsLen,
  ]);

  const firstAxisSeries: AgCartesianSeriesOptions[] = useMemo(
    () => [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'value',
        yName: `${productName} ($)`,
        stroke: '#c7b283',
        connectMissingData: false,
        tooltip: {
          renderer: (p): string | AgTooltipRendererResult => ({
            content: formatUsd(p.datum.value),
          }),
        },
      },
      {
        type: 'bar',
        xKey: 'date',
        yKey: 'volume',
        yName: 'Volume 24H',
        fill: '#f8ba33ff',
        tooltip: {
          renderer: (p): string | AgTooltipRendererResult => ({
            content: formatUsd(p.datum.volume),
          }),
        },
      },
      {
        type: 'line',
        xKey: 'date',
        yKey: 'benchmarkValue',
        stroke: '#528aae',
        lineDashOffset: 20,
        lineDash: [4, 4],
        yName: 'HODL Value ($)',
        connectMissingData: false,
        tooltip: {
          renderer: (p): string | AgTooltipRendererResult => ({
            content: formatUsd(p.datum.benchmarkValue),
          }),
        },
      },
    ],
    [productName]
  );

  const secondaryAxisSeries: AgCartesianSeriesOptions[] = useMemo(
    () =>
      selectedSecondAxis.map(
        (s): AgCartesianSeriesOptions => ({
          type: 'line',
          xKey: 'date',
          yKey: s.value,
          yName: s.label,
          connectMissingData: false,
        })
      ),
    [selectedSecondAxis]
  );

  const series: AgCartesianSeriesOptions[] = useMemo(
    () => [...firstAxisSeries, ...secondaryAxisSeries],
    [firstAxisSeries, secondaryAxisSeries]
  );

  const totalSpanMs = useMemo(() => {
    if (filteredTs.length < 2) return 0;
    const first = filteredTs[0].timestamp * 1000;
    const last = filteredTs[filteredTs.length - 1].timestamp * 1000;
    return last - first;
  }, [filteredTs]);

  const timeAxisPreset = useMemo(
    () => getProductDetailTimeAxisPreset(totalSpanMs, isMobile),
    [totalSpanMs, isMobile]
  );

  const axes: (AgNumberAxisOptions | AgTimeAxisOptions)[] = useMemo(() => {
    const maxVol = filteredTs.length
      ? Math.max(...filteredTs.map((d) => d.volume24h ?? 0))
      : 0;

    const timeAxisStep =
      timeAxisPreset.intervalUnit === 'day'
        ? time.day.every(timeAxisPreset.intervalStep)
        : timeAxisPreset.intervalUnit === 'week'
          ? time.monday.every(timeAxisPreset.intervalStep)
          : timeAxisPreset.intervalUnit === 'month'
            ? time.month.every(timeAxisPreset.intervalStep)
            : time.year.every(timeAxisPreset.intervalStep);

    const base: (AgNumberAxisOptions | AgTimeAxisOptions)[] = [
      {
        type: 'time',
        position: 'bottom',
        nice: true,
        label: {
          format: timeAxisPreset.labelFormat,
          autoRotate: true,
          autoRotateAngle: 320,
          avoidCollisions: true,
          minSpacing: timeAxisPreset.labelMinSpacing,
        },
        interval: {
          step: timeAxisStep,
          minSpacing: timeAxisPreset.intervalMinSpacing,
        },
      },
      { type: 'number', position: 'left', keys: ['benchmarkValue', 'value'] },
      {
        type: 'number',
        position: 'left',
        max: maxVol * 2,
        keys: ['volume'],
        label: { enabled: false },
      },
    ];

    if (selectedSecondAxis.length > 0) {
      base.push({
        type: 'number',
        position: 'right',
        keys: selectedSecondAxis.map((s) => s.value),
      });
    }
    return base;
  }, [filteredTs, selectedSecondAxis, timeAxisPreset]);

  const options = useMemo(
    () => ({
      height: 400,
      navigator: { enabled: false, height: 5, spacing: 6 },
      padding: { right: 50 },
      data: chartData,
      series,
      axes,
      theme: {
        baseTheme: chartTheme,
        overrides: {
          common: { background: { fill: 'transparent' } },
          line: {
            series: {
              cursor: 'crosshair',
              marker: { enabled: false },
            },
          },
        },
      },
    }),
    [chartData, series, axes, chartTheme]
  );

  // Render
  return (
    <Row id="graph">
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
            <AgCharts options={options} />
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

export const ProductDetailPoolGraph = memo(ProductDetailPoolGraphImpl);
