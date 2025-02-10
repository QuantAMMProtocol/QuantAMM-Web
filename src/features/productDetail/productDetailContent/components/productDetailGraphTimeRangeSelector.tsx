import { Radio, RadioChangeEvent, Typography } from 'antd';

import styles from '../productDetailPoolGraph.module.scss';
import { TimeRange, timeRanges } from '../../../../models';
import { useAppDispatch } from '../../../../app/hooks';
import { setPoolDetailSelectedGraphRange } from '../../../productExplorer/productExplorerSlice';

const { Text } = Typography;

interface ProductDetailGraphTimeRangeSelectorProps {
  selectedTimeRange: TimeRange;
}

export const ProductDetailGraphTimeRangeSelector = ({
  selectedTimeRange,
}: ProductDetailGraphTimeRangeSelectorProps) => {
  const dispatch = useAppDispatch();

  const handleTimeRangeChange = (event: RadioChangeEvent) => {
    dispatch(setPoolDetailSelectedGraphRange(event.target.value as TimeRange));
  };

  return (
    <div className={styles['product-detail-graph__buttons']}>
      <Radio.Group
        className={styles['product-detail-graph-overlay__button-group']}
        onChange={handleTimeRangeChange}
        value={selectedTimeRange}
      >
        {timeRanges.map((range) => (
          <Radio.Button key={range} value={range}>
            <Text>{range}</Text>
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
};
