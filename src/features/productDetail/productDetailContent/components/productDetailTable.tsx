import { FC, memo } from 'react';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';

import { MobileTable } from './ProductDetailMobileTable';
import { AnalysisSimplifiedBreakdownTable } from '../../../simulationResults/breakdowns/simulationRunPerformanceSimpleTable';

export interface ProductDetailTableProps {
  simulationRunBreakdown?: SimulationRunBreakdown;
  productId?: string;
  isMobile?: boolean;
}

export const ProductDetailTable: FC<ProductDetailTableProps> = memo(function ProductDetailTable({
  simulationRunBreakdown,
  productId,
  isMobile,
}) {
  if (!isMobile) {
    return simulationRunBreakdown ? (
          <AnalysisSimplifiedBreakdownTable
            simulationRunBreakdowns={[simulationRunBreakdown]}
            benchmarkBreakdown={null}
            visibleMetrics={[...(simulationRunBreakdown.simulationRunResultAnalysis?.return_analysis.map(x => x.metricName) ?? []),
            ...(simulationRunBreakdown.simulationRunResultAnalysis?.benchmark_analysis.filter(x => x.benchmarkName != "benchmark_return_analysis").map(x => x.metricName) ?? [])]}
          />
    ) : null;
  }

  return (
    <MobileTable
      simulationRunBreakdown={simulationRunBreakdown}
      productId={productId}
    />
  );
});
