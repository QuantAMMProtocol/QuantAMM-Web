import { FC, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Collapse,
  Divider,
  InputNumber,
  Progress,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import { Product } from '../../../../models';
import styles from './productDetailSummary.module.scss';

type Bigish = string | number | bigint;

const { Text } = Typography;
const { Panel } = Collapse;

interface QuantAmmWeightedStrategyState {
  oracleStalenessThreshold?: Bigish;
  poolRegistry?: Bigish;

  lambda?: Bigish[];
  epsilonMax?: Bigish;
  absoluteWeightGuardRail?: Bigish;
  maxTradeSizeRatio?: Bigish;
  updateInterval?: Bigish;

  weightsAtLastUpdateInterval?: Bigish[];
  weightBlockMultipliers?: Bigish[];

  lastUpdateIntervalTime?: Bigish;
  lastInterpolationTimePossible?: Bigish;

  runner?: string;
  rule?: string;

  gradientIntermediates?: Bigish[];
  movingAverageIntermediates?: Bigish[];
}

function fmtAddr(addr?: string) {
  if (!addr) return '—';
  const s = String(addr);
  return s.length > 12 ? `${s.slice(0, 6)}…${s.slice(-4)}` : s;
}

function normaliseWeights(raw: Bigish[] | undefined, n: number): number[] {
  if (!n) return [];
  const base = Array.from({ length: n }, () => 1 / n);

  if (!Array.isArray(raw) || raw.length === 0) return base;

  const sliced = raw.slice(0, n).map((x) => clamp(toFractionWeight(x), 0, 1));
  const sum = sliced.reduce((a, b) => a + b, 0);

  if (!Number.isFinite(sum) || sum <= 0) return base;
  return sliced.map((x) => x / sum);
}

/**
 * Convert stored weight to fraction [0..1].
 */
function toFractionWeight(v: Bigish): number {
  const n = toNumber(v);
  if (n === null) return 0;

  if (Math.abs(n) > 1_000_000) return n / 1e18;
  if (Math.abs(n) <= 1.5) return n;
  if (Math.abs(n) <= 200) return n / 100;
  return n;
}

function fmtIntermediate2dp(v: Bigish | undefined): string {
  if (v === undefined) return '—';
  const n = toNumber(v);
  if (n === null) return '—';
  const scaled = Math.abs(n) > 1e9 ? n / 1e18 : n;
  if (!Number.isFinite(scaled)) return '—';
  return scaled.toFixed(2);
}

/* ---------- factsheet parsing ---------- */

function deriveTokenUniverse(product: Product, factsheet: any): string[] {
  const p = product as any;
  const out: string[] = [];

  const pushMany = (vals: unknown[]) => {
    safeArray<unknown>(vals)
      .map((x) => (x == null ? '' : String(x)))
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => out.push(s));
  };

  if (Array.isArray(p?.tokenSymbols)) pushMany(p.tokenSymbols);
  if (Array.isArray(p?.tokens))
    pushMany(p.tokens.map((t: any) => t?.symbol ?? t?.tokenSymbol ?? t?.name));
  if (Array.isArray(p?.poolTokens))
    pushMany(
      p.poolTokens.map((t: any) => t?.symbol ?? t?.tokenSymbol ?? t?.name)
    );
  if (Array.isArray(p?.assets))
    pushMany(p.assets.map((a: any) => a?.symbol ?? a?.ticker ?? a?.name));

  const trained = safeArray<FactsheetTrainedParameter>(
    factsheet?.trainedParameters
  );
  trained.forEach((g) => {
    safeArray(g?.variations).forEach((v: any) => {
      safeArray<string>(v?.value).forEach((line) => {
        const s = String(line ?? '');
        const parts = s.split(' - ');
        if (parts.length === 2) {
          const sym = parts[0].trim();
          if (sym) out.push(sym);
        }
      });
    });
  });

  return out.filter((x, i) => out.indexOf(x) === i);
}

function findVariation(
  trainedParameters: FactsheetTrainedParameter[] | undefined,
  nameIncludes: string
) {
  const lower = nameIncludes.toLowerCase();
  for (const group of trainedParameters ?? []) {
    for (const v of group.variations ?? []) {
      if (
        String(v.name ?? '')
          .toLowerCase()
          .includes(lower)
      )
        return v;
    }
  }
  return undefined;
}

function parseAssetValues(lines: string[], tokenUniverse: string[]) {
  const rows: { asset: string; value: string }[] = [];
  lines.forEach((line) => {
    const s = String(line ?? '');
    const parts = s.split(' - ');
    if (parts.length === 2) {
      const asset = parts[0].trim();
      const value = parts[1].trim();
      if (tokenUniverse.includes(asset)) rows.push({ asset, value });
    }
  });
  return rows;
}

/* -------------------------- strategy stub -------------------------- */

async function predictWeightsStub(args: {
  currentWeights: number[]; // fractions
  tomorrowPrices: (number | null)[];
  epsilonMax?: number | null; // fraction
  absGuard?: number | null; // fraction
}): Promise<number[]> {
  await new Promise((r) => setTimeout(r, 550));

  const { currentWeights, tomorrowPrices, epsilonMax, absGuard } = args;
  const n = currentWeights.length;

  const p = tomorrowPrices.map((x) =>
    typeof x === 'number' && Number.isFinite(x) && x > 0 ? x : 1
  );
  const pAvg = p.reduce((a, b) => a + b, 0) / Math.max(1, p.length);

  const raw = currentWeights.map((w, i) => w * (p[i] / (pAvg || 1)));
  const rawSum = raw.reduce((a, b) => a + b, 0) || 1;
  const target = raw.map((x) => x / rawSum);

  const eps =
    typeof epsilonMax === 'number' && Number.isFinite(epsilonMax)
      ? epsilonMax
      : null;
  let next = target.map((t, i) => {
    const c = currentWeights[i];
    if (eps === null) return t;
    const diff = t - c;
    return c + clamp(diff, -eps, eps);
  });

  const rail =
    typeof absGuard === 'number' && Number.isFinite(absGuard) ? absGuard : null;
  if (rail !== null) next = next.map((x) => Math.max(rail, x));

  const sum = next.reduce((a, b) => a + b, 0) || 1;
  next = next.map((x) => x / sum);

  return next.slice(0, n);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function safeArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function toNumber(v: Bigish | undefined | null): number | null {
  if (v === undefined || v === null) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  try {
    if (typeof v === 'bigint') return Number(v);
    const asNum = Number(v);
    return Number.isFinite(asNum) ? asNum : null;
  } catch {
    return null;
  }
}

interface FactsheetTrainedParameter {
  name: string;
  variations: {
    name: string;
    tooltip?: string;
    value: string[];
  }[];
}

//TODO CH split components.
export const StrategyWorkflowCard: FC<{
  product: Product;
  factsheet?: any;
}> = ({ product, factsheet }) => {
  const trainedParameters = useMemo(
    () => safeArray<FactsheetTrainedParameter>(factsheet?.trainedParameters),
    [factsheet]
  );

  const strategyState = ((product as any)?.quantAmmWeightedParams ??
    (product as any)?.strategyState ??
    (product as any)?.poolState?.quantAmmWeightedParams) as
    | QuantAmmWeightedStrategyState
    | undefined;

  const tokenUniverse = useMemo(
    () => deriveTokenUniverse(product, factsheet),
    [product, factsheet]
  );

  const state: QuantAmmWeightedStrategyState | undefined =
    strategyState ??
    (product as any)?.quantAmmWeightedParams ??
    (product as any)?.strategyState ??
    (product as any)?.poolState?.quantAmmWeightedParams;

  const currentWeights = useMemo(() => {
    const raw = safeArray<Bigish>(state?.weightsAtLastUpdateInterval);
    return normaliseWeights(raw, tokenUniverse.length);
  }, [state?.weightsAtLastUpdateInterval, tokenUniverse.length]);

  const epsilonMax = useMemo(() => {
    const n = toNumber(state?.epsilonMax);
    if (n === null) return null;
    return Math.abs(n) > 1e9 ? n / 1e18 : n;
  }, [state?.epsilonMax]);

  const absGuard = useMemo(() => {
    const n = toNumber(state?.absoluteWeightGuardRail);
    if (n === null) return null;
    if (n > 1.5 && n <= 100) return n / 100;
    return Math.abs(n) > 1e9 ? n / 1e18 : n;
  }, [state?.absoluteWeightGuardRail]);

  const maxTradeSizeRatio = useMemo(() => {
    const n = toNumber(state?.maxTradeSizeRatio);
    if (n === null) return null;
    if (n > 1.5 && n <= 100) return n / 100;
    return Math.abs(n) > 1e9 ? n / 1e18 : n;
  }, [state?.maxTradeSizeRatio]);

  const guardRailsVar = useMemo(
    () => findVariation(trainedParameters, 'guard'),
    [trainedParameters]
  );
  const speedLimitVar = useMemo(
    () => findVariation(trainedParameters, 'speed'),
    [trainedParameters]
  );
  const lambdaVar = useMemo(
    () => findVariation(trainedParameters, 'lambda'),
    [trainedParameters]
  );
  const exponentVar = useMemo(
    () => findVariation(trainedParameters, 'exponent'),
    [trainedParameters]
  );
  const aggressivenessVar = useMemo(
    () => findVariation(trainedParameters, 'aggressiveness'),
    [trainedParameters]
  );
  const kappaVar = useMemo(
    () => findVariation(trainedParameters, 'k'),
    [trainedParameters]
  ); // "k" == kappa

  const factsheetParamTable = useMemo(() => {
    const rows: {
      key: string;
      parameter: string;
      values: { asset: string; value: string }[];
      tooltip?: string;
    }[] = [];

    const add = (label: string, v: any, forceAll?: boolean) => {
      if (!v) return;
      const vals = safeArray<string>(v.value);
      const parsed = forceAll
        ? vals.map((x) => ({ asset: 'All', value: String(x) }))
        : parseAssetValues(vals, tokenUniverse);

      rows.push({
        key: `${label}`,
        parameter: label,
        values: parsed.length
          ? parsed
          : vals.map((x) => ({ asset: 'All', value: String(x) })),
        tooltip: v.tooltip,
      });
    };

    add('Guard rails', guardRailsVar, true);
    add('Speed limit (epsilon max)', speedLimitVar, true);
    add('Lambda', lambdaVar);
    add('Exponent', exponentVar);
    add('Aggressiveness', aggressivenessVar);
    add('Kappa (k)', kappaVar);

    return rows;
  }, [
    guardRailsVar,
    speedLimitVar,
    lambdaVar,
    exponentVar,
    aggressivenessVar,
    kappaVar,
    tokenUniverse,
  ]);

  const [tomorrowPrices, setTomorrowPrices] = useState<
    Record<string, number | null>
  >(() => {
    const init: Record<string, number | null> = {};
    tokenUniverse.forEach((t) => (init[t] = null));
    return init;
  });

  const [predicting, setPredicting] = useState(false);
  const [predicted, setPredicted] = useState<number[] | null>(null);

  const onPredict = async () => {
    if (!tokenUniverse.length) {
      await message.warning('Token list not available.');
      return;
    }
    if (!currentWeights.length) {
      await message.warning('Current weights not available.');
      return;
    }

    setPredicting(true);
    try {
      const tomorrowArr = tokenUniverse.map((t) => tomorrowPrices[t] ?? null);
      const next = await predictWeightsStub({
        currentWeights,
        tomorrowPrices: tomorrowArr,
        epsilonMax: epsilonMax ?? null,
        absGuard: absGuard ?? null,
      });
      setPredicted(next);
    } catch (e) {
      console.error(e);
      await message.error('Failed to predict weights.');
    } finally {
      setPredicting(false);
    }
  };

  const ruleSummaryRows = useMemo(
    () => [
      {
        k: 'Update interval (sec)',
        v: state?.updateInterval != null ? String(state.updateInterval) : '—',
      },
      { k: 'Epsilon max', v: epsilonMax != null ? epsilonMax.toFixed(4) : '—' },
      {
        k: 'Abs guard rail',
        v: absGuard != null ? `${(absGuard * 100).toFixed(2)}%` : '—',
      },
      {
        k: 'Max trade size ratio',
        v:
          maxTradeSizeRatio != null
            ? `${(maxTradeSizeRatio * 100).toFixed(2)}%`
            : '—',
      },
      { k: 'Rule', v: fmtAddr(state?.rule) },
      { k: 'Runner', v: fmtAddr(state?.runner) },
      { k: 'Assets', v: tokenUniverse.length ? tokenUniverse.join(', ') : '—' },
    ],
    [state, epsilonMax, absGuard, maxTradeSizeRatio, tokenUniverse]
  );

  const intermediateTableData = useMemo(() => {
    const g = safeArray<Bigish>(state?.gradientIntermediates);
    const m = safeArray<Bigish>(state?.movingAverageIntermediates);

    return tokenUniverse.map((asset, i) => ({
      key: asset,
      asset,
      gradient: fmtIntermediate2dp(g[i]),
      movingAvg: fmtIntermediate2dp(m[i]),
    }));
  }, [
    tokenUniverse,
    state?.gradientIntermediates,
    state?.movingAverageIntermediates,
  ]);

  const currentWeightTableData = useMemo(() => {
    return tokenUniverse.map((asset, i) => {
      const w = currentWeights[i] ?? 0;
      const pct = clamp(w * 100, 0, 100);
      return { key: asset, asset, weightPct: pct };
    });
  }, [tokenUniverse, currentWeights]);

  const newPricesTableData = useMemo(() => {
    return tokenUniverse.map((asset) => ({
      key: asset,
      asset,
      price: tomorrowPrices[asset],
    }));
  }, [tokenUniverse, tomorrowPrices]);

  const predictedTableData = useMemo(() => {
    return tokenUniverse.map((asset, i) => {
      const cur = clamp((currentWeights[i] ?? 0) * 100, 0, 100);
      const pr = predicted
        ? clamp((predicted[i] ?? currentWeights[i] ?? 0) * 100, 0, 100)
        : null;
      const delta = pr != null ? pr - cur : null;
      return { key: asset, asset, current: cur, predicted: pr, delta };
    });
  }, [tokenUniverse, currentWeights, predicted]);

  if (!tokenUniverse.length) {
    return (
      <Card
        className={styles['product-detail-summary__cardDesktop']}
        title={
          <Space size={8}>
            <span>Strategy workflow</span>
            <Tag>Internal visibility</Tag>
          </Space>
        }
      >
        <Alert
          type="warning"
          showIcon
          message="Token universe not available"
          description="This card requires a token list from the product or factsheet."
        />
      </Card>
    );
  }

  return (
    <Card className={styles['product-detail-summary__cardDesktop']}>
      {/* Collapsible & collapsed by default: factsheet parameters */}
      <Collapse
        defaultActiveKey={[]}
        className={styles['product-detail-summary__collapse']}
        bordered={false}
      >
        <Panel
          key="params"
          header={
            <div className={styles['product-detail-summary__collapseHeader']}>
              <Text strong>Rule parameters</Text>
              <Text
                type="secondary"
                className={styles['product-detail-summary__collapseHint']}
              ></Text>
            </div>
          }
        >
          <div className={styles['product-detail-summary__ruleSummaryGrid']}>
            {ruleSummaryRows.map((r) => (
              <div
                key={r.k}
                className={styles['product-detail-summary__ruleSummaryItem']}
              >
                <Text type="secondary">{r.k}</Text>
                <Text>{r.v}</Text>
              </div>
            ))}
          </div>
          <Table
            size="small"
            pagination={false}
            className={styles['product-detail-summary__tableCompact']}
            columns={[
              {
                title: 'Parameter',
                dataIndex: 'parameter',
                key: 'parameter',
                width: 240,
                render: (v: string, row: any) =>
                  row?.tooltip ? (
                    <Tooltip title={row.tooltip}>
                      <Text strong>{v}</Text>
                    </Tooltip>
                  ) : (
                    <Text strong>{v}</Text>
                  ),
              },
              {
                title: 'Values',
                dataIndex: 'values',
                key: 'values',
                render: (vals: { asset: string; value: string }[]) => (
                  <Space size={6} wrap>
                    {vals.map((x, idx) => (
                      <Tag key={`${x.asset}-${idx}`}>
                        {x.asset !== 'All' ? `${x.asset}: ` : ''}
                        {x.value}
                      </Tag>
                    ))}
                  </Space>
                ),
              },
            ]}
            dataSource={factsheetParamTable}
            rowKey="key"
          />
        </Panel>
      </Collapse>

      <Divider className={styles['product-detail-summary__dividerCompact']} />

      {/* 2) Collapsible section: Current weights + Intermediate values (collapsed by default) */}
      <Collapse
        defaultActiveKey={[]}
        className={styles['product-detail-summary__collapse']}
        bordered={false}
      >
        <Panel
          key="current-and-intermediates"
          header={
            <div className={styles['product-detail-summary__collapseHeader']}>
              <span className={styles['product-detail-summary__stepNumber']}>
                2
              </span>
              <Text strong>Current weights & intermediate values</Text>
              <Text
                type="secondary"
                className={styles['product-detail-summary__collapseHint']}
              ></Text>
            </div>
          }
        >
          <div className={styles['product-detail-summary__twoColSection']}>
            {/* Current weights */}
            <div className={styles['product-detail-summary__twoColCard']}>
              <div className={styles['product-detail-summary__twoColTitle']}>
                <Text strong style={{ marginRight: 8 }}>
                  Current weights
                </Text>
                <Tooltip title="Weights at the last update interval (normalised).">
                  <InfoCircleOutlined />
                </Tooltip>
              </div>

              <Table
                size="small"
                pagination={false}
                className={styles['product-detail-summary__tableCompact']}
                columns={[
                  {
                    title: 'Asset',
                    dataIndex: 'asset',
                    key: 'asset',
                    width: 120,
                    render: (v: string) => <Text strong>{v}</Text>,
                  },
                  {
                    title: 'Weight',
                    dataIndex: 'weightPct',
                    key: 'weightPct',
                    render: (v: number) => (
                      <div
                        className={styles['product-detail-summary__weightCell']}
                      >
                        <Tag>{v.toFixed(2)}%</Tag>
                        <Progress percent={clamp(v, 0, 100)} showInfo={false} />
                      </div>
                    ),
                  },
                ]}
                dataSource={currentWeightTableData}
                rowKey="key"
              />
            </div>

            {/* Intermediate values */}
            <div className={styles['product-detail-summary__twoColCard']}>
              <div className={styles['product-detail-summary__twoColTitle']}>
                <Text strong style={{ marginRight: 8 }}>
                  Intermediate values
                </Text>
                <Tooltip title="New subgraph fields rendered to 2dp.">
                  <InfoCircleOutlined />
                </Tooltip>
              </div>

              <Table
                size="small"
                pagination={false}
                className={styles['product-detail-summary__tableCompact']}
                columns={[
                  {
                    title: 'Asset',
                    dataIndex: 'asset',
                    key: 'asset',
                    width: 120,
                    render: (v: string) => <Text strong>{v}</Text>,
                  },
                  {
                    title: 'Gradient (2dp)',
                    dataIndex: 'gradient',
                    key: 'gradient',
                    width: 160,
                    render: (v: string) => <Text code>{v}</Text>,
                  },
                  {
                    title: 'Moving avg (2dp)',
                    dataIndex: 'movingAvg',
                    key: 'movingAvg',
                    width: 180,
                    render: (v: string) => <Text code>{v}</Text>,
                  },
                ]}
                dataSource={intermediateTableData}
                rowKey="key"
              />
            </div>
          </div>
        </Panel>
      </Collapse>

      <Divider className={styles['product-detail-summary__dividerCompact']} />

      <div className={styles['product-detail-summary__twoColSection']}>
        {/* Future prices */}
        <div className={styles['product-detail-summary__twoColCard']}>
          <div className={styles['product-detail-summary__twoColTitle']}>
            <Text strong style={{ marginRight: '8px' }}>
              Tomorrow prices
            </Text>
            <Tooltip title="Per token input. Flask integration is stubbed.">
              <InfoCircleOutlined />
            </Tooltip>
          </div>

          <Table
            size="small"
            pagination={false}
            className={styles['product-detail-summary__tableCompact']}
            columns={[
              {
                title: 'Asset',
                dataIndex: 'asset',
                key: 'asset',
                width: 120,
                render: (v: string) => <Text strong>{v}</Text>,
              },
              {
                title: 'Tomorrow price',
                dataIndex: 'price',
                key: 'price',
                render: (_: any, row: any) => (
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    precision={2}
                    placeholder="Enter price"
                    value={tomorrowPrices[row.asset]}
                    onChange={(val) => {
                      setTomorrowPrices((prev) => ({
                        ...prev,
                        [row.asset]: typeof val === 'number' ? val : null,
                      }));
                    }}
                  />
                ),
              },
            ]}
            dataSource={newPricesTableData}
            rowKey="key"
          />

          <div className={styles['product-detail-summary__workflowActions']}>
            <Button
              type="primary"
              onClick={() => void onPredict()}
              loading={predicting}
            >
              Predict target weights
            </Button>
            <Tag className={styles['product-detail-summary__stubTag']}>
              Flask: stubbed
            </Tag>
          </div>
        </div>

        {/* Predicted weights */}
        <div className={styles['product-detail-summary__twoColCard']}>
          <div className={styles['product-detail-summary__twoColTitle']}>
            <Text strong style={{ marginRight: '8px' }}>
              Predicted weights
            </Text>
            <Tooltip title="Current vs predicted and delta per asset.">
              <InfoCircleOutlined />
            </Tooltip>
          </div>

          <Table
            size="small"
            pagination={false}
            className={styles['product-detail-summary__tableCompact']}
            columns={[
              {
                title: 'Asset',
                dataIndex: 'asset',
                key: 'asset',
                width: 120,
                render: (v: string) => <Text strong>{v}</Text>,
              },
              {
                title: 'Current',
                dataIndex: 'current',
                key: 'current',
                width: 200,
                render: (v: number) => (
                  <div className={styles['product-detail-summary__weightCell']}>
                    <Tag>{v.toFixed(2)}%</Tag>
                    <Progress percent={clamp(v, 0, 100)} showInfo={false} />
                  </div>
                ),
              },
              {
                title: 'Predicted',
                dataIndex: 'predicted',
                key: 'predicted',
                width: 200,
                render: (v: number | null) =>
                  v == null ? (
                    <Text type="secondary">—</Text>
                  ) : (
                    <div
                      className={styles['product-detail-summary__weightCell']}
                    >
                      <Tag color="blue">{v.toFixed(2)}%</Tag>
                      <Progress
                        percent={clamp(v, 0, 100)}
                        showInfo={false}
                        status="active"
                      />
                    </div>
                  ),
              },
              {
                title: 'Δ',
                dataIndex: 'delta',
                key: 'delta',
                width: 90,
                render: (v: number | null) => {
                  if (v == null) return <Text type="secondary">—</Text>;
                  const pos = v >= 0;
                  return (
                    <Tag color={pos ? 'green' : 'red'}>
                      {pos ? '+' : ''}
                      {v.toFixed(2)}%
                    </Tag>
                  );
                },
              },
            ]}
            dataSource={predictedTableData}
            rowKey="key"
          />
        </div>
      </div>
    </Card>
  );
};
