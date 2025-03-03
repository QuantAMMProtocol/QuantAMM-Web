import {
  FC,
  useCallback,
  useState,
  useMemo,
  CSSProperties,
  useEffect,
  ChangeEvent,
} from 'react';
import {
  Checkbox,
  Input,
  InputNumber,
  Layout,
  Spin,
  Switch,
  Typography,
} from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import {
  CloseOutlined,
  FilterOutlined,
  MenuOutlined,
  TableOutlined,
} from '@ant-design/icons';
import debounce from 'lodash/debounce';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { FilterList, FilterMap } from '../../../models';
import {
  selectActiveFilters,
  selectFilters,
  selectHorizontalView,
  selectLoadingFilters,
  selectTextSearch,
  setFilters,
  setTextSearch,
} from '../productExplorerSlice';
import { productExplorerTranslation } from '../translations';

import styles from './productExplorerFilter.module.scss';

const { Sider } = Layout;
const { Title, Text } = Typography;

interface ProductExplorerFiltersProps {
  isDark?: boolean;
  setHorizontalView: (checked: boolean) => void;
}

export const ProductExplorerFilters: FC<ProductExplorerFiltersProps> = ({
  isDark,
  setHorizontalView,
}) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector<FilterList>(selectFilters);
  const activeFilters = useAppSelector<FilterMap>(selectActiveFilters);
  const initialHorizontalView = useAppSelector<boolean>(selectHorizontalView);
  const initialTextSearch = useAppSelector<string>(selectTextSearch);
  const loading = useAppSelector<boolean>(selectLoadingFilters);

  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [brokenBreakpoint, setBrokenBreakpoint] = useState<boolean>(true);

  const style: CSSProperties = useMemo(() => {
    if (brokenBreakpoint) {
      return {
        position: 'absolute',
        left: 0,
        zIndex: 99,
      };
    }

    return {};
  }, [brokenBreakpoint]);

  const handleResetClick = useCallback(() => {
    dispatch(setFilters({}));
    dispatch(setFilters({ filterCategory: 'tvl', minTvl: undefined }));
    dispatch(setTextSearch(''));
  }, [dispatch]);

  const handleFilterClick = useCallback(
    (event: CheckboxChangeEvent) => {
      const filter = (event.target as any)['data-filter'];
      const filterCategory = (event.target as any)['data-filter-category'];
      dispatch(setFilters({ filterCategory, filter }));
    },
    [dispatch]
  );

  const handleTvlChange = useCallback(
    (value: number | null) => {
      if (value === null) {
        dispatch(setFilters({ filterCategory: 'tvl', minTvl: undefined }));
      } else {
        dispatch(setFilters({ filterCategory: 'tvl', minTvl: value }));
      }
    },
    [dispatch]
  );

  const debouncedHandleTvlChange = useMemo(
    () => debounce(handleTvlChange, 500),
    [handleTvlChange]
  );

  const handleTextSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(setTextSearch(event.target.value));
    },
    [dispatch]
  );

  const debouncedHandleTextSearchChange = useMemo(
    () => debounce(handleTextSearchChange, 500),
    [handleTextSearchChange]
  );

  useEffect(() => {
    return () => {
      debouncedHandleTvlChange.cancel();
    };
  }, [debouncedHandleTvlChange]);

  return (
    <Sider
      width={brokenBreakpoint ? '300px' : '190px'}
      breakpoint="xl"
      collapsedWidth="0"
      onBreakpoint={(broken) => {
        if (broken) {
          setHorizontalView(false);
        }
        setBrokenBreakpoint(broken);
      }}
      onCollapse={(collapsed: boolean) => {
        setCollapsed(collapsed);
      }}
      trigger={<FilterOutlined />}
      zeroWidthTriggerStyle={{
        borderColor: '#E6CE97',
        borderStyle: 'solid',
        borderWidth: `1px 1px 1px ${collapsed ? '1px' : '0'}`,
        top: 0,
        position: 'absolute',
        right: collapsed ? '' : '-15px',
        backgroundColor: isDark ? '#243242' : '#fefffe',
      }}
      theme={isDark ? 'dark' : 'light'}
      style={{
        minHeight: '100vh',
        maxWidth: '375px !important',
        background: 'transparent',
        ...style,
      }}
    >
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '190px',
            height: '100vh',
          }}
        >
          <Spin />
        </div>
      ) : (
        <div
          className={
            brokenBreakpoint
              ? [
                  styles['filter-bar-container__collapsible'],
                  isDark
                    ? styles['filter-bar-container__dark']
                    : styles['filter-bar-container__light'],
                ].join(' ')
              : [styles['filter-bar-container']].join(' ')
          }
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              width: '100%',
              marginBottom: 24,
            }}
          >
            {!brokenBreakpoint && (
              <>
                <Text style={{ marginRight: 12 }}>Toggle View</Text>
                <Switch
                  defaultChecked={initialHorizontalView}
                  checkedChildren={<MenuOutlined />}
                  unCheckedChildren={<TableOutlined />}
                  onChange={setHorizontalView}
                />
              </>
            )}
          </div>
          <div
            className={
              collapsed && brokenBreakpoint
                ? styles['filter-bar__collapsed']
                : styles['filter-bar']
            }
          >
            <div className={styles['filter-bar__reset']}>
              <Text onClick={handleResetClick}>
                Reset Filters <CloseOutlined />
              </Text>
            </div>

            {filters.map((filterGroup) => {
              const filterCategory = Object.keys(filterGroup)[0];

              return (
                <div
                  key={filterCategory}
                  className={styles['filter-bar__filter-group']}
                >
                  <Title level={4}>
                    {productExplorerTranslation[Object.keys(filterGroup)[0]]}
                  </Title>

                  <div className={styles['filter-bar__filters']}>
                    {filterGroup[filterCategory].map((filter: string) => {
                      return (
                        <Checkbox
                          key={filter}
                          checked={activeFilters[filterCategory]?.includes(
                            filter
                          )}
                          disabled={false}
                          data-filter-category={filterCategory}
                          data-filter={filter}
                          onChange={handleFilterClick}
                        >
                          {productExplorerTranslation[filter]}
                        </Checkbox>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div className={styles['filter-bar__filter-group']}>
              <Title level={4}>TVL ($)</Title>
              <div className={styles['filter-bar__filters']}>
                <InputNumber<number>
                  min={0}
                  max={1000000000}
                  defaultValue={parseFloat(
                    activeFilters.minTvl?.[0] ?? '10000'
                  )}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) =>
                    value?.replace(/\$\s?|(,*)/g, '') as unknown as number
                  }
                  onChange={debouncedHandleTvlChange}
                  style={{ width: '100%' }}
                />
                <Text>minimum tvl</Text>
              </div>
              <div className={styles['filter-bar__filter-group']}>
                <Title level={4}>Search</Title>
                <div className={styles['filter-bar__filters']}>
                  <Input
                    placeholder="Search"
                    defaultValue={initialTextSearch}
                    onChange={debouncedHandleTextSearchChange}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Sider>
  );
};
