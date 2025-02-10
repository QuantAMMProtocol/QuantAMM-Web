import { FC, useCallback } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Typography } from 'antd';
import { MenuItemType } from 'antd/es/menu/interface';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ProductExplorerSortMetric } from '../../../models';
import {
  selectSortingDirection,
  selectSortingMetric,
  setSortingDirection,
  setSortingMetric,
} from '../productExplorerSlice';
import { productExplorerTranslation } from '../translations';
import style from './productExplorerSort.module.scss';

const directionItems: MenuItemType[] = [
  {
    key: '1',
    label: 'Ascending',
  },
  {
    key: '2',
    label: 'Descending',
  },
];

const metricItems: MenuItemType[] = [
  {
    key: '1',
    label: 'TVL',
  },
  {
    key: '2',
    label: 'Yield',
  },
  {
    key: '3',
    label: 'Performance',
  },
  {
    key: '4',
    label: 'Diversification',
  },
  {
    key: '5',
    label: 'Adaptability',
  },
];

export const ProductExplorerSort: FC = () => {
  const dispatch = useAppDispatch();
  const sortingMetric = useAppSelector(selectSortingMetric);
  const sortingDirection = useAppSelector(selectSortingDirection);

  const handleDirectionClick = useCallback(
    (event: any) => {
      const selectedItem = directionItems.find((i) => i?.key === event.key);
      if (selectedItem) {
        const direction = selectedItem.label === 'Ascending' ? 'asc' : 'desc';
        dispatch(setSortingDirection(direction));
      }
    },
    [dispatch]
  );

  const handleMetricClick = useCallback(
    (event: any) => {
      const selectedItem = metricItems.find((i) => i?.key === event.key);
      if (selectedItem) {
        dispatch(
          setSortingMetric(
            (
              selectedItem.label as string
            ).toLowerCase() as ProductExplorerSortMetric
          )
        );
      }
    },
    [dispatch]
  );

  return (
    <div className={style['product-explorer__sort-container']}>
      <Typography.Text>Sort by</Typography.Text>
      <div className={style['product-explorer__sort']}>
        <Dropdown
          menu={{
            items: metricItems,
            selectable: true,
            defaultSelectedKeys: ['1'],
            onClick: handleMetricClick,
          }}
        >
          <Typography.Link>
            <Space>
              {productExplorerTranslation[sortingMetric]}
              <DownOutlined />
            </Space>
          </Typography.Link>
        </Dropdown>
      </div>

      <div className={style['product-explorer__sort']}>
        <Dropdown
          menu={{
            items: directionItems,
            selectable: true,
            defaultSelectedKeys: ['2'],
            onClick: handleDirectionClick,
          }}
        >
          <Typography.Link>
            <Space>
              {productExplorerTranslation[sortingDirection]}
              <DownOutlined />
            </Space>
          </Typography.Link>
        </Dropdown>
      </div>
    </div>
  );
};
