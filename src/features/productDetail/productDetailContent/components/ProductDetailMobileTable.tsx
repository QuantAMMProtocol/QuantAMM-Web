import { FC, memo } from 'react';
import { Card, Collapse, Descriptions, Divider, Empty, Tag, Typography, Select } from 'antd';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';
import { useAnalysisRows, useBucketsAll, useMetricOptions, useDefaultAlpha, useSelectedMetrics, useBucketsSelected } from './useMobileMetrics';
import { toTwoDecimals } from '../utils';

const { Title, Text } = Typography;

interface MobileTableProps {
  simulationRunBreakdown?: SimulationRunBreakdown;
  productId?: string;
}

export const MobileTable: FC<MobileTableProps> = memo(function MobileTable({
  simulationRunBreakdown,
  productId,
}) {
  const rows = useAnalysisRows(simulationRunBreakdown);
  const bucketsAll = useBucketsAll(rows);
  const metricOptions = useMetricOptions(bucketsAll);
  const defaultAlpha = useDefaultAlpha(metricOptions);
  const [selectedMetrics, setSelectedMetrics] = useSelectedMetrics(defaultAlpha);
  const bucketsSelected = useBucketsSelected(bucketsAll, selectedMetrics);

  return (
    <Card
      bordered={false}
      style={{
        background: 'var(--panel-bg, rgba(255,255,255,0.02))',
        borderRadius: 16,
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <Title
          level={4}
          style={{
            margin: 0,
            color: 'var(--secondary-text-color, #d9d9d9)',
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          Analysis Breakdown
        </Title>
        {!!productId && (
          <Tag color="default" style={{ borderRadius: 999 }}>
            {String(productId).slice(0, 6)}…{String(productId).slice(-4)}
          </Tag>
        )}
      </div>

      <Text type="secondary" style={{ display: 'block' }}>
        Select metrics to display. Tap a metric to view benchmarks.
      </Text>

      <div style={{ marginTop: 12, marginBottom: 8 }}>
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Choose metrics"
          options={metricOptions}
          value={selectedMetrics}
          onChange={setSelectedMetrics}
          maxTagCount="responsive"
          size="middle"
        />
      </div>

      <Divider style={{ margin: '12px 0' }} />

      {!bucketsSelected.length ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No metrics selected" />
      ) : (
        <Collapse
          bordered={false}
          style={{ background: 'transparent' }}
          items={bucketsSelected.map((bucket) => ({
            key: bucket.metricName,
            label: (
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Text strong style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {bucket.metricName}
                </Text>
                <Tag>{bucket.items.length}</Tag>
              </div>
            ),
            children: (
              <div style={{ display: 'grid', gap: 8 }}>
                {bucket.items.map(({ benchmark, value }, i) => {
                  const isNA =
                    typeof benchmark === 'string' &&
                    benchmark.trim().toLowerCase() === 'n/a';

                  return (
                    <Card
                      key={`${bucket.metricName}::${benchmark}::${i}`}
                      size="small"
                      bordered
                      style={{ borderRadius: 12 }}
                      bodyStyle={{ padding: 12 }}
                    >
                      <Descriptions
                        size="small"
                        column={1}
                        colon={false}
                        labelStyle={{ width: 160, color: 'var(--muted, #9aa0a6)' }}
                        contentStyle={{ justifyContent: 'flex-end', textAlign: 'right' }}
                      >
                        {!isNA && (
                          <Descriptions.Item label="Benchmark">
                            <Text style={{ fontWeight: 500 }}>{benchmark}</Text>
                          </Descriptions.Item>
                        )}
                        <Descriptions.Item label="Value">
                          <Text style={{ fontWeight: 600 }}>{toTwoDecimals(value)}</Text>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  );
                })}
              </div>
            ),
          }))}
        />
      )}
    </Card>
  );
});
