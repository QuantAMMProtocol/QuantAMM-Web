import { FC } from 'react';
import { AnalysisBreakdownTable } from '../../../shared/tables';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';

interface ProductDetailTableProps {
  simulationRunBreakdown?: SimulationRunBreakdown;
  productId?: string;
}

export const ProductDetailTable: FC<ProductDetailTableProps> = ({
  simulationRunBreakdown,
  productId,
}) => {
  return (
    <>
      {simulationRunBreakdown && (
        <AnalysisBreakdownTable
          simulationRunBreakdowns={[simulationRunBreakdown]}
          productId={productId}
        />
      )}
    </>
  );
};
