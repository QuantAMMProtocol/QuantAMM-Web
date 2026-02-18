import {
  Button,
  Col,
  InputNumber,
  Modal,
  Select,
  Spin,
  Typography,
} from 'antd';
import {
  ChangeEvent,
  RefObject,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  GetPoolsSummaryQueryVariables,
  GqlChain,
  GqlPoolType,
} from '../../../__generated__/graphql-types';
import { useFetchPoolsSummaryByParams } from '../../../hooks/useFetchPoolsSummaryByParams';
import { poolTypes } from '../../productDetail/productDetailContent/comparableProduct/comparableProductFormHelper';
import styles from '../../simulationResults/simulationResultSummary.module.css';
import runnerStyles from '../simulationRunnerCommon.module.css';

const { Text } = Typography;
const DEFAULT_MIN_TVL = 10000;
const MIN_ALLOWED_TVL = 1000;

export interface LivePoolSelection {
  id: string;
  chain: GqlChain;
  name: string;
}

interface LivePoolSelectOption extends LivePoolSelection {
  value: string;
  label: string;
}

interface ImportResultsModalProps {
  isOpen: boolean;
  runStatusIndex: number;
  importingLivePool: boolean;
  onClose: () => void;
  paramsFileInputRef: RefObject<HTMLInputElement>;
  resultsFileInputRef: RefObject<HTMLInputElement>;
  onParamsImportClick: () => void;
  onResultsImportClick: () => void;
  onLivePoolImport: (pool: LivePoolSelection) => Promise<void> | void;
  onParamsFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onResultsFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function SimulationRunnerImportResultsModalComponent({
  isOpen,
  runStatusIndex,
  importingLivePool,
  onClose,
  paramsFileInputRef,
  resultsFileInputRef,
  onParamsImportClick,
  onResultsImportClick,
  onLivePoolImport,
  onParamsFileChange,
  onResultsFileChange,
}: ImportResultsModalProps) {
  const [selectedPoolType, setSelectedPoolType] = useState<
    GqlPoolType | undefined
  >(undefined);
  const [selectedPoolValue, setSelectedPoolValue] = useState<
    string | undefined
  >(undefined);
  const [minTvl, setMinTvl] = useState<number>(DEFAULT_MIN_TVL);

  const poolParams = useMemo<GetPoolsSummaryQueryVariables>(
    () => ({
      first: 100,
      where: {
        minTvl,
        tagNotIn: ['BLACK_LISTED'],
        ...(selectedPoolType ? { poolTypeIn: [selectedPoolType] } : {}),
      },
    }),
    [minTvl, selectedPoolType]
  );

  const { data, loading: loadingPools } = useFetchPoolsSummaryByParams(
    poolParams,
    {
      skip: !isOpen,
    }
  );

  const poolOptions = useMemo<LivePoolSelectOption[]>(
    () =>
      data?.poolGetPools.map((pool) => ({
        value: `${pool.chain}:${pool.id}`,
        label: `${pool.name} (${pool.chain})`,
        id: pool.id,
        chain: pool.chain,
        name: pool.name,
      })) ?? [],
    [data?.poolGetPools]
  );

  const selectedLivePool = useMemo(
    () => poolOptions.find((option) => option.value === selectedPoolValue),
    [poolOptions, selectedPoolValue]
  );

  useEffect(() => {
    if (selectedPoolValue && !selectedLivePool) {
      setSelectedPoolValue(undefined);
    }
  }, [selectedPoolValue, selectedLivePool]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedPoolValue(undefined);
    }
  }, [isOpen]);

  const canImportLivePool = runStatusIndex === 2 && !!selectedLivePool;

  const handleMinTvlChange = (value: number | null) => {
    const nextMinTvl = Math.max(value ?? MIN_ALLOWED_TVL, MIN_ALLOWED_TVL);
    setMinTvl(nextMinTvl);
    setSelectedPoolValue(undefined);
  };

  const handlePoolTypeChange = (value: GqlPoolType | undefined) => {
    setSelectedPoolType(value);
    setSelectedPoolValue(undefined);
  };

  const handleImportLivePoolClick = () => {
    if (!selectedLivePool) {
      return;
    }

    void onLivePoolImport({
      id: selectedLivePool.id,
      chain: selectedLivePool.chain,
      name: selectedLivePool.name,
    });
  };

  return (
    <Modal
      title="Import File or Select Balancer Pool"
      open={isOpen}
      onOk={onClose}
      onCancel={onClose}
    >
      <Col span={24} className={styles.modalContent}>
        <h4>Import from File:</h4>
        <input
          type="file"
          className={runnerStyles.hiddenFileInput}
          ref={paramsFileInputRef}
          onChange={onParamsFileChange}
        />
        <Button onClick={onParamsImportClick}>
          Set Parameters to downloaded Run Params
        </Button>

        <div className={styles.orDivider}>OR</div>

        <input
          type="file"
          className={runnerStyles.hiddenFileInput}
          ref={resultsFileInputRef}
          onChange={onResultsFileChange}
        />
        <Button onClick={onResultsImportClick}>Import Results from Run</Button>

        <div className={styles.orDivider}>OR</div>

        <h4>Import Live Pool:</h4>
        <Text>Pool Type</Text>
        <Select<GqlPoolType>
          allowClear
          showSearch
          optionFilterProp="label"
          options={poolTypes}
          placeholder="Any pool type"
          value={selectedPoolType}
          onChange={handlePoolTypeChange}
        />

        <Text>Min TVL</Text>
        <InputNumber
          min={MIN_ALLOWED_TVL}
          value={minTvl}
          style={{ width: '100%' }}
          onChange={handleMinTvlChange}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
        />

        <Text>Pool Name</Text>
        {loadingPools ? (
          <Spin tip="Loading live pools..." />
        ) : (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            listHeight={300}
            placeholder="Select a live pool"
            value={selectedPoolValue}
            options={poolOptions}
            filterOption={(input, option) =>
              String(option?.label ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            onChange={(value: string | undefined) => {
              setSelectedPoolValue(value);
            }}
          />
        )}
        {!loadingPools && poolOptions.length === 0 && (
          <Text type="secondary">No pools match the current filters.</Text>
        )}
        {runStatusIndex !== 2 && (
          <Text type="secondary">
            Import Live Pool is enabled when simulation status is at Results.
          </Text>
        )}
        <Button
          type="primary"
          disabled={!canImportLivePool}
          loading={importingLivePool}
          onClick={handleImportLivePoolClick}
        >
          Import Live Pool
        </Button>
      </Col>
    </Modal>
  );
}

export const SimulationRunnerImportResultsModal = memo(
  SimulationRunnerImportResultsModalComponent
);
