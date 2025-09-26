// hypersurgehook.tsx
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Row, Col, Typography, Card, Space, Tag, Tooltip, Steps, Button } from 'antd';
import { AgCharts } from 'ag-charts-react';
import 'ag-charts-enterprise';

const { Title, Text, Paragraph } = Typography;

type StepKind = 'retail-intent' | 'retail-fee' | 'arb-intent' | 'arb-fee';

type RowDatum = {
  deviation: number;
  noiseFee: number;
  arbFee: number;

  bandLow: number | null;
  bandHigh: number | null;

  vlineLow: number | null;
  vlineHigh: number | null;

  startLow: number | null;
  startHigh: number | null;
  endLow: number | null;
  endHigh: number | null;

  startLabelY: number | null;
  startLabel?: string;
  endLabelY: number | null;
  endLabel?: string;

  vLabelY: number | null;
  vLabel?: string;

  noiseMarkerFee: number | null;
  noiseLabel?: string;
  arbMarkerFee: number | null;
  arbLabel?: string;
};

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

export default function HyperSurgeHook() {
  const capDev = 0.25;
  const nearZero = 0.02;
  const highDev = 0.12;

  const baseNoise = 0.003, maxNoise = 0.010, noiseTau = 0.10;
  const baseArb   = 0.008, maxArb   = 0.020;

  const feeNoise = useCallback(
    (d: number) =>
      d <= noiseTau ? baseNoise : baseNoise + (maxNoise - baseNoise) * clamp((d - noiseTau) / (capDev - noiseTau), 0, 1),
    []
  );
  const feeArb = useCallback(
    (d: number) => baseArb + (maxArb - baseArb) * clamp(d / capDev, 0, 1),
    []
  );

  const yMax = Math.max(maxArb, maxNoise) * 1.05;

  const steps: { title: string; desc: string; kind: StepKind }[] = [
    { title: 'Retail wants to trade',   desc: 'A retail trader wants to trade. This trade will naturally deviate the pool price away from the market price.', kind: 'retail-intent' },
    { title: 'Retail gets low fee',     desc: 'The retail trader is charged a low competitive fee based on how much the trade distorts the pool price.',     kind: 'retail-fee' },
    { title: 'Arb opportunity appears', desc: 'This creates an arbitrage opportunity as the pool price is not the market price.',                           kind: 'arb-intent' },
    { title: 'Arbitrage closes gap',    desc: 'An arbitrageur takes the arb opportunity and LPs get a large cut based on how large the arb opportunity was to begin with.', kind: 'arb-fee' },
  ];

  // ---- App-state style cycling (pattern like StrategySummary) ----
  const [autoCycle, setAutoCycle] = useState<boolean>(true);
  const [stepIdx, setStepIdx] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (autoCycle) {
      interval = setInterval(() => {
        setStepIdx((prev) => (prev + 1) % steps.length);
      }, 10000); // 10s governs step change
    }
    return () => { if (interval) clearInterval(interval); };
  }, [autoCycle, steps.length]);

  const idxForDev = useCallback((dev: number) => clamp(Math.round((dev / capDev) * 100), 0, 100), []);
  const inlineY = yMax * 0.06;

  const grid = useMemo<RowDatum[]>(() => {
    const rows: RowDatum[] = [];
    for (let i = 0; i <= 100; i++) {
      const deviation = +(capDev * (i / 100)).toFixed(4);
      rows.push({
        deviation,
        noiseFee: feeNoise(deviation),
        arbFee: feeArb(deviation),

        bandLow: null, bandHigh: null,
        vlineLow: null, vlineHigh: null,

        startLow: null, startHigh: null,
        endLow: null, endHigh: null,

        startLabelY: null, startLabel: undefined,
        endLabelY: null, endLabel: undefined,

        vLabelY: null, vLabel: undefined,

        noiseMarkerFee: null, noiseLabel: undefined,
        arbMarkerFee: null, arbLabel: undefined,
      });
    }
    return rows;
  }, [feeNoise, feeArb]);

  const mutBand = (rows: RowDatum[], from: number, to: number) => {
    const i0 = idxForDev(Math.min(from, to));
    const i1 = idxForDev(Math.max(from, to));
    for (let i = i0; i <= i1; i++) { rows[i].bandLow = 0; rows[i].bandHigh = yMax; }
  };
  const mutVLine = (rows: RowDatum[], dev: number) => {
    const i = idxForDev(dev);
    [i, i + 1].forEach(k => { if (rows[k]) { rows[k].vlineLow = 0; rows[k].vlineHigh = yMax; } });
  };
  const mutStartOnly = (rows: RowDatum[], dev: number) => {
    const i = idxForDev(dev);
    [i, i + 1].forEach(k => { if (rows[k]) { rows[k].startLow = 0; rows[k].startHigh = yMax; } });
  };
  const mutEndOnly = (rows: RowDatum[], dev: number) => {
    const i = idxForDev(dev);
    [i, i + 1].forEach(k => { if (rows[k]) { rows[k].endLow = 0; rows[k].endHigh = yMax; } });
  };

  // End-state per step (no per-step interpolation; 10s only controls step index)
  const data = useMemo<RowDatum[]>(() => {
    const rows = grid.map(r => ({
      ...r,
      bandLow: null, bandHigh: null,
      vlineLow: null, vlineHigh: null,
      startLow: null, startHigh: null,
      endLow: null, endHigh: null,
      startLabelY: null, startLabel: undefined,
      endLabelY: null, endLabel: undefined,
      vLabelY: null, vLabel: undefined,
      noiseMarkerFee: null, noiseLabel: undefined,
      arbMarkerFee: null, arbLabel: undefined,
    }));

    const kind = steps[stepIdx].kind;

    if (kind === 'retail-intent') {
      mutBand(rows, nearZero, highDev);
      mutStartOnly(rows, nearZero);
      rows[idxForDev(nearZero)].startLabelY = inlineY;
      rows[idxForDev(nearZero)].startLabel = 'Current pool price';

      mutEndOnly(rows, highDev);
      rows[idxForDev(highDev)].endLabelY = inlineY;
      rows[idxForDev(highDev)].endLabel = 'Post Trade Price';
    }

    if (kind === 'retail-fee') {
      mutEndOnly(rows, highDev);
      mutVLine(rows, highDev);
      rows[idxForDev(highDev)].vLabelY = yMax * 0.92;
      rows[idxForDev(highDev)].vLabel = 'Retail Trade Executing';

      const ni = idxForDev(highDev);
      rows[ni].noiseMarkerFee = feeNoise(highDev);
      rows[ni].noiseLabel = 'noise trade fee applied';
    }

    if (kind === 'arb-intent') {
      mutBand(rows, nearZero, highDev);
      mutStartOnly(rows, highDev);
      rows[idxForDev(highDev)].startLabelY = inlineY;
      rows[idxForDev(highDev)].startLabel = 'Current pool price';

      mutEndOnly(rows, nearZero);
      rows[idxForDev(nearZero)].endLabelY = inlineY;
      rows[idxForDev(nearZero)].endLabel = 'Arb opportunity';
    }

    if (kind === 'arb-fee') {
      mutEndOnly(rows, nearZero);
      mutVLine(rows, nearZero);
      rows[idxForDev(nearZero)].vLabelY = yMax * 0.92;
      rows[idxForDev(nearZero)].vLabel = 'Arb Trade Executing';

      const ai = idxForDev(highDev);
      rows[ai].arbMarkerFee = feeArb(highDev);
      rows[ai].arbLabel = 'arb trade fee applied';
    }

    return rows;
  }, [grid, stepIdx, feeNoise, feeArb]);

  const noiseOpacity = steps[stepIdx].kind === 'retail-intent' || steps[stepIdx].kind === 'retail-fee' ? 1 : 0.25;
  const arbOpacity   = steps[stepIdx].kind === 'arb-intent'   || steps[stepIdx].kind === 'arb-fee'   ? 1 : 0.25;

  const xFmt = ({ value }: any) => `${Math.round(value * 100)}%`;
  const yFmt = ({ value }: any) => `${(value * 100).toFixed(2)}%`;
  const ttNoise = ({ datum }: any) => ({ content: `Noise • δ ${(datum.deviation * 100).toFixed(1)}% • ${(datum.noiseFee * 100).toFixed(2)}%` });
  const ttArb   = ({ datum }: any) => ({ content: `Arb • δ ${(datum.deviation * 100).toFixed(1)}% • ${(datum.arbFee * 100).toFixed(2)}%` });
  const lblNoise = ({ datum }: any) => datum.noiseLabel ?? '';
  const lblArb   = ({ datum }: any) => datum.arbLabel ?? '';
  const lblStart = ({ datum }: any) => datum.startLabel ?? '';
  const lblEnd   = ({ datum }: any) => datum.endLabel ?? '';
  const lblVline = ({ datum }: any) => datum.vLabel ?? '';

  const options = useMemo<any>(() => ({
    autoSize: true,
    background: { visible: false },
    padding: { top: 8, right: 16, bottom: 8, left: 16 },
    legend: { position: 'bottom' },
    title: { text: 'Applied fee vs. deviation (δ)', spacing: 8 },
    data,
    series: [
      { id: 'noise-curve', type: 'line', xKey: 'deviation', yKey: 'noiseFee', yName: 'Noise (worsens deviation)', strokeWidth: 2, strokeOpacity: noiseOpacity, marker: { enabled: false }, tooltip: { renderer: ttNoise } },
      { id: 'arb-curve',   type: 'line', xKey: 'deviation', yKey: 'arbFee',   yName: 'Arb (improves deviation)',   strokeWidth: 2, strokeOpacity: arbOpacity,   marker: { enabled: false }, tooltip: { renderer: ttArb } },

      { id: 'intent-band', type: 'area', xKey: 'deviation', yKey: 'bandHigh',  yLowKey: 'bandLow', visibleInLegend: false, fillOpacity: 0.08 },

      { id: 'start-line',  type: 'area', xKey: 'deviation', yKey: 'startHigh', yLowKey: 'startLow', visibleInLegend: false, fillOpacity: 0.25, stroke: 'rgba(255,255,255,0.9)', strokeWidth: 2 },
      { id: 'end-line',    type: 'area', xKey: 'deviation', yKey: 'endHigh',   yLowKey: 'endLow',   visibleInLegend: false, fillOpacity: 0.25, stroke: 'rgba(255,255,255,0.9)', strokeWidth: 2 },

      { id: 'start-pin',   type: 'scatter', xKey: 'deviation', yKey: 'startLabelY', visibleInLegend: false, marker: { size: 0 }, label: { enabled: true, formatter: lblStart } },
      { id: 'end-pin',     type: 'scatter', xKey: 'deviation', yKey: 'endLabelY',   visibleInLegend: false, marker: { size: 0 }, label: { enabled: true, formatter: lblEnd } },

      { id: 'vline',       type: 'area', xKey: 'deviation', yKey: 'vlineHigh', yLowKey: 'vlineLow', visibleInLegend: false, fillOpacity: 0.18, stroke: '#52c41a', strokeOpacity: 0.9 },
      { id: 'vline-pin',   type: 'scatter', xKey: 'deviation', yKey: 'vLabelY', visibleInLegend: false, marker: { size: 0 }, label: { enabled: true, formatter: lblVline } },

      { id: 'noise-marker', type: 'scatter', xKey: 'deviation', yKey: 'noiseMarkerFee', yName: 'noise trade fee applied', marker: { size: 10 }, label: { enabled: true, formatter: lblNoise } },
      { id: 'arb-marker',   type: 'scatter', xKey: 'deviation', yKey: 'arbMarkerFee',   yName: 'arb trade fee applied',   marker: { size: 10 }, label: { enabled: true, formatter: lblArb } },
    ],
    axes: [
      { type: 'number', position: 'bottom', title: { text: 'Deviation δ (pool vs oracle)' }, label: { formatter: xFmt }, min: 0, max: capDev, nice: false },
      { type: 'number', position: 'left',   title: { text: 'Applied fee' },                 label: { formatter: yFmt }, min: 0, max: yMax, nice: false },
    ],
    animation: { enabled: true },
    theme: { baseTheme: 'ag-default-dark', overrides: { common: { background: { fill: 'transparent' } } } },
  }), [data, noiseOpacity, arbOpacity]);

  return (
    <Row style={{ width: '100%', background: '#0f1a27', padding: '64px 48px' }}>
      <Col span={24}>
        <Row gutter={[24, 24]} justify="space-between" align="top">
          <Col span={8}>
            <Card bordered={false} style={{ background: 'linear-gradient(180deg, #142233 0%, #0f1a27 100%)', color: 'white', height: '100%' }} bodyStyle={{ padding: 24 }}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Title level={3} style={{ color: '#fff', marginBottom: 0 }}>HyperSurge Hook</Title>
                <Text style={{ color: '#c7b283' }}>Noise-light, arb-premium fees for Balancer V3 (Weighted)</Text>
                <Paragraph style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 0 }}>
                  Retail trades pay competitive fees; arbitrage pays a premium that accrues to LPs. The four-step cycle shows how fees adapt.
                </Paragraph>
                <Space size={[8, 8]} wrap>
                  <Tag color="gold">Oracle-aware</Tag>
                  <Tag color="blue">Direction-aware</Tag>
                  <Tag color="geekblue">Weighted Pools</Tag>
                  <Tag color="volcano">Arb Premium</Tag>
                  <Tooltip title="Falls back to pool static fee on oracle issues"><Tag color="default">Fail-open</Tag></Tooltip>
                </Space>
              </Space>
            </Card>
          </Col>

          <Col span={16}>
            <Card bordered={false} style={{ background: '#0b1622', color: 'white' }} bodyStyle={{ padding: 16 }}>
              <Card bordered={false} style={{ marginBottom: 8, background: '#0e1a28' }} bodyStyle={{ padding: 12, minHeight: 64 }}>
                <Steps
                  current={stepIdx}
                  progressDot
                  size="small"
                  items={steps.map((s) => ({ title: s.title, description: s.desc.split('.')[0] + '.' }))}
                />
              </Card>
              <div style={{ height: 380 }}>
                <AgCharts options={options} />
              </div>
              <Row style={{ marginTop: 12 }}>
                <Col span={24}>
                  <Paragraph style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 0 }}>
                    {steps[stepIdx].desc}
                  </Paragraph>
                </Col>
              </Row>
              <Row style={{ marginTop: 8 }}>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Button size="small" onClick={() => setAutoCycle(!autoCycle)}>
                    {autoCycle ? 'Pause' : 'Resume'}
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
