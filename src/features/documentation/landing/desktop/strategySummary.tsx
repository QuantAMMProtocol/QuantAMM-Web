import { Button, Col, Row, Tooltip, Typography } from 'antd';
import { ProductItemBackground } from '../../../productExplorer/productItem/productItemBackground';
import { useEffect, useState } from 'react';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';
import { getBreakdown, Pool } from '../../../../services/breakdownService';
import { WeightChangeOverTimeGraph } from '../../../shared';
import { SimulationResultMarketValueChart } from '../../../simulationResults/visualisations/simulationResultMarketValueChart';
import styles from './landingDesktop.module.css';

const { Title } = Typography;

export function StrategySummary() {
  const [breakdowns, setBreakdowns] = useState<SimulationRunBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [strategy, setStrategy] = useState<string>('Momentum');

  const [autoCycle, setAutoCycle] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (autoCycle) {
      const allStrageies = [
        'Momentum',
        'AntiMomentum',
        'Channel Following',
        'Power Channel',
      ];

      interval = setInterval(() => {
        setStrategy((prevStrategy) => {
          const currentIndex = allStrageies.indexOf(prevStrategy);
          const nextIndex = (currentIndex + 1) % allStrageies.length;
          return allStrageies[nextIndex];
        });
      }, 5000); // Change strategy every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoCycle]);

  // Effect to load breakdowns whenever the tab key changes
  useEffect(() => {
    // Function to load breakdowns based on the selected tab
    const loadBreakdowns = async (
      poolNames: Pool[]
    ): Promise<SimulationRunBreakdown[]> => {
      setLoading(true); // Start loading
      const fetchedBreakdowns = await Promise.all(
        poolNames.map((poolName) => getBreakdown(poolName))
      );
      setBreakdowns(fetchedBreakdowns);
      return fetchedBreakdowns;
    };

    const loadData = async (): Promise<SimulationRunBreakdown[]> => {
      // Load breakdowns for the selected tab
      return await loadBreakdowns([
        'solExampleWeighted',
        'solExampleMomentum',
        'solExampleAntimomentum',
        'solExamplePowerChannel',
        'solExampleChannelFollowing',
        'solExampleHodl',
      ] as Pool[]); // Awaiting the asynchronous function here
    };

    if (loading) {
      loadData()
        .then((fetchedBreakdowns) => {
          setBreakdowns(fetchedBreakdowns);
        })
        .catch((error) => {
          console.error('Failed to load breakdowns:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [setBreakdowns, setLoading, breakdowns, loading]);
  const strategies = [
    {
      title: 'Momentum',
      name: 'Momentum',
      image: '/documentation/vanilla_momentum.svg',
      description:
        "It's hard to buy low and sell high. It's easier to buy high and sell higher. Follow the trend.",
      imgWidth: '85%',
    },
    {
      title: 'Price Mean Reversion',
      name: 'AntiMomentum',
      image: '/documentation/mean_reversion.svg',
      description:
        'Deviations will revert back to the mean. Buy and sell assuming prices will revert.',
      imgWidth: '100%',
    },
    {
      title: 'Channel Following',
      name: 'Channel Following',
      image: '/documentation/channel_following.svg',
      description:
        'Everything will revert to the mean on small movements but act fast on larger movements.',
      imgWidth: '90%',
    },
    {
      title: 'Power Channel',
      name: 'Power Channel',
      image: '/documentation/power_channel.svg',
      description:
        'Ignore the noise of small price movements, act fast on large price movements.',
      imgWidth: '100%',
    },
  ];

  const traditionalDexBreakdown = breakdowns.find(
    (x) => x.simulationRun.updateRule.updateRuleName === 'Balancer Weighted'
  );
  const selectedStrategyBreakdown = breakdowns.find(
    (x) => x.simulationRun.updateRule.updateRuleName === strategy
  );

  const StrategySelectorPanel = () => (
    <div className={styles.strategyPanel}>
      <h4 className={styles.textCenter}>ADAPTIVE STRATEGIES</h4>
      <p className={styles.textCenter}>
        FULLY DECENTRALISED, FULLY TRANSPARENT
      </p>
      <Row gutter={[8, 8]} className={styles.strategyGrid}>
        {strategies.map((strategyItem) => (
          <Col
            span={24}
            className={`${styles.zeroSpacing} ${styles.fullHeight}`}
            key={strategyItem.name}
          >
            <Row className={styles.strategyRow}>
              <Col span={8}>
                <div className={styles.centeredRow}>
                  <img
                    loading="lazy"
                    style={{ width: strategyItem.imgWidth }}
                    className={styles.strategyImage}
                    src={strategyItem.image}
                  />
                </div>
              </Col>
              <Col span={16}>
                <div className={styles.strategyButtonWrap}>
                  <Tooltip title={strategyItem.description}>
                    <Button
                      disabled={strategy === strategyItem.name}
                      size="small"
                      className={
                        strategy === strategyItem.name
                          ? `${styles.strategyButton} ${styles.strategyButtonActive}`
                          : styles.strategyButton
                      }
                      onClick={() => {
                        setStrategy(strategyItem.name);
                        setAutoCycle(false);
                      }}
                    >
                      {strategyItem.title}
                    </Button>
                  </Tooltip>
                </div>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
    </div>
  );

  const HoldingsChartsSection = () => (
    <Row>
      <Col span={24} className={styles.chartSection}>
        <h4 className={styles.chartTitle}>Traditional DEX Pool Holdings</h4>
        <p className={styles.chartSubtitle}>
          Focus on earning fees, ignore price movements
        </p>
        <div
          className={styles.chartWrap}
          hidden={
            (loading && breakdowns.length === 0) || !traditionalDexBreakdown
          }
        >
          <WeightChangeOverTimeGraph
            simulationRunBreakdown={traditionalDexBreakdown}
            overrideChartTheme="ag-default-dark"
            overrideXAxisInterval={22}
          />
        </div>
      </Col>
      <Col span={24}>
        <h4 className={styles.chartTitle}>
          QuantAMM{' '}
          <span className={styles.accentText}>
            {strategy === 'AntiMomentum' ? 'Price Reversion' : strategy}
          </span>{' '}
          Pool Holdings
        </h4>
        <p className={styles.chartSubtitle}>
          React to markets while earning fees.
        </p>
        <div
          className={styles.chartWrapNoTop}
          hidden={
            (loading && breakdowns.length === 0) || !selectedStrategyBreakdown
          }
        >
          <WeightChangeOverTimeGraph
            simulationRunBreakdown={selectedStrategyBreakdown}
            overrideChartTheme="ag-default-dark"
            overrideXAxisInterval={22}
          />
        </div>
      </Col>
    </Row>
  );

  return (
    <Row id="final_section_row">
      <Col span={24}>
        <ProductItemBackground
          wide
          layers={20}
          backgroundColourOverride="#2c496b"
          borderColourOverride=""
        >
          <Row>
            <Col span={24}>
              <Title className={styles.sectionTitleDark}>
                EXPLORE QUANTAMM REVOLUTIONARY ARCHITECTURE
              </Title>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <StrategySelectorPanel />
            </Col>
            <Col span={10}>
              <HoldingsChartsSection />
            </Col>
            <Col span={8}>
              <div className={styles.summaryChartPanel}>
                <SimulationResultMarketValueChart
                  breakdowns={breakdowns.filter(
                    (x) =>
                      x.simulationRun.updateRule.updateRuleName === strategy ||
                      x.simulationRun.updateRule.updateRuleName ===
                        'Balancer Weighted'
                  )}
                  forceViewResults={true}
                  overrideXAxisInterval={24}
                  overrideSeriesStrokeColor={{
                    Momentum: '#c7b283',
                    AntiMomentum: '#c7b283',
                    'Channel Following': '#c7b283',
                    'Power Channel': '#c7b283',
                    'Balancer Weighted': '#528aae',
                  }}
                  overrideSeriesName={{
                    Momentum: 'QuantAMM',
                    AntiMomentum: 'QuantAMM',
                    'Channel Following': 'QuantAMM',
                    'Power Channel': 'QuantAMM',
                    'Balancer Weighted': 'Traditional DEX',
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row className={styles.footerRow}>
            <Col span={24} className={styles.footerCol}>
              <div className={styles.footerControls}>
                <Button size="small" onClick={() => setAutoCycle(!autoCycle)}>
                  {autoCycle ? 'Pause' : 'Resume'}
                </Button>
              </div>
            </Col>
          </Row>
        </ProductItemBackground>
      </Col>
    </Row>
  );
}
