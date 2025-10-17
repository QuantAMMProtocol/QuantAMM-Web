import { FC, memo } from 'react';
import { AnalysisBreakdownTable } from '../../../shared/tables';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';

interface DesktopTableProps {
  simulationRunBreakdown: SimulationRunBreakdown;
  productId?: string;
}

export const DesktopTable: FC<DesktopTableProps> = memo(function DesktopTable({
  simulationRunBreakdown,
  productId,
}) {
  return (
    <AnalysisBreakdownTable
      simulationRunBreakdowns={[simulationRunBreakdown]}
      productId={productId}
    />
  );
});
