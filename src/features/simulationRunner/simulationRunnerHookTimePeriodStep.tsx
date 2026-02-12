import { Button, Col, Divider, InputNumber, Menu, Row, Tooltip } from 'antd';

import { InfoCircleOutlined, OrderedListOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  changeSimulationRunnerCurrentStepIndex,
  selectSimulationRunnerTimeRangeSelection,
} from './simulationRunnerSlice';
import {
  FeeHookStep,
  LiquidityPool,
} from '../simulationRunConfiguration/simulationRunConfigModels';
import {
  addFeeHooksToPool,
  selectSimulationPools,
  addFixedFeeToPool,
  selectCoinPriceDataLoaded,
} from '../simulationRunConfiguration/simulationRunConfigurationSlice';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { HookTimePeriodChart } from '../simulationRunConfiguration/hookTimePeriodChart';
import { ItemType } from 'antd/es/menu/interface';
import { AppDispatch } from '../../app/store';
import runnerStyles from './simulationRunnerCommon.module.css';

const isCsvFile = (file: File) =>
  file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');

const parseCsvRows = (csvContent: string) =>
  csvContent
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter((row) => row.length > 0)
    .map((row) => row.split(',').map((cell) => cell.trim()));

const handleDownloadFees = (
  event: ChangeEvent<HTMLInputElement>,
  poolId: string,
  dispatch: AppDispatch
) => {
  const file = event.target.files?.[0];

  if (file && isCsvFile(file)) {
    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      const csvContent = loadEvent.target?.result;
      try {
        const rows = parseCsvRows(String(csvContent ?? ''));
        if (rows.length < 2) {
          throw new Error(
            'CSV must include headers and at least one data row.'
          );
        }

        const headers = rows[0].map((header) => header.toLowerCase());
        const unixIndex = headers.indexOf('unix');
        const bpsIndex = headers.indexOf('bps');

        if (unixIndex === -1 || bpsIndex === -1) {
          throw new Error('Missing required headers.');
        }

        const fees: FeeHookStep[] = rows.slice(1).map((values) => {
          const unix = Number(values[unixIndex]);
          const bps = Number(values[bpsIndex]);
          return {
            unix: Number.isFinite(unix) ? unix : 0,
            value: Number.isFinite(bps) && bps < 10000 ? bps : 10000,
          };
        });

        dispatch(
          addFeeHooksToPool({
            feeHookName: 'timeSeriesFeeImport',
            poolId,
            fees,
          })
        );
      } catch (error) {
        alert('Error parsing CSV file. Please check the file format.');
      }
      event.target.value = '';
    };

    reader.onerror = () => {
      alert('Error reading the file.');
      event.target.value = '';
    };

    reader.readAsText(file);
  } else {
    alert('Please upload a valid CSV file.');
    event.target.value = '';
  }
};

export function SimulationRunnerHookTimePeriodStep() {
  const dispatch = useAppDispatch();
  const simulationPools = useAppSelector(selectSimulationPools);
  const [selectedSimulationPool, setSelectedSimulationPool] =
    useState<LiquidityPool>();

  const currentTimeRangeSelection = useAppSelector(
    selectSimulationRunnerTimeRangeSelection
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coinDataLoaded = useAppSelector(selectCoinPriceDataLoaded);
  const [initialFixedFeeValue, setInitialFixedFee] = useState<number>(0);

  useEffect(() => {
    if (simulationPools.length === 0) {
      setSelectedSimulationPool(undefined);
      return;
    }

    if (!selectedSimulationPool) {
      setSelectedSimulationPool(simulationPools[0]);
      return;
    }

    if (
      !simulationPools.find((pool) => pool.id === selectedSimulationPool.id)
    ) {
      setSelectedSimulationPool(simulationPools[0]);
    }
  }, [simulationPools, selectedSimulationPool]);

  function addFixedFeeToState() {
    if (!selectedSimulationPool) {
      return;
    }

    dispatch(
      addFixedFeeToPool({
        fixedFee: initialFixedFeeValue,
        poolId: selectedSimulationPool.id,
        feeHookName: 'timeSeriesFeeImport',
      })
    );
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  function getItem(
    label: string,
    key: string,
    icon: JSX.Element,
    disabled: boolean
  ): ItemType {
    return {
      key,
      label,
      icon,
      disabled,
    } as ItemType;
  }

  const HookConfigurationPanel = () => (
    <Col span={6}>
      <Row>
        <Col span={24}>
          <Divider orientation="center">
            Select Target Pool:
            <Tooltip title="Hooks are per pool not a market setting">
              <InfoCircleOutlined className={runnerStyles.infoIcon} />
            </Tooltip>
          </Divider>
          <p hidden={simulationPools.length !== 0}>No Pools Selected</p>
        </Col>
        <Col span={24}>
          <Menu
            hidden={simulationPools.length === 0}
            className={runnerStyles.menuFont15}
            selectedKeys={
              selectedSimulationPool ? [selectedSimulationPool.id] : []
            }
            items={simulationPools.map((x) => {
              return getItem(
                x?.updateRule.updateRuleName,
                x.id,
                <OrderedListOutlined />,
                false
              );
            })}
            onClick={(x) => {
              const selectedPool = simulationPools.find((y) => y.id === x.key);
              if (selectedPool) {
                setSelectedSimulationPool(selectedPool);
              }
            }}
          />
        </Col>
      </Row>
      <Row className={runnerStyles.leftPadding10}>
        <Col span={24}>
          <Divider orientation="center">
            Fixed fees
            <Tooltip title="Fees that do not change over time defined in bps">
              <InfoCircleOutlined className={runnerStyles.infoIcon} />
            </Tooltip>
          </Divider>
        </Col>
        <Col span={16}>
          <InputNumber
            disabled={!coinDataLoaded || selectedSimulationPool === undefined}
            addonAfter={'bps'}
            value={initialFixedFeeValue}
            placeholder="value"
            min={0}
            max={10000}
            onChange={(e) => {
              setInitialFixedFee(e ?? 0);
            }}
          />
        </Col>
        <Col span={2}></Col>
        <Col span={6} className={runnerStyles.marginTop10}>
          <Button
            onClick={addFixedFeeToState}
            disabled={selectedSimulationPool === undefined}
            type="primary"
          >
            Add
          </Button>
        </Col>
      </Row>
      <Row className={runnerStyles.leftPadding10}>
        <Col span={24}>
          <p className={runnerStyles.centerText}>or</p>
          <Divider orientation="center">
            Dynamic Fees
            <Tooltip title="Import dynamic fees, the fee vector calculated in your own tooling">
              <InfoCircleOutlined className={runnerStyles.infoIcon} />
            </Tooltip>
          </Divider>
        </Col>
      </Row>
      <Row className={runnerStyles.leftPadding10}>
        <Col span={16}>
          <p>Expected CSV header format:</p>
          <p>
            <b>unix, bps</b>
          </p>
          <p>unix col in ms format</p>
          <p>Minimum resolution: 1 minute</p>
        </Col>
        <Col span={2} />
        <Col span={6}>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className={runnerStyles.hiddenFileInput}
            onChange={(event) =>
              handleDownloadFees(
                event,
                selectedSimulationPool?.id ?? '',
                dispatch
              )
            }
          />
          <Button
            disabled={!coinDataLoaded || selectedSimulationPool === undefined}
            type="primary"
            onClick={handleButtonClick}
            className={runnerStyles.fullHeight}
          >
            Import
          </Button>
        </Col>
      </Row>
      <Row className={runnerStyles.leftPadding10}>
        <Col span={24} className={runnerStyles.leftPadding10}>
          <Divider />
          <Button
            className={runnerStyles.greenButton}
            onClick={() => {
              dispatch(changeSimulationRunnerCurrentStepIndex(4));
            }}
          >
            Continue
          </Button>
        </Col>
      </Row>
    </Col>
  );

  const HookChartPanel = () => (
    <Col span={18} hidden={currentTimeRangeSelection !== 'custom'}>
      <HookTimePeriodChart id={selectedSimulationPool?.id ?? ''} />
    </Col>
  );

  return (
    <div>
      <Row>
        <HookConfigurationPanel />
        <HookChartPanel />
      </Row>
    </div>
  );
}
