import React from 'react';
import { Button, Card, Col, Row, Tooltip } from 'antd';
import styles from './landingDesktop.module.css';

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

interface ResearchItem {
  key: string;
  title: string;
  href: string;
  tooltip: string;
  cta?: string;
  Icon: React.ComponentType<React.ComponentProps<'span'>>;
}

const items: ResearchItem[] = [
  {
    key: 'tfmm-litepaper',
    title: 'Temporal Function Market Making Litepaper',
    href: 'https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/6617c4c2381409947dc42c7a_TFMM_litepaper.pdf',
    tooltip:
      'A detailed explanation of the underlying AMM mechanism that makes QuantAMM possible',
    cta: 'View Full Paper',
    Icon: PieChartOutlined,
  },
  {
    key: 'quantamm-litepaper',
    title: 'QuantAMM Protocol Litepaper',
    href: 'https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/6617c4c260d10f98e065f1ea_QuantAMM_Litepaper.pdf',
    tooltip:
      'Blockchain Traded Funds: their construction, strategy tuning and application',
    cta: 'View Full Paper',
    Icon: HourglassOutlined,
  },
  {
    key: 'rvr',
    title: 'RVR - Improving the fidelity of Loss-versus-Rebalancing',
    href: 'https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/672283811331fc9bef39be23_RVR_30_10_24.pdf',
    tooltip:
      'A comparison of TFMM rebalancing for fund managers compared to running CEX portfolios',
    cta: 'View Full Paper',
    Icon: BarChartOutlined,
  },
  {
    key: 'optimal-rebalancing',
    title: 'Optimal Rebalancing in Dynamic AMMs',
    href: 'https://arxiv.org/abs/2403.18737',
    tooltip:
      'Linear interpolation between two target weights is Efficient. This paper explores further efficiencies available in non-linear rebalancing mechanisms',
    cta: 'View Full Paper',
    Icon: NodeIndexOutlined,
  },
  {
    key: 'n-token-arb',
    title: 'Closed-form solutions for generic N-token AMM arbitrage',
    href: 'https://arxiv.org/abs/2402.06731',
    tooltip:
      'For N-token trades, convex solvers have been required to find the optimal trade. This paper provides a closed-form solution for arbitrage.',
    cta: 'View Full Paper',
    Icon: SwapOutlined,
  },
  {
    key: 'multiblock-mev',
    title: 'Multiblock MEV opportunities & protections in dynamic AMMs',
    href: 'https://arxiv.org/abs/2404.15489',
    tooltip:
      'Dynamic weight AMMs provide a multiblock MEV opportunity. This paper outlines the types of protections required to prevent further loss',
    cta: 'View Full Paper',
    Icon: BuildOutlined,
  },
  {
    key: 'tfmm-overview',
    title: 'The use of AMM forumlas outside of core liquidity providing',
    href: 'https://medium.com/@QuantAMM/temporal-function-market-making-tfmm-the-use-of-amms-outside-of-core-liquidity-providing-bc403e76b97',
    tooltip:
      'An overview on TFMM mechanisms and why asset management is the primary focus',
    cta: 'View Article',
    Icon: BlockOutlined,
  },
  {
    key: 'btf-revolution',
    title: 'The State of Asset Management in DeFi and the BTF Revolution',
    href: 'https://medium.com/@QuantAMM/the-state-of-asset-management-in-defi-and-the-btf-revolution-5622abf9920a',
    tooltip:
      'Comparing the current DeFi evolution to TradFi and where BTFs fit in',
    cta: 'View Article',
    Icon: FundViewOutlined,
  },
  {
    key: 'amm-innovations-2023',
    title: 'Looking back at AMMs of 2023: Innovations and new approaches',
    href: 'https://medium.com/@QuantAMM/looking-back-at-amms-of-2023-innovations-and-new-approaches-834d373b4f3b',
    tooltip:
      'TFMMs are one new approach to AMMs. This article explores other approaches and their trade-offs',
    cta: 'View Article',
    Icon: ReadOutlined,
  },
];

export function ResearchExplorer() {
  return (
    <Row className={styles.researchRoot}>
      <Col span={24}>
        <div className={styles.centeredRow}>
          <Row className={styles.researchSpacer}>
            <Col span={24}>
              <div className={styles.centeredRow}>
                <Card
                  title="Explore the bleeding-edge research that makes QuantAMM possible"
                  className={styles.researchCard}
                >
                  {items.map(
                    ({ key, title, href, tooltip, cta = 'Open', Icon }) => (
                      <Card.Grid key={key} className={styles.researchGrid}>
                        <Tooltip title={tooltip}>
                          <div className={styles.researchTitleArea}>
                            <Icon className={styles.researchIcon} />
                            <h4 className={styles.researchTitle}>{title}</h4>
                          </div>
                        </Tooltip>

                        <Button href={href} size="small">
                          {cta}
                        </Button>
                      </Card.Grid>
                    )
                  )}
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
}
