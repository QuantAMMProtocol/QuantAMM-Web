import { FC, useMemo } from 'react';
import { AgCharts } from 'ag-charts-react';
import {
  AgAngleAxisLabelOrientation,
  AgAxisLabelFormatterParams,
  AgPolarAxisOptions,
  AgPolarSeriesOptions,
  AgTooltipRendererResult,
} from 'ag-charts-community';
import 'ag-charts-enterprise';
import { Typography } from 'antd';
import { useAppSelector } from '../../../app/hooks';
import { selectAgChartTheme } from '../../themes/themeSlice';
import { productExplorerTranslation } from '../../productExplorer/translations';
import {
  MAX_TOTAL_SCORE,
  getScoreColor,
  getTotalScore,
  getTotalScoreColor,
} from './helpers';
import styles from './productItemOverviewGraph.module.scss';

const { Text } = Typography;

interface ProductItemOverviewGraphProps {
  data: {
    metric: string;
    value?: number;
    maxScore: number;
    description: string;
  }[];
  isDarkTheme: boolean;
  wide?: boolean;
  showScoreOverall?: boolean;
  orientationOverride?: AgAngleAxisLabelOrientation;
  fontSizeOverride?: number;
  intervalStepOverride?: number;
  heightOverride?: number;
  widthOverride?: number;
}

export const ProductItemOverviewGraph: FC<ProductItemOverviewGraphProps> = ({
  data,
  isDarkTheme,
  wide,
  showScoreOverall,
  orientationOverride,
  fontSizeOverride,
  intervalStepOverride,
  heightOverride,
  widthOverride,
}) => {
  const chartTheme = useAppSelector(selectAgChartTheme);

  const totalScore = getTotalScore(data.map((item) => item.value ?? 0));

  const radarColor = useMemo(() => {
    return getTotalScoreColor(totalScore);
  }, [totalScore]);

  const series: AgPolarSeriesOptions[] = useMemo(() => {
    return [
      {
        type: 'radar-area',
        angleKey: 'metric',
        radiusKey: 'value',
        radiusName: 'Overview',
        fill: radarColor,
        stroke: radarColor,
        tooltip: {
          renderer: (params): string | AgTooltipRendererResult => {
            return {
              title: `<h6 class="overall-graph-tooltip-title">${params.datum.metric.toUpperCase()}</h4>`,
              content: `<div style="width:150px"class="overall-graph-tooltip-content"}}>Score: <strong style="color: ${getScoreColor(params.datum.value)}">${params.datum.value}/${params.datum.maxScore}</strong>
              <br />
              ${wide ? '' : params.datum.description}</div>`,
              backgroundColor: getScoreColor(params.datum.value),
            };
          },
        },
      },
    ];
  }, [wide, radarColor]);

  const axes: AgPolarAxisOptions[] = useMemo(() => {
    return [
      {
        type: 'angle-category',
        label: wide
          ? {
              enabled: false,
            }
          : {
              orientation: orientationOverride ?? 'parallel',
              fontSize: fontSizeOverride ?? 10,
              padding: 2,
              formatter: (params: AgAxisLabelFormatterParams) =>
                productExplorerTranslation[params.value as string] ||
                (params.value as string),
            },
      },
      {
        type: 'radius-number',
        min: 0,
        max: 5,
        interval: { step: intervalStepOverride ?? 1 },
        tick: {
          width: 0,
        },
        label: {
          enabled: false,
        },
      },
    ];
  }, [intervalStepOverride, fontSizeOverride, orientationOverride, wide]);

  return (
    <div className={styles['product-item__graph-overlay']}>
      {showScoreOverall && (
        <div className={styles['product-item__graph-overlay__content']}>
          <Text strong style={{ fontSize: wide ? 9 : '' }}>
            Overall Score{' '}
            <span style={{ color: radarColor }}>
              {totalScore}/{MAX_TOTAL_SCORE}
            </span>
          </Text>
        </div>
      )}
      <AgCharts
        options={{
          width: widthOverride ?? wide ? 100 : 288,
          height: heightOverride ?? wide ? 100 : 240,
          data,
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
              'radar-area': {
                axes: {
                  'angle-category': {
                    label: {
                      color: isDarkTheme ? '#FFFFEF' : '#0B1827',
                    },
                  },
                },
              },
            },
          },
        }}
      />
    </div>
  );
};
