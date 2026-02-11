import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Radio, Row, Select, Tooltip } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { PoolType, UpdateRule } from '../simulationRunConfigModels';
import styles from '../simulationRunConfiguration.module.css';

const { Option } = Select;

interface PoolRuleConfigurationStrategySelectorSectionProps {
  coinDataLoaded: boolean;
  isRunLocked: boolean;
  localPoolType: PoolType;
  localUpdateRule: UpdateRule;
  availableUpdateRules: UpdateRule[];
  enableArbBots: boolean;
  setLocalUpdateRule: Dispatch<SetStateAction<UpdateRule>>;
  setEnableArbBots: Dispatch<SetStateAction<boolean>>;
}

export function PoolRuleConfigurationStrategySelectorSection({
  coinDataLoaded,
  isRunLocked,
  localPoolType,
  localUpdateRule,
  availableUpdateRules,
  enableArbBots,
  setLocalUpdateRule,
  setEnableArbBots,
}: PoolRuleConfigurationStrategySelectorSectionProps) {
  return (
    <Col span={24} className={styles.sectionPaddingTop}>
      <Row hidden={localPoolType.mandatoryProperties.length === 0}>
        <Col span={24}>
          <h5>
            Choose pool strategy
            <Tooltip title="Some balancer-v3 pool types can run various strategies, select a strategy to run on this dynamic AMM">
              <InfoCircleOutlined className={styles.infoIcon} />
            </Tooltip>
          </h5>
        </Col>
        <Col span={24}>
          <Select
            disabled={
              !coinDataLoaded ||
              isRunLocked ||
              localPoolType.mandatoryProperties.length === 0
            }
            placeholder="Select an update rule"
            className={styles.fullWidthWithRightPadding}
            value={localUpdateRule.updateRuleName}
            onSelect={(ruleName) => {
              const foundRule = availableUpdateRules.find(
                (x) => x.updateRuleName === ruleName
              );

              if (foundRule) {
                setLocalUpdateRule(foundRule);
              }
            }}
          >
            {availableUpdateRules
              .filter(
                (x) =>
                  x.applicablePoolTypes?.some((y) => y === localPoolType.name) ??
                  false
              )
              .map((x) => (
                <Option key={x.updateRuleName} value={x.updateRuleName}>
                  {x.updateRuleName}
                </Option>
              ))}
          </Select>
        </Col>
      </Row>
      <Row>
        <Col span={24} className={styles.sectionPaddingTop}>
          <div
            hidden={
              localUpdateRule.updateRuleName.toLowerCase().includes('hodl') ||
              localUpdateRule.updateRuleName.toLowerCase().includes('lvr') ||
              localUpdateRule.updateRuleName.toLowerCase().includes('rvr')
            }
            className={styles.arbGroupContainer}
          >
            <Radio.Group
              onChange={(e) => setEnableArbBots(e.target.value)}
              value={enableArbBots}
              className={styles.arbBotsGroup}
              size="small"
            >
              <Radio.Button disabled className={styles.arbBotsButton}>
                Arbitrage Bots
              </Radio.Button>
              <Radio.Button value={true} className={styles.arbBotsButton}>
                Automated
              </Radio.Button>
              <Radio.Button value={false} className={styles.arbBotsButton}>
                None
              </Radio.Button>
            </Radio.Group>
          </div>
        </Col>
      </Row>
      <Row>
        <div
          className={styles.noParamsRequired}
          hidden={
            localPoolType.mandatoryProperties.length > 0 ||
            localUpdateRule.updateRuleParameters.length > 0
          }
        >
          No Parameters Required
        </div>
      </Row>
    </Col>
  );
}
