import { Collapse, CollapseProps, Steps } from 'antd';
import {
  OrderedListOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  DotChartOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
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
          <li style={{ marginBottom: 20 }}>
            The QuantAMM Balancer Simulator enables users to model, test, and
            optimize various AMM designs through an intuitive web interface. It
            provides deep insights into pool behavior and performance under
            different market conditions.
          </li>
          <li style={{ marginBottom: 20 }}>
            The simulator supports a comprehensive range of AMM protocols from
            the Balancer ecosystem and related designs:
            <ul style={{ marginTop: 10, marginBottom: 10 }}>
              <li>
                <strong>Balancer Base Weighted Pools</strong>: The foundation of
                many modern AMM designs, supporting arbitrary numbers of tokens
                with different weights
              </li>
              <li>
                <strong>QuantAMM Pools</strong>: Dynamic weight AMMs that
                automatically adjust pool weights based on market conditions and
                a chosen strategies
              </li>
              <li>
                <strong>CowAMM Pools</strong>: Pools that use the CoW Swap
                protocol and a custom invariant to provide reduced rebalancing
                costs for LPs
              </li>
              <li>
                <strong>Gyroscope E-CLP Pools</strong>: Elliptic Concentrated
                Liquidity Pools that provide extreme capital efficiency for
                traders
              </li>
            </ul>
          </li>
          <li style={{ marginBottom: 20 }}>
            <strong>Token Support</strong>:
            <ul style={{ marginTop: 10, marginBottom: 10 }}>
              <li>Balancer pools support 2-8 tokens</li>
              <li>
                CowAMM & Gyroscope E-CLP pools are limited to 2 tokens only
              </li>
            </ul>
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
            The simulator provides comprehensive modeling of AMM behavior,
            including arbitrage & trades, changes in pool composition, and pool
            performance metrics.
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
            Here we provide a hosted version of the quantamm simulator. The
            simulator is built with a powerful Python backend that provides a
            web API. It leverages{' '}
            <a href="https://github.com/google/jax">JAX</a>, a high-performance
            computing framework, to enable GPU acceleration. The entire backend
            can be installed as a standard Python package via <code>pip</code>,
            making setup straightforward. For development or custom deployments,
            the API server can also be run locally.
          </li>
          <li style={{ marginBottom: 20 }}>
            Price data is taken from Binance and Coinbase at the minute level.
            The granularity of price data determines how quickly we can model
            arbitrageur responses - faster arbitrage generally leads to more
            efficient rebalancing and better pool performance. We use
            minute-level data as a conservative baseline, though arbitrageurs
            often act more quickly in practice.
          </li>
          <li style={{ marginBottom: 20 }}>
            The simulator provides comprehensive financial analysis capabilities
            using custom functions. For risk-free rate calculations [R(f)], we
            use the 3-Month Treasury Bill rate (DTB3) obtained from FRED
            (Federal Reserve Economic Data), the official economic database of
            the Federal Reserve.
          </li>
        </ul>
      ),
    },
    {
      key: '4',
      label: 'Extensibility',
      children: (
        <ul>
          <li style={{ marginBottom: 20 }}>
            The simulator's Python backend is designed for customization and
            extension, allowing you to implement and test your own AMM
            innovations. This flexibility enables:
          </li>
          <ul style={{ marginTop: 10, marginBottom: 10 }}>
            <li>Custom trading functions for new pool types</li>
            <li>Novel QuantAMM strategies and parameters</li>
            <li>Specialized optimization objectives</li>
            <li>Integration with existing trading systems</li>
          </ul>
          <li style={{ marginBottom: 20 }}>
            The system is extensible through its Python backend package. Power
            users can add custom trading functions and QuantAMM strategies by
            implementing new pool types. The backend maintains full machine
            learning capabilities for parameter optimization of custom
            implementations. Documentation for extending the system will be
            available with the Python package release.
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
            The Python package includes additional advanced features:
          </li>
          <li style={{ marginBottom: 20 }}>
            Comprehensive Parameter Optimization:
            <ul style={{ marginTop: 10, marginBottom: 10 }}>
              <li>
                Strategy Optimization: Tune dynamic pool strategies and their
                parameters to optimize performance metrics
              </li>
              <li>
                Fee Mechanism Design: Optimize dynamic fee hooks and fee
                parameters while accounting for market conditions
              </li>
              <li>
                Realistic Modeling: Parameter optimization considers real-world
                constraints like pool fees and gas costs
              </li>
              <li>
                High-Performance Computing: GPU-accelerated optimization enables
                rapid exploration of parameter spaces
              </li>
              <li>
                Flexible Methods: Choose between gradient-based approaches for
                direct optimization or gradient-free methods for complex
                landscapes, discrete parameters and significant speedups in some
                cases
              </li>
            </ul>
          </li>
          <li style={{ marginBottom: 20 }}>
            Custom Data Preprocessing: Combine and clean price data from
            external sources, with intelligent gap-filling to ensure continuous,
            high-quality price data for simulation.
          </li>
        </ul>
      ),
    },
  ];

  return <Collapse items={items} accordion defaultActiveKey={['0']} />;
}
