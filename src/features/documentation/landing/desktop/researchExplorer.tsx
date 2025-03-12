import { Button, Card, Col, Row, Tooltip } from "antd";

import {
    BarChartOutlined,
    BlockOutlined,
    BuildOutlined,
    FundViewOutlined,
    HourglassOutlined,
    NodeIndexOutlined,
    PieChartOutlined,
    ReadOutlined,
    SwapOutlined,
  } from '@ant-design/icons';

const articleCardGridStyle: React.CSSProperties = {
  width: '33.33%',
  textAlign: 'center',
  padding: '10px',
};

export function ResearchExplorer(){
    return <Row
    style={{
      height: '100%',
      marginTop: '5vh',
    }}
  >
    <Col span={24}>
      <div style={{ justifyContent: 'center' }}>
        <Row style={{ marginTop: '5vh' }}>
          <Col span={24}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                title="Explore the bleeding-edge research that makes QuantAMM possible"
                style={{ width: '90%' }}
              >
                <Card.Grid style={articleCardGridStyle}>
                  <Tooltip title="A detailed explanation of the underlying AMM mechanism that makes QuantAMM possible">
                    <PieChartOutlined
                      style={{ fontSize: '60px', marginTop: '10px' }}
                    />
                    <h4 style={{ marginTop: '10px' }}>
                      Temporal Function Market Making Litepaper
                    </h4>
                  </Tooltip>
                  <Button
                    href="https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/6617c4c2381409947dc42c7a_TFMM_litepaper.pdf"
                    size="small"
                  >
                    View Full Paper
                  </Button>
                </Card.Grid>
                <Card.Grid style={articleCardGridStyle}>
                  <Tooltip title="Blockchain Traded Funds: their construction, strategy tuning and application">
                    <HourglassOutlined
                      style={{ fontSize: '60px', marginTop: '10px' }}
                    />
                    <h4>QuantAMM Protocol Litepaper</h4>
                  </Tooltip>
                  <Button
                    href="https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/6617c4c260d10f98e065f1ea_QuantAMM_Litepaper.pdf"
                    size="small"
                  >
                    View Full Paper
                  </Button>
                </Card.Grid>
                <Card.Grid style={articleCardGridStyle}>
                  <Tooltip title="A comparison of TFMM rebalancing for fund managers compared to running CEX portfolios">
                    <BarChartOutlined
                      style={{ fontSize: '60px', marginTop: '10px' }}
                    />
                    <h4>
                      RVR - Improving the fidelity of
                      Loss-versus-Rebalancing
                    </h4>
                  </Tooltip>
                  <Button
                    href="https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/672283811331fc9bef39be23_RVR_30_10_24.pdf"
                    size="small"
                  >
                    View Full Paper
                  </Button>
                </Card.Grid>
                <Card.Grid style={articleCardGridStyle}>
                  <Tooltip title="Linear interpolation between two target weights is Efficient. This paper explores further efficiencies available in non-linear rebalancing mechanisms">
                    <NodeIndexOutlined
                      style={{ fontSize: '60px', marginTop: '10px' }}
                    />
                    <h4>Optimal Rebalancing in Dynamic AMMs</h4>
                  </Tooltip>
                  <Button
                    href="https://arxiv.org/abs/2403.18737"
                    size="small"
                  >
                    View Full Paper
                  </Button>
                </Card.Grid>
                <Card.Grid style={articleCardGridStyle}>
                  <Tooltip title="For N-token trades, convex solvers have been required to find the optimal trade. This paper provides a closed-form solution for arbitrage.">
                    <SwapOutlined
                      style={{ fontSize: '60px', marginTop: '10px' }}
                    />
                    <h4>
                      Closed-form solutions for generic N-token AMM
                      arbitrage
                    </h4>
                  </Tooltip>
                  <Button
                    href="https://arxiv.org/abs/2402.06731"
                    size="small"
                  >
                    View Full Paper
                  </Button>
                </Card.Grid>
                <Card.Grid style={articleCardGridStyle}>
                  <Tooltip title="Dynamic weight AMMs provide a multiblock MEV opportunity. This paper outlines the types of protections required to prevent further loss">
                    <BuildOutlined
                      style={{ fontSize: '60px', marginTop: '10px' }}
                    />
                    <h4>
                      Multiblock MEV opportunities & protections in
                      dynamic AMMs
                    </h4>
                  </Tooltip>
                  <Button
                    href="https://arxiv.org/abs/2404.15489"
                    size="small"
                  >
                    View Full Paper
                  </Button>
                </Card.Grid>
                <Card.Grid style={articleCardGridStyle}>
                  <Tooltip title="An overview on TFMM mechanisms and why asset management is the primary focus">
                    <BlockOutlined
                      style={{ fontSize: '60px', marginTop: '10px' }}
                    />
                    <h4>
                      The use of AMM forumlas outside of core liquidity
                      providing
                    </h4>
                  </Tooltip>
                  <Button
                    href="https://medium.com/@QuantAMM/temporal-function-market-making-tfmm-the-use-of-amms-outside-of-core-liquidity-providing-bc403e76b97"
                    size="small"
                  >
                    View Article
                  </Button>
                </Card.Grid>
                <Card.Grid style={articleCardGridStyle}>
                  <Tooltip title="Comparing the current DeFi evolution to TradFi and where BTFs fit in">
                    <FundViewOutlined
                      style={{ fontSize: '60px', marginTop: '10px' }}
                    />
                    <h4>
                      The State of Asset Management in DeFi and the BTF
                      Revolution
                    </h4>
                  </Tooltip>
                  <Button
                    href="https://medium.com/@QuantAMM/the-state-of-asset-management-in-defi-and-the-btf-revolution-5622abf9920a"
                    size="small"
                  >
                    View Article
                  </Button>
                </Card.Grid>
                <Card.Grid style={articleCardGridStyle}>
                  <Tooltip title="TFMMs are one new approach to AMMs. This article explores other approaches and their trade-offs">
                    <ReadOutlined
                      style={{ fontSize: '60px', marginTop: '10px' }}
                    />
                    <h4>
                      Looking back at AMMs of 2023: Innovations and new
                      approaches
                    </h4>
                  </Tooltip>
                  <Button
                    href="https://medium.com/@QuantAMM/looking-back-at-amms-of-2023-innovations-and-new-approaches-834d373b4f3b"
                    size="small"
                  >
                    View Article
                  </Button>
                </Card.Grid>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </Col>
  </Row>
}