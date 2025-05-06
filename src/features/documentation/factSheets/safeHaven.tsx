import { Button, Card, Col, Row, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { Radio } from 'antd';
import { SimulationRunBreakdown } from '../../simulationResults/simulationResultSummaryModels';
import { getBreakdown, Pool } from '../../../services/breakdownService';
import { WeightChangeOverTimeGraph } from '../../shared/graphs/weightChangeOverTime';
import { PowerChannelUpdateRule } from '../updateRules/powerChannelUpdateRule';
import { SimulationResultMarketValueChart } from '../../simulationResults/visualisations/simulationResultMarketValueChart';
import { AnalysisSimplifiedBreakdownTable } from '../../simulationResults/breakdowns/simulationRunPerformanceSimpleTable';
import { QuantAMMPoolDescription } from '../poolTypes/quantamm';

export function SafeHavenFactSheet() {
  const [breakdowns, setBreakdowns] = useState<
    Record<string, SimulationRunBreakdown>
  >({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadBreakdowns = async (
      poolNames: Pool[]
    ): Promise<Record<string, SimulationRunBreakdown>> => {
      setLoading(true);
      const fetchedBreakdowns = await Promise.all(
        poolNames.map(async (poolName) => {
          const breakdown = await getBreakdown(poolName);
          return { [poolName]: breakdown };
        })
      );
      const breakdownsMap = fetchedBreakdowns.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );
      setBreakdowns(breakdownsMap);
      return breakdownsMap;
    };

    if (loading) {
      loadBreakdowns([
        'safeHavenBTFAugTest',
        'safeHavenCFMMAugTest',
        'safeHavenHodlAugTest',
        'safeHavenBTFAugTrain',
        'safeHavenCFMMAugTrain',
        'safeHavenHodlAugTrain',
        'safeHavenBTF2025Test',
        'safeHavenCFMM2025Test',
        'safeHavenHodl2025Test',
      ] as Pool[])
        .catch(console.error)
        .finally(() => {
          setLoading(false);
          console.log('Breakdowns loaded:', breakdowns);
        });
    }
  }, [loading, breakdowns]);

  const [period, setPeriod] = useState<string>('AugTest');
  const safeHavenBTF = useMemo(() => `safeHavenBTF${period}`, [period]);
  const safeHavenCFMM = useMemo(() => `safeHavenCFMM${period}`, [period]);
  const safeHavenHODL = useMemo(() => `safeHavenHodl${period}`, [period]);

  const xAxisMonthInterval = useMemo(() => {
    switch (period) {
      case 'AugTest':
        return 3;
      case '2025Test':
        return 1;
      case 'AugTrain':
        return 22;
      default:
        return 22;
    }
  }, [period]);

  return (
    <div>
      <Row>
        <Col span={1}></Col>
        <Col span={10}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <img
              src="/assets/safe_haven_BTF_icon_mono.png"
              alt="Safe Haven BTF Icon"
              style={{ width: '30%', height: 'auto' }}
            />
            <h1 style={{ textAlign: 'center', margin: 0 }}>
              The Safe Haven BTF
            </h1>
            <p style={{ textAlign: 'center' }}>
              A safe haven is an investment that is expected to retain or
              increase in value during times of global turbulence. Examples of
              safe,havens include gold, U.S. Treasury bonds, and certain
              currencies like the United States Dollar. Bitcoin is also
              considered a potential safe haven asset due to its limited supply
              and decentralized nature, which can provide a hedge against
              inflation and currency devaluation.
            </p>
          </div>
        </Col>
        <Col span={1}></Col>
        <Col span={11}>
          <h4>BTF Objective</h4>
          <p>
            The Safe Haven BTF allows for a decentralised, automated and
            transparent mechanism to allocate to Gold and Bitcoin in a
            responsive manner that reflects the inherent volatility associated
            with Bitcoin.
          </p>
          <h4>Responsive Strategy Objective</h4>
          <p>
            The BTF structure allows this to be done in a feeless manner for the
            LP with continuous on-chain rebalancing rather than the traditional
            monthly or quarterly rebalances. Re-weighting is performed daily.
          </p>
          <p>
            BTFs also augment returns with swap fees associated with providing a
            decentralised liquidity pool and provide an ERC20 token that can be
            used in other DeFi applications.
          </p>
          <p>
            It is crucial to recognize that safe havens carry risks.
            Reallocation strategies are not market-neutral and involve
            directional assumptions about asset allocation. Furthermore, the
            value of assets can be affected by macro economic factors and global
            events.
          </p>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 style={{ marginLeft: '10px' }}>OVERVIEW</h1>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row style={{ height: '45vh' }}>
        <Col span={1}></Col>
        <Col span={10}>
          <Row style={{ height: '100%' }}>
            <Col span={24}>
              <Card title="GENERAL DEPLOYMENT LINKS" style={{ height: '100%' }}>
                <Tag color="primary">Safe Haven BTF</Tag>
                <Tag color="blue">Safe Haven CFMM</Tag>
                <Tag color="blue">Safe Haven HODL</Tag>
                <Tag color="blue">Safe Haven BTF</Tag>
                <Tag color="blue">Safe Haven CFMM</Tag>
                <Tag color="blue">Safe Haven HODL</Tag>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={1}></Col>
        <Col span={11}>
          <Card
            title={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>COMPOSITION OVER TIME</span>
                <Radio.Group
                  onChange={(e) => setPeriod(e.target.value)}
                  value={period}
                  buttonStyle="solid"
                  size="small"
                >
                  <Radio.Button value="AugTest">
                    Test Period: Aug24-Apr25
                  </Radio.Button>
                  <Radio.Button value="2025Test">
                    Test Period: Jan-Apr25
                  </Radio.Button>
                </Radio.Group>
              </div>
            }
            style={{ height: '100%' }}
          >
            <Row>
              <Col span={24} style={{ paddingTop: '30px' }}>
                <WeightChangeOverTimeGraph
                  simulationRunBreakdown={breakdowns[safeHavenBTF]}
                  overrideChartTheme="ag-default-dark"
                  overrideXAxisInterval={xAxisMonthInterval}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={1}></Col>
      </Row>

      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 style={{ marginLeft: '10px' }}>CUMULATIVE PERFORMANCE</h1>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <Card
            title={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>SIMULATED BTF TOTAL $ VALUE OVER TIME</span>
                <Radio.Group
                  onChange={(e) => setPeriod(e.target.value)}
                  value={period}
                  buttonStyle="solid"
                  size="small"
                >
                  <Radio.Button value="AugTest">
                    Test Period: Aug24-Apr25
                  </Radio.Button>
                  <Radio.Button value="2025Test">
                    Test Period: Jan-Apr25
                  </Radio.Button>
                </Radio.Group>
              </div>
            }
            style={{ margin: '5px' }}
          >
            <div hidden={loading}>
              <SimulationResultMarketValueChart
                hideTitle={true}
                overrideNagivagtion={false}
                breakdowns={
                  loading
                    ? []
                    : [
                        breakdowns[safeHavenBTF],
                        breakdowns[safeHavenCFMM],
                        breakdowns[safeHavenHODL],
                      ]
                }
                overrideSeriesStrokeColor={{
                  'Power Channel': '#c7b283',
                  'Balancer Weighted': '#528aae',
                  HODL: '#52ad80',
                }}
                overrideSeriesName={{
                  'Power Channel': 'SAFE HAVEN BTF',
                  'Balancer Weighted': 'Traditional DEX',
                }}
                overrideXAxisInterval={xAxisMonthInterval}
                forceViewResults={true}
              />
            </div>
          </Card>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 style={{ marginLeft: '10px' }}>RE-WEIGHTING METHODOLOGY</h1>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row style={{ height: '80vh' }}>
        <Col span={1}></Col>
        <Col span={10}>
          <Row>
            <Col span={24}>
              <Card
                title="QuantAMM Rebalancing"
                style={{ height: '80vh', overflowY: 'auto' }}
              >
                <QuantAMMPoolDescription hideTitle={true} fixedEL15={true}/>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={1}></Col>
        <Col span={11}>
          <Row>
            <Col span={24} style={{ height: '100%' }}>
              <Card
                title="Power Channel Strategy"
                style={{ height: '80vh', overflowY: 'auto' }}
              >
                <PowerChannelUpdateRule hideTitle={true} hideImage={true} />
              </Card>
            </Col>
            <Col span={24}></Col>
          </Row>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 style={{ marginLeft: '10px' }}>
            QUANTITATIVE FINANCIAL ANALYSIS
          </h1>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={24}>
          <Row>
            <Col span={1}></Col>
            <Col span={22}>
              <Card
                title={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>SIMULATED FINANCIAL METRICS</span>
                    <Radio.Group
                      onChange={(e) => setPeriod(e.target.value)}
                      value={period}
                      buttonStyle="solid"
                      size="small"
                    >
                      <Radio.Button value="AugTest">
                        Test Period: Aug24-Apr25
                      </Radio.Button>
                      <Radio.Button value="2025Test">
                        Test Period: Jan-Apr25
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                }
                style={{ margin: '5px' }}
              >
                <AnalysisSimplifiedBreakdownTable
                  simulationRunBreakdowns={
                    loading
                      ? []
                      : [
                          breakdowns[safeHavenBTF],
                          breakdowns[safeHavenCFMM],
                          breakdowns[safeHavenHODL],
                        ]
                  }
                  visibleMetrics={[
                    'Absolute Return (%)',
                    'Annualized Sharpe Ratio',
                    'Annualized Sortino Ratio',
                    'Annualized Information Ratio',
                    'Total Capture Ratio',
                    "Annualized Jensen's Alpha (%)",
                  ]}
                  height={300}
                />
                <Row>
                  <Col span={10}>
                    <span>
                      R(f) ={' '}
                      <a
                        href="https://fred.stlouisfed.org/series/DTB3"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        3-Month Treasury Bill Secondary Market Rate, Discount
                        Basis (DTB3)
                      </a>
                    </span>
                  </Col>
                  <Col span={10}>
                    <span>R(b) = HODL</span>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={1}></Col>
          </Row>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 style={{ marginLeft: '10px' }}>KEY FACTS</h1>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row style={{height: '130vh'}}>
        <Col span={1}></Col>
        <Col span={10}>
          <Row>
            <Col span={24}>
              <Card title="Advantages" style={{ height: '100%' }}>
                <Row>
                  <Col span={12}>
                    <Card
                      style={{ margin: '5px' }}
                      title={
                        <Tooltip title="The following section describes the technique and mutability of the parameters used in the strategy">
                          Advanced Infrastructure
                        </Tooltip>
                      }
                    >
                      <Row>
                        <Col span={24}>
                          <p>
                            BTFs are dynamically weighted Balancer V3 DEX pools
                          </p>
                          <p>
                            While the rebalancing process of index and ETP
                            products can be an inefficient periodic process, the
                            BTF pool offers a price to external arbitrageurs
                            that keeps in line with the market price and the
                            current BTF weights. This is one of the tried and
                            tested innovations of blockchain and requires no
                            complex execution/auction and no BTF custodian or
                            governing manager.
                          </p>
                          <p>
                            This also offers an additional swap fee revenue from
                            noise traders and DEX Aggregators.
                          </p>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card
                      style={{ margin: '5px', height: '97%' }}
                      title={
                        <Tooltip title="The following represent different forms of the lambda setting used for different tooling">
                          Responsive Strategies
                        </Tooltip>
                      }
                    >
                      <Row>
                        <Col span={24}>
                          <p>
                            QuantAMM believes in transparency though
                            decentralisation
                          </p>
                          <p>
                            The re-weighting strategy and parameters are a
                            visible contract on-chain. No opaque strategy vault
                            managers. Chainlink provides data integrity.
                          </p>
                          <p>
                            Given novel patented technology the re-weighting
                            strategies run cheaply on-chain and daily
                            re-weighting is possible even on L1s such as
                            Ethereum Mainnet.
                          </p>
                          <p>
                            This is important given the majority of liquidity
                            depth is still on mainnet
                          </p>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card
                      title="Secure Balancer Vault"
                      style={{ margin: '5px' }}
                    >
                      <Row>
                        <Col span={24}>
                          <p>
                            QuantAMM is a Balancer V3 launch partner. The start
                            of the art Balancer Vault manages all non custodial
                            deposits and withdrawals with advanced disaster
                            recovery features.
                          </p>
                          <p>
                            While QuantAMM has performed competitive and private
                            audits of it&apos;s own, the Balancer Vault has had
                            its own numerous audits, large bug bounties and
                            real-time monitoring. The vault manages all pools on
                            Balancer V3.
                          </p>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Cross asset baskets" style={{ margin: '5px' }}>
                      <Row>
                        <Col span={24}>
                          <p>
                            PAXOS tokenisation of gold allows for a combined
                            product that bridges the gap between traditional
                            safe havens and blockchain based safe havens.
                          </p>
                          <p>
                            With an automatically rebalancing BTF that provides
                            you with a transferable pool LP token, you can own a
                            token that will be redeemable with the proportional
                            weights and value of the underlying assets. All non
                            custodial and on-chain.
                          </p>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={1}></Col>
        <Col span={11}>
          <Card
            style={{ height: '100%' }}
            title={<Tooltip title="TODOs">Risks</Tooltip>}
          >
            <Row>
              <Col span={12}>
                <Card
                  style={{ margin: '5px' }}
                  title={
                    <Tooltip title="The following section describes the technique and mutability of the parameters used in the strategy">
                      Directional Strategies
                    </Tooltip>
                  }
                >
                  <Row>
                    <Col span={24}>
                      <p>
                        Having visible strategies with known parameters is
                        advantageous as you can model risk and performance in
                        all the ways traditional finance is used to. However
                        they do take positions based on their interpretation of
                        markets. This is a directional position that will incur
                        risk and loss of capital if the market moves against the
                        strategy.
                      </p>
                      <p>
                        As bitcoin is a volatile asset, even though it can be
                        considered a safe haven asset, investing in a BTF
                        introduces unique risk.
                      </p>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  style={{ margin: '5px', height: '97%' }}
                  title={
                    <Tooltip title="The following represent different forms of the lambda setting used for different tooling">
                      AMM Mathematics
                    </Tooltip>
                  }
                >
                  <Row>
                    <Col span={24}>
                      <p>
                        Automated market makers have some unique risks if a
                        constituent goes to 0 in a depeg scenario.
                      </p>
                      <p>
                        The pools rebalance automatically causing a potential
                        complete loss of funds
                      </p>
                      <p>
                        Balancer V3 has modern features such as pausing a pool
                        to mitigate this however a loss in such as is dependant
                        on timing of any intervention. If a pool is paused or in
                        a recovery state you can still withdraw the underlying
                        assets at a proportional quantity to your LP tokens.
                      </p>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Contract Risk" style={{ margin: '5px' }}>
                  <Row>
                    <Col span={24}>
                      <p>
                        Blockchain technologies run on largely immutable
                        contracts. There are always risks that there is an issue
                        or a deviation from expected behaviour in the code. This
                        could range from minor deviations of intended logic to
                        capital loss.
                      </p>
                      <p>
                        QuantAMM has performed private audits of the codebase as
                        well as competition based audits. Balancer has also
                        performed the same and has large bug bounties to
                        incentivise identification of any issues.
                      </p>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title="Oracle / Data Manipulation"
                  style={{ margin: '5px' }}
                >
                  <Row>
                    <Col span={24}>
                      <p>
                        Re-weightings rely on price data. This data has to be
                        correct for the strategy to run.
                      </p>
                      <p>
                        Chainlink is an oracle provider that provides data
                        integrity through proof of consensus. This oracle
                        network is the insitutional standard for on-chain data
                        and is resilient to manipulation. QuantAMM strategies
                        also rely on smoothing of data and work in terms of
                        days. This also provides a level of protection at the
                        algorthmic layer.
                      </p>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 style={{ marginLeft: '10px' }}>
            RE-WEIGHTING STRATEGY PARAMETER SELECTION
          </h1>
        </Col>
        <Col span={1}></Col>
      </Row>

      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <p>
            The power channel strategy has parameters that determine how
            aggressive a strategy re-weights to different assets as well as the
            memory of prices that get taken into account.
          </p>
          <p>
            A training period of TODO-August 2024 was selected and parameters
            were selected using the machine learning technique called:
            Stochastic Gradient Descent. This was performed by the QuantAMM team
            using the QuantAMM simulator framework. A parameter set was selected
            that maximised the Sharpe Ratio of the strategy. This was selected
            over other objectives such as maximising Ulcer or Calmer Ratios as
            the parameter set showed better test set statistics. Random [TODO]
            length windows were selected within the test price range and trading
            was performed over [TODO] steps and in batches of [] runs.
          </p>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={10}>
          <Col span={24}>
            <Card title="Training window TODO - Aug 2024">
              <Row>
                <Col span={24}>
                  <div hidden={loading}>
                    <h5>Constituent weights over time</h5>
                    <WeightChangeOverTimeGraph
                      simulationRunBreakdown={breakdowns.safeHavenBTFAugTrain}
                      overrideChartTheme="ag-default-dark"
                      overrideXAxisInterval={22}
                    />
                    <h5>Cumulative performance over time</h5>
                    <SimulationResultMarketValueChart
                      hideTitle={true}
                      breakdowns={
                        loading
                          ? []
                          : [
                              breakdowns.safeHavenBTFAugTrain,
                              breakdowns.safeHavenCFMMAugTrain,
                              breakdowns.safeHavenHodlAugTrain,
                            ]
                      }
                      overrideXAxisInterval={22}
                      forceViewResults={true}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Col>
        <Col span={1}></Col>
        <Col span={11}>
          <Row>
            <Col span={12}>
              <Card
                style={{ margin: '5px' }}
                title={
                  <Tooltip title="The following section describes the technique and mutability of the parameters used in the strategy">
                    MEV protections
                  </Tooltip>
                }
              >
                <Row>
                  <Col span={24}>
                    <p>
                      Absolute min weight guard rails of 10% and 3% were tests.
                      The final guard rail chosen was 3%.
                    </p>
                    <p>
                      The speed limit weights can change in one day (epsilon
                      max) was selected to be [TODO]
                    </p>
                    <p>
                      The speed limit is tied to a maximum trade size of 10% of
                      pool constituent reserves.
                    </p>
                    <Col span={12}>
                      <Button size="small">Documentation</Button>
                    </Col>
                    <Col span={12}>
                      <Button size="small">Simulator</Button>
                    </Col>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                style={{ margin: '5px', height: '97%' }}
                title={
                  <Tooltip title="The following represent different forms of the lambda setting used for different tooling">
                    Lambda Settings
                  </Tooltip>
                }
              >
                <Row>
                  <Col span={24}>
                    <Tooltip title="Memory Days">
                      <p>Memory Days: 0.5</p>
                    </Tooltip>
                  </Col>
                  <Col span={24}>
                    <Tooltip title="Lambda">
                      <p>Memory Days: 0.5</p>
                    </Tooltip>
                  </Col>
                  <Col span={24}>
                    <Tooltip title="Memory Days">
                      <p>Memory Days: 0.5</p>
                    </Tooltip>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Aggressiveness" style={{ margin: '5px' }}>
                <Row>
                  <Col span={24}>
                    <p>
                      The following represent different forms of the lambda
                      setting used for different tooling
                    </p>
                  </Col>
                  <Col span={24}>
                    <Tooltip title="Memory Days">
                      <p>Aggressiveness: 0.5</p>
                    </Tooltip>
                  </Col>
                  <Col span={24}>
                    <Tooltip title="k">
                      <p>k: 0.5</p>
                    </Tooltip>
                  </Col>
                  <Col span={24}>
                    <Tooltip title="logk">
                      <p>logk: 0.5</p>
                    </Tooltip>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Exponent" style={{ margin: '5px' }}>
                <Row>
                  <Col span={24}>
                    <p>
                      The following represent different forms of the lambda
                      setting used for different tooling
                    </p>
                  </Col>
                  <Col span={24}>
                    <Tooltip title="Memory Days">
                      <p>Aggressiveness: 0.5</p>
                    </Tooltip>
                  </Col>
                  <Col span={24}>
                    <Tooltip title="k">
                      <p>k: 0.5</p>
                    </Tooltip>
                  </Col>
                  <Col span={24}>
                    <Tooltip title="logk">
                      <p>logk: 0.5</p>
                    </Tooltip>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={24}>
              <div hidden={loading}></div>
            </Col>
          </Row>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 style={{ marginLeft: '10px' }}>DISCLAIMERS</h1>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={22}>
          <h1 style={{ marginLeft: '10px' }}>LEGAL</h1>
        </Col>
        <Col span={1}></Col>
      </Row>
    </div>
  );
}
