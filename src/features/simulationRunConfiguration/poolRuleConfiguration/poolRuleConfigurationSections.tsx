import { Button, Col, Row } from 'antd';
import { ConfiguredSimulationsToRunSummary } from '../configuredSimulationsToRunSummary';
import {
  LiquidityPoolCoin,
  PoolType,
  UpdateRule,
} from '../simulationRunConfigModels';
import styles from '../simulationRunConfiguration.module.css';

interface AddPoolButtonSectionProps {
  coinDataLoaded: boolean;
  isRunLocked: boolean;
  localPoolType: PoolType;
  poolNumeraire: string;
  localUpdateRule: UpdateRule;
  poolConstituents: LiquidityPoolCoin[];
  enableArbBots: boolean;
  onAddPool: (payload: {
    updateRule: UpdateRule;
    poolConstituents: LiquidityPoolCoin[];
    poolType: PoolType;
    id: string;
    enableAutomaticArbBots: boolean;
  }) => void;
}

export function AddPoolButtonSection({
  coinDataLoaded,
  isRunLocked,
  localPoolType,
  poolNumeraire,
  localUpdateRule,
  poolConstituents,
  enableArbBots,
  onAddPool,
}: AddPoolButtonSectionProps) {
  return (
    <Row>
      <Col span={24} className={styles.sectionPaddingTop}>
        <Button
          disabled={
            !coinDataLoaded ||
            isRunLocked ||
            (localPoolType.requiresPoolNumeraire && poolNumeraire === '')
          }
          type="primary"
          onClick={() => {
            onAddPool({
              updateRule: localUpdateRule,
              poolConstituents,
              poolType: localPoolType,
              id: '',
              enableAutomaticArbBots: enableArbBots,
            });
          }}
        >
          {isRunLocked ? 'Reset Sim' : 'Add pool to simulator'}
        </Button>
        <p
          hidden={
            !(localPoolType.requiresPoolNumeraire && poolNumeraire === '')
          }
          className={styles.errorText}
        >
          Mandatory Pool Numeraire Required
        </p>
      </Col>
    </Row>
  );
}

interface SummaryAndContinueSectionProps {
  coinDataLoaded: boolean;
  isRunLocked: boolean;
  simulationPoolsLength: number;
  onContinue: () => void;
}

export function SummaryAndContinueSection({
  coinDataLoaded,
  isRunLocked,
  simulationPoolsLength,
  onContinue,
}: SummaryAndContinueSectionProps) {
  return (
    <Col span={8}>
      <Row className={styles.continueSection}>
        <Col span={24}>
          <ConfiguredSimulationsToRunSummary />
          <Button
            disabled={
              !coinDataLoaded || isRunLocked || simulationPoolsLength === 0
            }
            className={styles.continueButton}
            onClick={onContinue}
          >
            Continue
          </Button>
        </Col>
      </Row>
    </Col>
  );
}
