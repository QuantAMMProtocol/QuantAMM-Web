import { FC, useCallback, useEffect, useState } from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectOverrideTab, setOverrideTab } from '../productExplorerSlice';
import { OverrideTab } from '../../../models';
import style from './productExplorerTabOverride.module.scss';

const radioValues = ['Overview', 'Performance', 'Tokens'];

export const ProductExplorerTabOverride: FC = () => {
  const dispatch = useAppDispatch();
  const overrideTab = useAppSelector(selectOverrideTab);

  const [currentValue, setCurrentValue] = useState<OverrideTab | undefined>(
    undefined
  );

  const handleChange = useCallback(
    (event: RadioChangeEvent) => {
      const value = event.target.value;
      if (value) {
        setCurrentValue(value);
        dispatch(setOverrideTab(value));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (overrideTab === undefined) {
      setCurrentValue(undefined);
    }
  }, [overrideTab]);

  return (
    <div className={style['product-explorer__tab-override-container']}>
      <Radio.Group onChange={handleChange} value={currentValue}>
        <Radio.Button key="label" value="label" disabled={true}>
          View All:
        </Radio.Button>
        {radioValues.map((radioValue) => {
          return (
            <Radio.Button key={radioValue} value={radioValue.toLowerCase()}>
              {radioValue}
            </Radio.Button>
          );
        })}
      </Radio.Group>
    </div>
  );
};
