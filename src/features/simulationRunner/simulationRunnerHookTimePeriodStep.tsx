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
import { ChangeEvent, Dispatch, useRef, useState } from 'react';
import {
  HookTimePeriodChart,
  SelectedProps,
} from '../simulationRunConfiguration/hookTimePeriodChart';
import { ItemType } from 'antd/es/menu/interface';

const handleDownloadFees = (
  event: ChangeEvent<HTMLInputElement>,
  poolId: string,
  dispatch: Dispatch<any>
) => {
  const file = event.target.files?.[0];

  if (file && file.type === 'text/csv') {
    // Ensure it's a CSV file
    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      const csvContent = loadEvent.target?.result;
      try {
        const rows = (csvContent as string).split('\n');
        const headers = rows[0].split(',');

        const rowsWithoutHeader = rows.slice(1, rows.length - 1);

        // Assuming SwapImport has properties: property1, property2, property3, etc.
        const fees: FeeHookStep[] = rowsWithoutHeader.map((row) => {
          const values = row.split(',');
          return {
            unix: Number(values[headers.indexOf('unix')]),
            value:
              Number(values[headers.indexOf('bps')]) < 10000 //100% fees might make sense in some dynamic fee scenario where you dont want any trades.
                ? Number(values[headers.indexOf('bps')])
                : 10000,
          } as unknown as FeeHookStep;
        });

        dispatch(
          addFeeHooksToPool({
            feeHookName: 'timeSeriesFeeImport',
            poolId: poolId,
            fees: fees,
          })
        );
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Error parsing JSON file. Please check the file format.');
      }
    };

    reader.onerror = () => {
      console.error('Error reading the file');
      alert('Error reading the file.');
    };

    reader.readAsText(file); // Read the file as a text string
  } else {
    alert('Please upload a valid JSON file.');
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
  ('');
  function getSelectedPoolId() {
    return { id: selectedSimulationPool?.id ?? 'z' };
  }
  function addFixedFeeToState() {
    dispatch(
      addFixedFeeToPool({
        fixedFee: initialFixedFeeValue,
        poolId: selectedSimulationPool?.id ?? '',
        feeHookName: 'timeSeriesFeeImport',
      })
    );
    setSelectedSimulationPool(selectedSimulationPool);
  }
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Only click if the ref is not null
    }
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

  return (
    <div>
      <Row>
        <Col span={6}>
          <Row>
            <Col span={24}>
              <Divider orientation="center">
                Select Target Pool:
                <Tooltip title="Hooks are per pool not a market setting">
                  <InfoCircleOutlined style={{ paddingLeft: '5px' }} />
                </Tooltip>
              </Divider>
              <p hidden={simulationPools.length != 0}>No Pools Selected</p>
            </Col>
            <Col span={24}>
              <Menu
                hidden={simulationPools.length == 0}
                style={{
                  fontSize: 15,
                }}
                defaultSelectedKeys={[currentTimeRangeSelection]}
                items={simulationPools.map((x) => {
                  return getItem(
                    x?.updateRule.updateRuleName,
                    x.id,
                    <OrderedListOutlined />,
                    false
                  );
                })}
                onClick={(x) => {
                  const selectedPool = simulationPools.find(
                    (y) => y.id == x.key
                  );
                  if (selectedPool) {
                    setSelectedSimulationPool(selectedPool);
                  }
                }}
                activeKey={currentTimeRangeSelection}
              />
            </Col>
          </Row>
          <Row style={{ paddingLeft: '10px' }}>
            <Col span={24}>
              <Divider orientation="center">
                Fixed fees
                <Tooltip title="Fees that do not change over time defined in bps">
                  <InfoCircleOutlined style={{ paddingLeft: '5px' }} />
                </Tooltip>
              </Divider>
            </Col>
            <Col span={16}>
              <InputNumber
                disabled={
                  !coinDataLoaded || selectedSimulationPool == undefined
                }
                addonAfter={'bps'}
                value={initialFixedFeeValue}
                placeholder="value"
                onChange={(e) => {
                  setInitialFixedFee(e ?? 0);
                }}
              />
            </Col>
            <Col span={2}></Col>
            <Col span={6} style={{ marginTop: '10px' }}>
              <Button
                onClick={addFixedFeeToState}
                disabled={selectedSimulationPool == undefined}
                type="primary"
              >
                Add
              </Button>
            </Col>
          </Row>
          <Row style={{ paddingLeft: '10px' }}>
            <Col span={24}>
              <p style={{ textAlign: 'center' }}>or</p>
              <Divider orientation="center">
                Dynamic Fees
                <Tooltip title="Import dynamic fees, the fee vector calculated in your own tooling">
                  <InfoCircleOutlined style={{ paddingLeft: '5px' }} />
                </Tooltip>
              </Divider>
            </Col>
          </Row>
          <Row style={{ paddingLeft: '10px' }}>
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
                style={{ display: 'none' }}
                onChange={(event) =>
                  handleDownloadFees(
                    event,
                    selectedSimulationPool?.id ?? '',
                    dispatch
                  )
                }
              />
              <Button
                disabled={selectedSimulationPool == undefined}
                type="primary"
                onClick={handleButtonClick}
                style={{ height: '100%' }}
              >
                Import
              </Button>
            </Col>
          </Row>
          <Row style={{ paddingLeft: '10px' }}>
            <Col span={24} style={{ paddingLeft: '10px' }}>
              <Divider />
              <Button
                style={{ backgroundColor: 'green' }}
                onClick={() => {
                  dispatch(changeSimulationRunnerCurrentStepIndex(4));
                }}
              >
                Continue
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={18} hidden={currentTimeRangeSelection != 'custom'}>
          <HookTimePeriodChart {...(getSelectedPoolId() as SelectedProps)} />
        </Col>
      </Row>
    </div>
  );
}
