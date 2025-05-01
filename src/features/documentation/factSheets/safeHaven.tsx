import { Button, Card, Col, Row, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { Radio } from 'antd';
import { SimulationRunBreakdown } from '../../simulationResults/simulationResultSummaryModels';
import { getBreakdown, Pool } from '../../../services/breakdownService';
import { WeightChangeOverTimeGraph } from '../../shared/graphs/weightChangeOverTime';
import { PowerChannelUpdateRule } from '../updateRules/powerChannelUpdateRule';
import { SimulationResultMarketValueChart } from '../../simulationResults/visualisations/simulationResultMarketValueChart';

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

  return (
    <div>
      <Row>
        <Col span={24}>
          <h2>Safe Haven</h2>
          <p>
            A safe haven is an investment that is expected to retain or increase
            in value during times of market turbulence. Safe havens are
            typically low-risk assets that investors turn to when they are
            concerned about the stability of the financial markets. Examples of
            safe havens include gold, U.S. Treasury bonds, and certain
            currencies like the Swiss franc.
          </p>
        </Col>
        <Col span={24}>
          <p>
            Safe havens are often characterized by their low correlation with
            the broader market, meaning they tend to perform well when other
            investments are struggling. This makes them an attractive option for
            investors looking to hedge against market volatility and protect
            their portfolios.
          </p>
        </Col>
        <Col span={24}>
          <p>
            In addition to their defensive qualities, safe havens can also
            provide a source of stability and predictability in an otherwise
            uncertain market. This can be particularly appealing for risk-averse
            investors or those nearing retirement who may not have the time or
            risk tolerance to weather significant market downturns.
          </p>
        </Col>
        <Col span={24}>
          <p>
            However, it is important to note that safe havens are not without
            their risks. While they may provide a level of protection during
            market downturns, they can also underperform during bull markets,
            leading to missed opportunities for growth. Additionally, the value
            of safe havens can be influenced by factors such as interest rates,
            inflation, and geopolitical events, which can create uncertainty and
            volatility in their own right.
          </p>
        </Col>
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={10}>
          <Row>
            <Col span={24}>
              <h4>Overview</h4>
            </Col>
          </Row>
        </Col>
        <Col span={2}></Col>
        <Col span={10}>
          <Row>
            <Col span={24}>
              <h4>Simulated Composition Over Time</h4>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
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
                <Radio.Button value="AugTrain">
                  Training Period: TODO-Aug24
                </Radio.Button>
              </Radio.Group>
            </Col>
            <Col span={24}>
              <WeightChangeOverTimeGraph
                simulationRunBreakdown={breakdowns[safeHavenBTF]}
                overrideChartTheme="ag-default-dark"
                overrideXAxisInterval={22}
              />
            </Col>
          </Row>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row>
        <Col span={1}></Col>
        <Col span={10}>
          <Row>
            <Col span={24}>
              <h1>Re-weighting strategy and parameters</h1>
            </Col>
            <Col span={24}>
              <PowerChannelUpdateRule hideTitle={true} />
            </Col>
          </Row>
        </Col>
        <Col span={2}></Col>
        <Col span={10}>
          <Row>
            <Col span={24}>
              <h4>Strategy Parameter selection</h4>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Card
                style={{ margin: '5px' }}
                title={
                  <Tooltip title="The following section describes the technique and mutability of the parameters used in the strategy">
                    Selection Methodology
                  </Tooltip>
                }
              >
                <Row>
                  <Col span={24}>
                    <h5>Selection Methodology</h5>
                    <p>
                      The basket was trained using SGD machine learning with an
                      objective function of maximizing Sharpe Ratio. This was
                      done using the QuantAMM simulator framework.
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
                style={{ margin: '5px' }}
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
    </div>
  );
}
