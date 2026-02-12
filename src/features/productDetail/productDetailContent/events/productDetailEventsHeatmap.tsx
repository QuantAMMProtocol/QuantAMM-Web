import { FC, memo, useEffect, useRef } from 'react';
import {
  AgChartOptions,
  AgCharts,
  AgHeatmapSeriesStyle,
} from 'ag-charts-enterprise';
import styles from './productDetailEventsHeatmap.module.scss';

export interface HeatDatum {
  tokenIn: string;
  tokenOut: string;
  usd: number;
}

interface EventsHeatmapProps {
  chartTheme: unknown; // theme object from your selector
  data: HeatDatum[];
  xDomain: string[];
  yDomain: string[];
  addrNameMap: Record<string, string>;
}

export const ProductDetailEventsHeatmap: FC<EventsHeatmapProps> = memo(
  function EventsHeatmap({ chartTheme, data, xDomain, yDomain, addrNameMap }) {
    const chartElRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<ReturnType<typeof AgCharts.create> | null>(null);

    function itemStyler(params: any): AgHeatmapSeriesStyle | undefined {
      const { datum, colorKey = 'usd', highlighted, fill } = params;
      const v = Number(datum[colorKey]);
      const min = Number(params.context?.min ?? 0);
      const max = Number(params.context?.max ?? 1);
      const t =
        Number.isFinite(v) && max > min
          ? Math.min(1, Math.max(0, (v - min) / (max - min)))
          : 0.5;
      const fillOpacity = 0.2 + 0.6 * t;

      const brighten = (css: string, amt = 0.1) => {
        try {
          const ctx = document.createElement('canvas').getContext('2d')!;
          ctx.fillStyle = css;
          ctx.clearRect(0, 0, 1, 1);
          ctx.fillRect(0, 0, 1, 1);
          const { data: px } = ctx.getImageData(0, 0, 1, 1);

          const toLin = (u: number) => {
            const s = u / 255;
            return s <= 0.04045
              ? s / 12.92
              : Math.pow((s + 0.055) / 1.055, 2.4);
          };
          const toSrgb = (l: number) => {
            const s =
              l <= 0.0031308 ? l * 12.92 : 1.055 * Math.pow(l, 1 / 2.4) - 0.055;
            return Math.round(Math.max(0, Math.min(255, s * 255)));
          };

          const tAmt = Math.min(1, amt * 2.4 + 0.06);
          const [r, g, b] = [px[0], px[1], px[2]];
          const [Rl, Gl, Bl] = [toLin(r), toLin(g), toLin(b)];
          const [nR, nG, nB] = [
            toSrgb(Rl + (1 - Rl) * tAmt),
            toSrgb(Gl + (1 - Gl) * tAmt),
            toSrgb(Bl + (1 - Bl) * tAmt),
          ];
          return `rgb(${nR}, ${nG}, ${nB})`;
        } catch {
          return css;
        }
      };

      const softStroke = brighten(fill as string, 0.02);
      const softStrokeOpacity = 0.5;
      const isTop = t > 0.9;

      if (highlighted) {
        return {
          fill,
          fillOpacity: Math.min(1, fillOpacity + 0.15),
          stroke: brighten(fill as string, 0.25),
          strokeWidth: 1.25,
          strokeOpacity: 0.95,
        };
      }

      return {
        fill,
        fillOpacity,
        stroke: isTop ? brighten(fill as string, 0.18) : softStroke,
        strokeWidth: isTop ? 1 : 0.6,
        strokeOpacity: isTop ? 0.85 : softStrokeOpacity,
      };
    }

    useEffect(() => {
      const container = chartElRef.current;
      const addrToName = (addr?: string) =>
        addrNameMap[String(addr ?? '').toLowerCase()] ?? String(addr ?? '');

      if (!container || data.length === 0) {
        if (chartRef.current) {
          chartRef.current.destroy();
          chartRef.current = null;
        }
        return;
      }

      const options: AgChartOptions = {
        container,
        data,
        theme: {
          baseTheme: chartTheme as any,
          overrides: {
            heatmap: {
              series: {
                colorRange: ['#f96103ff', '#599707ff'],
                strokeWidth: 0.4,
                strokeOpacity: 0.5,
              } as AgHeatmapSeriesStyle,
            },
          },
        },
        title: { text: 'Swap Volume Distribution' },
        series: [
          {
            itemStyler,
            type: 'heatmap',
            xKey: 'tokenIn',
            xName: 'Token In',
            yKey: 'tokenOut',
            yName: 'Token Out',
            colorKey: 'usd',
            colorName: 'USD',
            xDomain,
            yDomain,
            colourRange: ['green', 'red'],
            label: {
              enabled: true,
              fontSize: 9,
              formatter: ({ value }: { value: number }) => {
                const v = Number(value) || 0;
                if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}m`;
                if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
                return `$${v.toFixed(0)}`;
              },
            },
            tooltip: {
              renderer: ({ datum }: any) => ({
                title: `${addrToName(datum.tokenIn)} → ${addrToName(datum.tokenOut)}`,
                content: `$${Number(datum.usd).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
                style: { fontSize: 8, lineHeight: 1.2 },
              }),
            },
          } as any,
        ],
        axes: [
          {
            position: 'right',
            type: 'category',
            tick: { size: 10 },
            label: {
              padding: 0,
              rotation: 45,
              fontSize: 8,
              formatter: ({ value }: any) => addrToName(String(value)),
            },
          },
          {
            position: 'bottom',
            type: 'category',
            line: { enabled: false },
            label: {
              fontSize: 8,
              padding: 0,
              formatter: ({ value }: any) => addrToName(String(value)),
            },
          },
        ],
        gradientLegend: {
          scale: {
            label: {
              formatter: ({ value }: { value: number }) => {
                const v = Number(value) || 0;
                if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}m`;
                if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
                return `$${v.toFixed(0)}`;
              },
            },
            interval: { step: 5000 },
          },
          gradient: { thickness: 14, preferredLength: 360 },
        },
      };

      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
      chartRef.current = AgCharts.create(options);

      return () => {
        if (chartRef.current) {
          chartRef.current.destroy();
          chartRef.current = null;
        }
      };
    }, [chartTheme, data, xDomain, yDomain, addrNameMap]);

    return <div ref={chartElRef} className={styles.heatmapContainer} />;
  }
);
