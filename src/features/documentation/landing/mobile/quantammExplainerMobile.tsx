import { useEffect, useState } from "react";
import { SimulationRunBreakdown } from "../../../simulationResults/simulationResultSummaryModels";
import { Pool,getBreakdown } from "../../../../services/breakdownService";
import { WeightChangeOverTimeGraph } from "../../../shared/graphs";
import { Typography } from "antd";

const { Title } = Typography;

export function QuantAMMExplainerMobile(){
    const [breakdowns, setBreakdowns] = useState<SimulationRunBreakdown[]>([]);
      const [loading, setLoading] = useState<boolean>(true);
    
      useEffect(() => {
        const loadBreakdowns = async (
          poolNames: Pool[]
        ): Promise<SimulationRunBreakdown[]> => {
          setLoading(true);
          const fetchedBreakdowns = await Promise.all(
            poolNames.map((poolName) => getBreakdown(poolName))
          );
          setBreakdowns(fetchedBreakdowns);
          return fetchedBreakdowns;
        };
    
        if (loading) {
          loadBreakdowns(['balancerWeighted', 'quantAMMAntiMomentum'] as Pool[])
            .catch(console.error)
            .finally(() => setLoading(false));
        }
      }, [loading]);
    
    return <div>
    <Title level={3}>Traditional DEX Pool Holdings</Title>
    <p>Focus on earning trading swap fees and ignore price movements.</p>
    {!loading && breakdowns.length > 0 && (
      <WeightChangeOverTimeGraph
        simulationRunBreakdown={breakdowns[0]}
        overrideXAxisInterval={12}
      />
    )}

    <Title level={3} style={{ marginTop: '20px' }}>
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

    <div
      style={{
        marginTop: '20px',
        textAlign: 'left',
        padding: '10px',
        borderRadius: '10px',
      }}
    >
      <ul
        style={{ padding: '10px', listStyle: 'none', textAlign: 'center' }}
      >
        <li>
          <strong>✅ Broad baskets and Themes</strong>{' '}
          <p style={{ marginTop: 0 }}>No need to be a blockchain expert</p>
        </li>
        <li>
          <strong>✅ Fire and Forget</strong>
          <p style={{ marginTop: 0 }}>
            Automatic, fully on-chain daily rebalancing
          </p>
        </li>
        <li>
          <strong>✅ Low Fees</strong>
          <p style={{ marginTop: 0 }}>No streaming maintenance fees</p>
        </li>
        <li>
          <strong>✅ Trustless</strong>
          <p style={{ marginTop: 0 }}>
            No off-chain stack, no anonymous manager
          </p>
        </li>
        <li>
          <strong>✅ Simplicity</strong>
          <p style={{ marginTop: 0 }}>
            No moving liquidity, no complex trade routing
          </p>
        </li>
        <li>
          <strong>✅ Known Strategies</strong>
          <p style={{ marginTop: 0 }}>
            Simulate performance and risk before investing
          </p>
        </li>
      </ul>
    </div>
  </div>
}