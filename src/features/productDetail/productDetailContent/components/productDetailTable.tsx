import { FC, memo } from 'react';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';

import { DesktopTable } from './ProductDetailDesktopTable';
import { MobileTable } from './ProductDetailMobileTable';

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
      <DesktopTable simulationRunBreakdown={simulationRunBreakdown} productId={productId} />
    ) : null;
  }

  return (
    <MobileTable
      simulationRunBreakdown={simulationRunBreakdown}
      productId={productId}
    />
  );
});
