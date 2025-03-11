import { Button, Col, Row, Typography } from "antd";
import { ProductItemBackground } from "../../../productExplorer/productItem/productItemBackground";
import { WeightChangeOverTimeGraph } from '../../../shared/graphs/weightChangeOverTime';
import { SimulationRunBreakdown } from "../../../simulationResults/simulationResultSummaryModels";
import { useEffect, useState } from "react";
import { getBreakdown, Pool } from '../../../../services/breakdownService';
import { ROUTES } from "../../../../routesEnum";
import {
    CheckOutlined,
  } from '@ant-design/icons';

const { Title } = Typography;

export function QuantAmmExplainer() {
    const [breakdowns, setBreakdowns] = useState<SimulationRunBreakdown[]>([]);
      const [loading, setLoading] = useState<boolean>(true);
    
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
          console.log('Fetched breakdowns:', fetchedBreakdowns);
          setBreakdowns(fetchedBreakdowns);
          console.log('Breakdowns:', breakdowns);
          return fetchedBreakdowns;
        };
    
        const loadData = async (): Promise<SimulationRunBreakdown[]> => {
          // Load breakdowns for the selected tab
          return await loadBreakdowns([
            'balancerWeighted',
            'quantAMMAntiMomentum',
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
        console.log('Breakdowns:', breakdowns);
      }, [setBreakdowns, setLoading, breakdowns, loading]);
    
      
    return <ProductItemBackground
      wide={true}
      layers={20}
      backgroundColourOverride="#FFFEF2"
      borderColourOverride="#f6f4ef"
    >
      <Row id={'quantamm_game_changers'}>
        <Col span={24}>
          <Title
            style={{
              color: '#162536',
              textAlign: 'center',
              marginBottom: 0,
            }}
          >
            QuantAMM Pools: Blockchain Traded Funds
          </Title>
        </Col>
      </Row>
      <Row style={{ marginTop: '5vh' }}>
        <Col span={1}></Col>
        <Col
          span={7}
          style={{ padding: '5vh', height: '30vh', paddingTop: '10px' }}
        >
          <div style={{ marginTop: '10vh' }}>
            <img
              loading="lazy"
              style={{
                width: '80%',
                height: '80%',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              src="/background/blueSand.png"
            />
          </div>
          <h2 style={{ color: 'red', textAlign: 'center' }}>FACT</h2>
          <h3 style={{ color: 'red', textAlign: 'center' }}>
            {' '}
            Crypto markets are volatile and cyclical
          </h3>
        </Col>
        <Col
          span={8}
          style={{ padding: '5vh', height: '30vh', paddingTop: '10px' }}
        >
          <Col span={24}>
            <h4
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            >
              Traditional DEX Pool Holdings
            </h4>
            <p
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            >
              Focus on earning trading swap fees and ignore price
              movements
            </p>
            <div
              style={{ padding: 0 }}
              hidden={
                (loading && breakdowns.length == 0) ||
                breakdowns.filter(
                  (x) =>
                    x.simulationRun.updateRule.updateRuleName ==
                    'Balancer Weighted'
                ).length == 0
              }
            >
              <WeightChangeOverTimeGraph
                simulationRunBreakdown={
                  breakdowns.filter(
                    (x) =>
                      x.simulationRun.updateRule.updateRuleName ==
                      'Balancer Weighted'
                  )[0]
                }
                overrideChartTheme="ag-default"
                overrideXAxisInterval={12}
              />
            </div>
          </Col>
          <Col span={24}>
            <h4
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            >
              QuantAMM BTF Pool Holdings
            </h4>
            <p
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            >
              Rebalance holdings to capitalise on prices WHILE still
              earning fees
            </p>
            <p
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            ></p>
            <div
              style={{ padding: 0 }}
              hidden={
                (loading && breakdowns.length == 0) ||
                breakdowns.filter(
                  (x) =>
                    x.simulationRun.updateRule.updateRuleName ==
                    'Balancer Weighted'
                ).length == 0
              }
            >
              <WeightChangeOverTimeGraph
                simulationRunBreakdown={
                  breakdowns.filter(
                    (x) =>
                      x.simulationRun.updateRule.updateRuleName ==
                      'AntiMomentum'
                  )[0]
                }
                overrideChartTheme="ag-default"
                overrideXAxisInterval={12}
              />
            </div>
          </Col>
          <Col
            span={24}
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '0',
            }}
          >
            <Button
              type="primary"
              onClick={() => (window.location.href = ROUTES.EXAMPLES)}
            >
              View Example Simulations
            </Button>
          </Col>
        </Col>
        <Col
          span={7}
          style={{ padding: '5vh', height: '30vh', paddingTop: '10px' }}
        >
          <Col span={24} style={{ marginTop: '6vh' }}>
            <h3
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            >
              Broad baskets and Themes
              <CheckOutlined
                style={{ color: 'green', marginLeft: '10px' }}
              />
            </h3>
            <p
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            >
              No need to be a blockchain and protocol expert
            </p>
          </Col>
          <Col span={24} style={{ marginTop: '5vh' }}>
            <h3
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            >
              Fire and forget
              <CheckOutlined
                style={{ color: 'green', marginLeft: '10px' }}
              />
            </h3>
            <p
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            >
              Automatic and fully on-chain, daily rebalancing
            </p>
          </Col>
          <Col span={24} style={{ marginTop: '5vh' }}>
            <h3
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            >
              Low fees
              <CheckOutlined
                style={{ color: 'green', marginLeft: '10px' }}
              />
            </h3>
            <p
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            >
              No streaming maintenance fees on deposits.
            </p>
          </Col>
          <Col span={24} style={{ marginTop: '5vh' }}>
            <h3
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            >
              Trustless
              <CheckOutlined
                style={{ color: 'green', marginLeft: '10px' }}
              />
            </h3>
            <p
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            >
              No off-chain stack, no annonymous manager.
            </p>
          </Col>
          <Col span={24} style={{ marginTop: '5vh' }}>
            <h3
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            >
              Simplicity
              <CheckOutlined
                style={{ color: 'green', marginLeft: '10px' }}
              />
            </h3>
            <p
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            >
              No moving liquidity. No complex trade routing.
            </p>
          </Col>
          <Col span={24} style={{ marginTop: '5vh' }}>
            <h3
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            >
              Known strategies
              <CheckOutlined
                style={{ color: 'green', marginLeft: '10px' }}
              />
            </h3>
            <p
              style={{ color: '#162536', textAlign: 'center', margin: 0 }}
            >
              Know exposure origins. Simulate performance and risk.
            </p>
          </Col>
        </Col>
        <Col span={1} style={{ paddingTop: '10px' }}></Col>
      </Row>
    </ProductItemBackground>
}