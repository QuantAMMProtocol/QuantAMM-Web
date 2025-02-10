import { FC } from 'react';
import { AnalysisBreakdownTable } from '../../../shared/tables';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';

interface ProductDetailTableProps {
  simulationRunBreakdown?: SimulationRunBreakdown;
}

export const ProductDetailTable: FC<ProductDetailTableProps> = ({
  simulationRunBreakdown,
}) => {
  return (
    <>
      {simulationRunBreakdown && (
        <AnalysisBreakdownTable
          simulationRunBreakdowns={[simulationRunBreakdown]}
        />
      )}
    </>
  );
};
