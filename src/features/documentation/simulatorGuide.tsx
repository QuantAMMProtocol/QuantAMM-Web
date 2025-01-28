import { Collapse, CollapseProps, Steps } from 'antd';
import {
  OrderedListOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  DotChartOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import styles from './documentation.module.css';

const { Step } = Steps;

export function SimulatorGuide() {
  const [stepIndex, setIndex] = useState(0);
  const items: CollapseProps['items'] = [
    {
      key: '0',
      label: 'Simulator Advanced Guide',
      children: (
        <div>
          <p style={{ marginBottom: 20 }}>
            Follow these steps to configure and run your simulation. Each step
            provides specific options that affect the simulation's behavior and
            results.
          </p>
          <p style={{ marginBottom: 20 }}>
            Ready to start? Use the button below to begin configuring your
            simulation:
          </p>
          <Steps direction="vertical" current={stepIndex} onChange={setIndex}>
            <Step
              title="Pool"
              icon={<OrderedListOutlined />}
              description="Choose your tokens and initial weights. Select which trading functions and strategies you want to test."
            />
            <Step
              title="Time Range"
              icon={<RiseOutlined />}
              description="Select the time range you want to model and optionally add a time series of retail swaps."
            />
            <Step
              title="Hooks (optional)"
              icon={<ClockCircleOutlined />}
              description="You can add swap fees as a hook to the simulation. This is useful for modeling fee changes over time. V1 allows you to import fees as a time series from an externally-calculated model."
            />
            <Step
              title="Final Review"
              icon={<CheckCircleOutlined />}
              description="Review all the settings before running the simulation."
            />
            <Step
              title="Results"
              icon={<DotChartOutlined />}
              description="View and compare performance of different pools and parameters in the simulation run. This includes day by day changes to see how market conditions affect rebalancing."
            />
          </Steps>
        </div>
      ),
    },
    {
      key: '1',
      label: 'The QuantAMM Balancer Simulator',
      children: (
        <ul>
          {/* <li style={{ marginBottom: 20 }}>
            The QuantAMM Balancer Simulator enables users to model, explore, and
            tune various AMM mechanisms through a web interface. It provides
            deep insights into pool behavior and performance under different
            market conditions.
          </li> */}
          <li style={{ marginBottom: 20 }}>
            The simulator supports a comprehensive range of AMM protocols from
            the Balancer ecosystem:
            <ul style={{ marginTop: 10, marginBottom: 10 }}>
              <li>
                <strong>
                  <a
                    href="https://docs.balancer.fi/concepts/explore-available-balancer-pools/weighted-pool/weighted-pool.html"
                    className={styles.linkStyle}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Balancer Base Weighted Pools
                  </a>
                </strong>
                : Supports multiple tokens with different weights
              </li>
              <li>
                <strong>
                  <a
                    href="https://quantamm.fi"
                    className={styles.linkStyle}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    QuantAMM Pools
                  </a>
                </strong>
                : Dynamic weight AMMs that automatically adjust pool weights
                based on market conditions according to a chosen strategy
              </li>
              <li>
                <strong>
                  <a
                    href="https://cow.fi/cow-amm"
                    className={styles.linkStyle}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CowAMM Pools
                  </a>
                </strong>
                : Pools that use the CoW Swap protocol and a custom invariant to
                reduce rebalancing costs to the pool
              </li>
              <li>
                <strong>
                  <a
                    href="https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools/e-clps"
                    className={styles.linkStyle}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Gyroscope E-CLP Pools
                  </a>
                </strong>
                : Elliptic Concentrated Liquidity Pools offer extreme capital
                efficiency
              </li>
            </ul>
          </li>
          <li style={{ marginBottom: 20 }}>
            <strong>Token Support</strong>:
            <ul style={{ marginTop: 10, marginBottom: 10 }}>
              <li>Balancer & QuantAMM support 2-8 tokens in a pool</li>
              <li>
                CowAMM & Gyroscope E-CLP pools are limited to 2 tokens only
              </li>
            </ul>
          </li>
          <li style={{ marginBottom: 20 }}>
            Pools can also be benchmarked against{' '}
            <a
              href="https://arxiv.org/abs/2208.06046"
              className={styles.linkStyle}
              target="_blank"
              rel="noopener noreferrer"
            >
              Loss Versus Rebalancing
            </a>{' '}
            and{' '}
            <a
              href="https://arxiv.org/abs/2410.23404"
              className={styles.linkStyle}
              target="_blank"
              rel="noopener noreferrer"
            >
              Rebalancing Versus Rebalancing
            </a>{' '}
            metrics.
          </li>
        </ul>
      ),
    },
    {
      key: '2',
      label: 'AMM Modelling',
      children: (
        <ul>
          <li style={{ marginBottom: 20 }}>
            The simulator models AMM behavior, including arbitrage & trades,
            changes in pool composition, and pool performance metrics.
          </li>
          <li style={{ marginBottom: 20 }}>
            Dynamic weight AMMs, such as QuantAMM, support a wide range of
            strategies from momentum to mean reversion and channel following.
          </li>
          <li style={{ marginBottom: 20 }}>
            Trading fees and gas costs can be included as parameters to
            accurately model AMM pools' rebalancing behaviour.
          </li>
          <li style={{ marginBottom: 20 }}>
            The simulator can processes externally-provided sequences of swaps.
            These can either be retail swaps (interleaved with optimal
            calculated arbitrage trades) or constitute the complete sequence of
            trades performed against a pool.
          </li>
        </ul>
      ),
    },
    {
      key: '3',
      label: 'Simulator Structure',
      children: (
        <ul>
          <li style={{ marginBottom: 20 }}>
            The simulator is built with a powerful Python backend that provides
            a web API. It leverages{' '}
            <a
              href="https://github.com/google/jax"
              className={styles.linkStyle}
              target="_blank"
              rel="noopener noreferrer"
            >
              JAX
            </a>
            , a high-performance computing framework, to enable GPU
            acceleration. The entire backend can be installed as a standard
            Python package via <code>pip</code>, making setup straightforward.
            For development or custom deployments, the API server can also be
            run locally.
          </li>
          <li style={{ marginBottom: 20 }}>
            Price data is taken from Binance and Coinbase at minute level. In
            our model, this minute-level granularity represents the fastest
            possible reaction time for arbitrageurs - faster arbitrage generally
            leads to more efficient rebalancing and better pool performance. We
            use minute-level data as a conservative baseline, though
            arbitrageurs often act more quickly in practice.
          </li>
          <li style={{ marginBottom: 20 }}>
            Financial analysis uses standard market metrics, with risk-free
            rates [R(f)] drawn from the 3-Month Treasury Bill rate (DTB3) in
            FRED, the Federal Reserve's economic database.
          </li>
        </ul>
      ),
    },
    {
      key: '4',
      label: 'Extensibility',
      children: (
        <ul>
          <li style={{ marginBottom: 10 }}>
            The Python backend accepts custom AMM designs through:
          </li>
          <ul style={{ marginBottom: 20 }}>
            <li>New pool types via trading functions</li>
            <li>Novel QuantAMM strategies</li>
            <li>Custom optimization objectives</li>
            <li>Integration with existing trading systems</li>
          </ul>
          <li style={{ marginBottom: 20 }}>
            All designs - built-in and custom - make use of the same
            optimization framework. Full documentation ships with the Python
            package.
          </li>
        </ul>
      ),
    },
    {
      key: '5',
      label: 'Local Command Line Only tools',
      children: (
        <ul>
          <li style={{ marginBottom: 20 }}>
            Strategy Optimization: Tune dynamic pool strategies and their
            parameters to optimize performance metrics. Parameter optimization
            considers real-world constraints like pool fees and gas costs.
          </li>
          <li style={{ marginBottom: 20 }}>
            Fee Optimization: Design dynamic fee mechanisms that respond to
            market conditions and tune their response to changing market
            conditions.
          </li>
          <li style={{ marginBottom: 20 }}>
            GPU-accelerated optimization enables rapid exploration of parameter
            spaces. Choose between gradient-based approaches for direct
            optimization or gradient-free methods for discrete parameters and
            significant speedups in some cases.
          </li>
          <li style={{ marginBottom: 20 }}>
            Data Preprocessing: Combine and clean price data from external
            sources. Missing data points are filled to ensure continuous price
            data for simulation.
          </li>
        </ul>
      ),
    },
  ];

  return <Collapse items={items} accordion defaultActiveKey={['0']} />;
}
