import {
  FC,
  useCallback,
  useState,
  useMemo,
  CSSProperties,
  useEffect,
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
  selectFilters,
  selectActiveFilters,
  selectLoadingFilters,
  selectTextSearch,
  setFilters,
  setTextSearch,
} from '../productExplorerSlice';
import { productExplorerTranslation } from '../translations';

import styles from './productExplorerFilter.module.scss';
import { updateFilters } from '../../../utils/filters';

const { Sider } = Layout;
const { Title, Text } = Typography;

interface ProductExplorerFiltersProps {
  isDark?: boolean;
  horizontalView: boolean;
  setHorizontalView: (checked: boolean) => void;
}

export const ProductExplorerFilters: FC<ProductExplorerFiltersProps> = ({
  isDark,
  horizontalView,
  setHorizontalView,
}) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector<FilterList>(selectFilters);
  const activeFilters = useAppSelector<FilterMap>(selectActiveFilters);
  const initialTextSearch = useAppSelector<string>(selectTextSearch);
  const loading = useAppSelector<boolean>(selectLoadingFilters);

  const [localFilters, setLocalFilters] = useState<FilterMap>({});
  const [searchInput, setSearchInput] = useState<string>(initialTextSearch);
  const [tvlInput, setTvlInput] = useState<number>(10000);

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

  const handleFilterClick = useCallback(
    (event: CheckboxChangeEvent) => {
      const filter = (event.target as any)['data-filter'];
      const filterCategory = (event.target as any)['data-filter-category'];
      setLocalFilters((prev) =>
        updateFilters({ filterCategory, filter }, prev)
      );
      dispatch(setFilters({ filterCategory, filter }));
    },
    [dispatch]
  );

  const handleTvlChange = useCallback(
    (value: number | null) => {
      if (value === null) {
        dispatch(setFilters({ filterCategory: 'tvl', minTvl: 10000 }));
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
    (value: string) => {
      dispatch(setTextSearch(value));
    },
    [dispatch]
  );

  const debouncedHandleTextSearchChange = useMemo(
    () => debounce(handleTextSearchChange, 500),
    [handleTextSearchChange]
  );

  const handleResetClick = useCallback(() => {
    debouncedHandleTvlChange.cancel();
    debouncedHandleTextSearchChange.cancel();
    dispatch(setFilters({}));
    dispatch(setTextSearch(''));
    setLocalFilters({});
    setSearchInput('');
    setTvlInput(10000);
  }, [debouncedHandleTextSearchChange, debouncedHandleTvlChange, dispatch]);

  useEffect(() => {
    return () => {
      debouncedHandleTvlChange.cancel();
      debouncedHandleTextSearchChange.cancel();
    };
  }, [debouncedHandleTextSearchChange, debouncedHandleTvlChange]);

  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  const tvlDefaultValue = useMemo(() => {
    const candidate = localFilters.minTvl?.[0];
    const parsed = candidate ? parseFloat(candidate) : NaN;
    return Number.isFinite(parsed) ? parsed : 10000;
  }, [localFilters.minTvl]);

  useEffect(() => {
    setSearchInput(initialTextSearch);
  }, [initialTextSearch]);

  useEffect(() => {
    setTvlInput(tvlDefaultValue);
  }, [tvlDefaultValue]);

  const LoadingView = () => (
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
  );

  const FilterToggleView = () => (
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
            checked={horizontalView}
            checkedChildren={<MenuOutlined />}
            unCheckedChildren={<TableOutlined />}
            onChange={setHorizontalView}
          />
        </>
      )}
    </div>
  );

  const DynamicFilters = () => (
    <>
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
                    checked={localFilters[filterCategory]?.includes(filter)}
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
    </>
  );

  const TvlAndSearchFilters = () => (
    <div className={styles['filter-bar__filter-group']}>
      <Title level={4}>TVL ($)</Title>
      <div className={styles['filter-bar__filters']}>
        <InputNumber<number>
          min={0}
          max={1000000000}
          value={tvlInput}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value) =>
            value?.replace(/\$\s?|(,*)/g, '') as unknown as number
          }
          onChange={(value) => {
            const nextValue = value ?? 10000;
            setTvlInput(nextValue);
            debouncedHandleTvlChange(nextValue);
          }}
          style={{ width: '100%' }}
        />
        <Text>minimum tvl</Text>
      </div>
      <div className={styles['filter-bar__filter-group']}>
        <Title level={4}>Search</Title>
        <div className={styles['filter-bar__filters']}>
          <Input
            placeholder="Search"
            value={searchInput}
            onChange={(event) => {
              const nextValue = event.target.value;
              setSearchInput(nextValue);
              debouncedHandleTextSearchChange(nextValue);
            }}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );

  const FilterPanel = () => (
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
      <FilterToggleView />
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
        <DynamicFilters />
        <TvlAndSearchFilters />
      </div>
    </div>
  );

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
      {loading ? <LoadingView /> : <FilterPanel />}
    </Sider>
  );
};
