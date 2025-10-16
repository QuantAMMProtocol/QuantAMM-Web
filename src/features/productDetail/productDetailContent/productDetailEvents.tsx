import { FC, memo, useEffect, useMemo, useRef } from 'react';
import { Button, Col, Row, Spin, Tag, Tooltip, Typography, Empty } from 'antd';
import type {
  GridOptions,
  ICellRendererParams,
  ValueFormatterParams,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { format } from 'date-fns';
import {
  GqlChain,
  GqlPoolEvent,
  GqlPoolEventType,
} from '../../../__generated__/graphql-types';
import { useFetchPoolEventsData } from '../../../hooks/useFetchPoolEventsData';
import { useAppSelector } from '../../../app/hooks';
import { selectAgChartTheme, selectAgGridTheme } from '../../themes/themeSlice';
import { selectProductById } from '../../productExplorer/productExplorerSlice';
import { CURRENT_LIVE_FACTSHEETS } from '../../documentation/factSheets/liveFactsheets';
import {
  AgChartOptions,
  AgCharts,
  AgHeatmapSeriesStyle,
} from 'ag-charts-enterprise';

const { Title } = Typography;

interface ProductDetailEventsProps {
  productId: string;
  chain: GqlChain;
  isMobile?: boolean;
}

export const ProductDetailEvents: FC<ProductDetailEventsProps> = memo(
  function ProductDetailEventsImpl({
    productId,
    chain,
    isMobile,
  }: ProductDetailEventsProps) {
    const darkThemeAg = useAppSelector(selectAgGridTheme);
    const gridRef = useRef<AgGridReact<GqlPoolEvent>>(null);
    const chartTheme = useAppSelector(selectAgChartTheme);

    const product = useAppSelector((s) => selectProductById(s, productId));
    const productAddress = product?.address?.toLowerCase() ?? '';
    const livePools = CURRENT_LIVE_FACTSHEETS;

    const { poolEvents, loading, error } = useFetchPoolEventsData({
      first: 1000,
      skip: undefined,
      poolId: productId,
      chain,
    });

    const explorerBase = useMemo(() => {
      const roots: Record<string, string> = {
        MAINNET: 'https://etherscan.io',
        BASE: 'https://basescan.org',
        ARBITRUM: 'https://arbiscan.io',
        SONIC: 'https://sonicscan.org',
      };
      return roots[String(chain).toUpperCase()] ?? 'https://etherscan.io';
    }, [chain]);

    const truncateMiddle = (text: string, s = 6, e = 6) =>
      (text?.length ?? 0) <= s + e
        ? text
        : `${text.slice(0, s)}…${text.slice(-e)}`;

    const { goldThreshold, silverThreshold, bronzeThreshold, srcPrefix } =
      useMemo(() => {
        let gold = 0,
          silver = 0,
          bronze = 0,
          prefix = 'UNKNOWN';
        const depos = livePools.factsheets.find(
          (y) => y.poolId == productAddress
        )?.depositorBadges;
        if (productAddress && depos) {
          prefix = depos.prefix;
          gold = depos.gold;
          silver = depos.silver;
          bronze = depos.bronze;
        }
        return {
          goldThreshold: gold,
          silverThreshold: silver,
          bronzeThreshold: bronze,
          srcPrefix: prefix,
        };
      }, [livePools.factsheets, productAddress]);

    /* --------------------------- DESKTOP GRID (unchanged) --------------------------- */
    const columnDefs = useMemo(
      () => [
        {
          colId: 'badge',
          headerName: '',
          width: 40,
          suppressMenu: true,
          sortable: false,
          filter: false,
          cellRenderer: (p: ICellRendererParams) => {
            const val = Number(p.data?.valueUSD ?? 0);
            let level: 'gold' | 'silver' | 'bronze' | null = null;
            if (val >= goldThreshold) level = 'gold';
            else if (val >= silverThreshold) level = 'silver';
            else if (val >= bronzeThreshold) level = 'bronze';

            const src =
              level != null
                ? `/badges/${srcPrefix}-${level}.svg`
                : '/badges/blank.svg';

            return (
              <Tooltip title={`USD Value: $${val.toLocaleString('en-US')}`}>
                <img src={src} alt="badge" style={{ width: 18, height: 18 }} />
              </Tooltip>
            );
          },
        },
        {
          colId: 'type',
          field: 'type',
          headerName: 'Type',
          width: 120,
          enableRowGroup: true,
        },
        {
          colId: 'timestamp',
          field: 'timestamp',
          headerName: 'Timestamp',
          width: 160,
          enableRowGroup: true,
          valueFormatter: (p: ValueFormatterParams) =>
            p.value
              ? format(new Date(Number(p.value) * 1000), 'yyyy-MM-dd HH:mm:ss')
              : '',
        },
        {
          colId: 'valueUSD',
          field: 'valueUSD',
          headerName: 'Value (USD)',
          width: 150,
          enableRowGroup: true,
          type: 'number',
          valueFormatter: (p: ValueFormatterParams) =>
            p.value
              ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(p.value))
              : '',
          cellStyle: { textAlign: 'right' as const },
        },
        {
          colId: 'sender',
          field: 'sender',
          headerName: 'Sender',
          width: 160,
          enableRowGroup: true,
          cellRenderer: (p: ICellRendererParams) => {
            const url = `${explorerBase}/address/${p.value}`;
            return (
              <Tag
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textAlign: 'center' }}
                >
                  {truncateMiddle(String(p.value))}
                </a>
              </Tag>
            );
          },
        },
        {
          colId: 'tx',
          field: 'tx',
          headerName: 'Tx',
          width: 160,
          enableRowGroup: true,
          cellRenderer: (p: ICellRendererParams) => {
            const url = `${explorerBase}/tx/${p.value}`;
            return (
              <Tag
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textAlign: 'center' }}
                >
                  {truncateMiddle(String(p.value))}
                </a>
              </Tag>
            );
          },
        },
        {
          colId: 'blockNumber',
          field: 'blockNumber',
          headerName: 'Block Number',
          width: 150,
          enableRowGroup: true,
          type: 'number',
        },
      ],
      [bronzeThreshold, explorerBase, goldThreshold, silverThreshold, srcPrefix]
    );

    const rowData = useMemo(
      () =>
        (poolEvents ?? []).map(
          ({
            blockNumber,
            id,
            sender,
            timestamp,
            tx,
            type,
            valueUSD,
          }: GqlPoolEvent) => ({
            id,
            blockNumber,
            type,
            sender,
            tx,
            timestamp,
            valueUSD,
          })
        ),
      [poolEvents]
    );

    const gridOptions: GridOptions = useMemo(
      () => ({
        columnDefs,
        rowHeight: 26,
        defaultColDef: {
          filter: 'agTextColumnFilter',
          sortable: true,
          resizable: true,
          enablePivot: true,
        },
        columnTypes: {
          number: { filter: 'agNumberColumnFilter', sortable: true },
          nonEditableColumn: { editable: false },
        },
        groupDefaultExpanded: 3,
      }),
      [columnDefs]
    );

    // -------------------- MOBILE HEATMAP DATA (with deterministic ordering) --------------------
    interface HeatDatum {
      tokenIn: string;
      tokenOut: string;
      usd: number;
    }

    const { heatmapData, xDomain, yDomain } = useMemo(() => {
      // 1) Build address->coin map and canonical domain (pool constituent order by coin name)
      const constituents = (product?.poolConstituents ?? []).filter(
        (c) => c?.address
      );
      const addrToCoin = new Map(
        constituents.map((c) => [
          String(c.address).toLowerCase(),
          String(c.coin ?? c.address),
        ])
      );
      const canonicalCoinOrder = constituents.map((c) =>
        String(c.coin ?? c.address)
      );

      // 2) Aggregate USD by (coinIn, coinOut)
      const normAddr = (a?: string) => {
        const v = String(a ?? '').trim();
        return /^0x[a-fA-F0-9]{40}$/.test(v) ? v.toLowerCase() : '';
      };

      const acc = new Map<string, number>();
      for (const ev of poolEvents ?? []) {
        if (ev.type !== ('SWAP' as GqlPoolEventType)) continue;

        const inAddr = normAddr((ev as any)?.tokenIn?.address);
        const outAddr = normAddr((ev as any)?.tokenOut?.address);
        if (!inAddr || !outAddr) continue;

        const coinIn = addrToCoin.get(inAddr) ?? inAddr;   // fallback retains data
        const coinOut = addrToCoin.get(outAddr) ?? outAddr;

        const usd = Number(ev.valueUSD ?? 0);
        if (!Number.isFinite(usd) || usd <= 0) continue;

        const key = `${coinIn}__${coinOut}`;
        acc.set(key, (acc.get(key) ?? 0) + usd);
      }

      const heatmapData: HeatDatum[] = Array.from(acc, ([key, usd]) => {
        const [tokenIn, tokenOut] = key.split('__');
        return { tokenIn, tokenOut, usd };
      });

      // 3) Build domain: pool order first, then any extras in first-seen order (NO alpha sort)
      const present = new Set<string>([
        ...heatmapData.map((d) => d.tokenIn),
        ...heatmapData.map((d) => d.tokenOut),
      ]);

      const base = canonicalCoinOrder.filter((name) => present.has(name));
      const seen = new Set(base);
      const extras: string[] = [];
      for (const d of heatmapData) {
        if (!seen.has(d.tokenIn)) {
          seen.add(d.tokenIn);
          extras.push(d.tokenIn);
        }
        if (!seen.has(d.tokenOut)) {
          seen.add(d.tokenOut);
          extras.push(d.tokenOut);
        }
      }
      const domain = [...base, ...extras];

      // 4) Sort rows by domain order: tokenIn primary, tokenOut secondary
      const indexBy = new Map(domain.map((d, i) => [d, i]));
      const idx = (k: string) =>
        indexBy.has(k) ? (indexBy.get(k)!) : Number.MAX_SAFE_INTEGER;

      heatmapData.sort((a, b) => {
        const ai = idx(a.tokenIn);
        const bi = idx(b.tokenIn);
        if (ai !== bi) return ai - bi;
        return idx(a.tokenOut) - idx(b.tokenOut);
      });

      return { heatmapData, xDomain: domain, yDomain: domain };
    }, [poolEvents, product?.poolConstituents]);

    console.log('heatmapData', heatmapData, xDomain, yDomain);
    const chartElRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<ReturnType<typeof AgCharts.create> | null>(null);

    // --- itemStyler (unchanged)
    function itemStyler(params: any): AgHeatmapSeriesStyle | undefined {
      const { datum, colorKey = 'usd', highlighted, fill } = params;

      const v = Number(datum[colorKey]);
      const min = Number(params.context?.min ?? 0);
      const max = Number(params.context?.max ?? 1);
      const t =
        isFinite(v) && max > min
          ? Math.min(1, Math.max(0, (v - min) / (max - min)))
          : 0.5;

      const fillOpacity = 0.2 + 0.6 * t;

      const brighten = (css: string, amt = 0.1) => {
        try {
          const ctx = document.createElement('canvas').getContext('2d')!;
          ctx.fillStyle = css;
          const { data } = (() => {
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillRect(0, 0, 1, 1);
            return ctx.getImageData(0, 0, 1, 1);
          })();

          const r = data[0],
            g = data[1],
            b = data[2];

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
          const Rl = toLin(r),
            Gl = toLin(g),
            Bl = toLin(b);
          const nR = toSrgb(Rl + (1 - Rl) * tAmt);
          const nG = toSrgb(Gl + (1 - Gl) * tAmt);
          const nB = toSrgb(Bl + (1 - Bl) * tAmt);

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

      if (!isMobile || !container || heatmapData.length === 0) {
        if (chartRef.current) {
          chartRef.current.destroy();
          chartRef.current = null;
        }
        return;
      }

      // Map token addresses to pool constituent names (fallback to truncated address)
      const nameMap: Record<string, string> = Object.fromEntries(
        (product?.poolConstituents ?? [])
          .filter((c) => c?.address)
          .map((c) => [
            String(c.address).toLowerCase(),
            c.coin || String(c.address),
          ])
      );

      const addrToName = (addr?: string) => {
        const a = String(addr ?? '').toLowerCase();
        const name = nameMap[a];
        return name;
      };

      const options: AgChartOptions = {
        container,
        data: heatmapData,
        theme: {
          baseTheme: chartTheme,
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
            itemStyler: itemStyler,
            type: 'heatmap',
            xKey: 'tokenIn',
            xName: 'Token In',
            yKey: 'tokenOut',
            yName: 'Token Out',
            colorKey: 'usd',
            colorName: 'USD',
            // ensure axes follow the same canonical order used for sorting
            xDomain,
            yDomain,
            // (rest unchanged)
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
                title: `${addrToName(datum.tokenIn)} → ${addrToName(
                  datum.tokenOut
                )}`,
                content: `$${Number(datum.usd).toLocaleString('en-US', {
                  maximumFractionDigits: 0,
                })}`,
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
    }, [isMobile, heatmapData, xDomain, yDomain, product?.poolConstituents, chartTheme]);

    const showSpinner = loading && !error && rowData.length === 0;

    /* -------------------------------- RENDER -------------------------------- */
    return (
      <Row id="events" style={{ marginTop: 20 }}>
        <Col
          span={24}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'start',
            paddingLeft: 8,
            borderBottom: '1px solid var(--primary-lighter)',
          }}
        >
          <Title
            level={4}
            style={{
              width: '90%',
              marginBottom: 0,
              paddingLeft: 8,
              paddingTop: 8,
            }}
          >
            <Row>
              <Col span={20}>
                <h4 hidden={isMobile}>Events</h4>
              </Col>
              {!isMobile && (
                <Col span={4} style={{ textAlign: 'right' }}>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => gridRef.current?.api?.exportDataAsCsv()}
                    style={{ marginTop: 20 }}
                  >
                    Download CSV
                  </Button>
                </Col>
              )}
            </Row>
          </Title>
        </Col>

        <Col
          span={24}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            paddingLeft: 12,
            paddingRight: 12,
            width: '100%',
          }}
        >
          {showSpinner ? (
            <Spin />
          ) : error && rowData.length === 0 ? (
            <div>Failed to load events.</div>
          ) : isMobile ? (
            <div style={{ width: '100%' }}>
              {!heatmapData.length ? (
                <Empty description="No swap data" />
              ) : (
                <div
                  ref={chartElRef}
                  id="myChart"
                  style={{
                    width: '100%',
                    height: 520,
                    background: 'transparent',
                    borderRadius: 16,
                  }}
                />
              )}
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              <div
                className={darkThemeAg}
                style={{ height: 700, width: '100%' }}
              >
                <AgGridReact
                  ref={gridRef}
                  rowData={rowData}
                  gridOptions={gridOptions}
                  columnDefs={columnDefs}
                  sideBar={{
                    toolPanels: [
                      {
                        id: 'columns',
                        labelDefault: 'Columns',
                        labelKey: 'columns',
                        iconKey: 'columns',
                        toolPanel: 'agColumnsToolPanel',
                        minWidth: 100,
                        maxWidth: 300,
                        width: 200,
                      },
                      {
                        id: 'filters',
                        labelDefault: 'Filters',
                        labelKey: 'filters',
                        iconKey: 'filter',
                        toolPanel: 'agFiltersToolPanel',
                        minWidth: 100,
                        maxWidth: 300,
                        width: 200,
                      },
                    ],
                    position: 'right',
                    defaultToolPanel: 'none',
                  }}
                />
              </div>
            </div>
          )}
        </Col>
      </Row>
    );
  }
);
