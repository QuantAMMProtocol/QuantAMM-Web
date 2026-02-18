import { useEffect, useState } from 'react';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';
import { Pool, getBreakdown } from '../../../../services/breakdownService';
import { WeightChangeOverTimeGraph } from '../../../shared/graphs';
import { Typography } from 'antd';
import styles from './landingMobile.module.css';

const { Title } = Typography;

export function StrategySummaryMobile() {
  const [breakdowns, setBreakdowns] = useState<SimulationRunBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadBreakdowns = async () => {
      setLoading(true);
      try {
        const fetchedBreakdowns = await Promise.all(
          (['balancerWeighted', 'quantAMMAntiMomentum'] as Pool[]).map(
            (poolName) => getBreakdown(poolName)
          )
        );
        if (isMounted) {
          setBreakdowns(fetchedBreakdowns);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadBreakdowns();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <Title level={3}>Traditional DEX Pool Holdings</Title>
      <p>Focus on earning trading swap fees and ignore price movements.</p>
      {!loading && breakdowns.length > 0 && (
        <WeightChangeOverTimeGraph
          simulationRunBreakdown={breakdowns[0]}
          overrideXAxisInterval={12}
        />
      )}

      <Title level={3} className={styles.sectionTitleSpacer}>
        QuantAMM BTF Pool Holdings
      </Title>
      <p>
        Rebalance holdings to capitalize on prices WHILE still earning fees.
      </p>
      {!loading && breakdowns.length > 1 && (
        <WeightChangeOverTimeGraph
          simulationRunBreakdown={breakdowns[1]}
          overrideXAxisInterval={12}
        />
      )}

      <div className={styles.strategyInfo}>
        <ul className={styles.strategyList}>
          <li>
            <strong>✅ Broad baskets and Themes</strong>{' '}
            <p className={styles.listParagraph}>
              No need to be a blockchain expert
            </p>
          </li>
          <li>
            <strong>✅ Fire and Forget</strong>
            <p className={styles.listParagraph}>
              Automatic, fully on-chain daily rebalancing
            </p>
          </li>
          <li>
            <strong>✅ Low Fees</strong>
            <p className={styles.listParagraph}>
              No streaming maintenance fees
            </p>
          </li>
          <li>
            <strong>✅ Trustless</strong>
            <p className={styles.listParagraph}>
              No off-chain stack, no anonymous manager
            </p>
          </li>
          <li>
            <strong>✅ Simplicity</strong>
            <p className={styles.listParagraph}>
              No moving liquidity, no complex trade routing
            </p>
          </li>
          <li>
            <strong>✅ Known Strategies</strong>
            <p className={styles.listParagraph}>
              Simulate performance and risk before investing
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
