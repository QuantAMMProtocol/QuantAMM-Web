import { Button, Col, Grid, Row } from 'antd';
import { MathJaxContext } from 'better-react-mathjax';
import styles from './documentation.module.css';

interface ResearchProps {
  title: string;
  tldr: string;
  abstract: string[];
  link: string;
}

const { useBreakpoint } = Grid;

export default function Research() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;

  const research: ResearchProps[] = [
    {
      title: 'Temporal Function Market Making Litepaper',
      tldr: 'AMMs bet on swap fees by retail and keep weights constant. TFMM moves pool holdings to appreciating assets by changing the trading function over time.',
      abstract: [
        'First generation AMMs instantiate an extremely limited and fixed strategy: a simple holding strategy very often provides superior returns compared to depositing into a CFMM. Recent analysis has expanded on the issue of loss vs rebalancing, and LPs have moved to new solutions of ranged liquidity and limit order books. The fixed-weight strategy is a defining reason for the difficulties of AMMs, and altering the strategies applied is the simplest and most effective mechanism to make AMMs profitable.',
        'We introduce Temporal-Function Market Marking (TFMM), where the trading function of an AMM pool, and thus its desired deployment of value, changes with time. Differing from pools that allow external or stochastic updates to weight vectors, TFMMs enables dynamic AMM pools that run continuous, fully-on-chain quantitative strategies.',
        'We give a short background on the fundamentals of AMMs and then outline, both theoretically and in simulation (expanded to real-world scenarios in the QuantAMM paper), how TFMMs can outperform HODL as well as earlier-generation AMMs.',
        'We then expand on how a dynamic re-weighting of an AMM pool can be implemented inexpensively on-chain. Further, a novel approach to hierarchical composability of AMM pools (composite pools) allows automated risk management on top of multiple strategies, without adding additional trade routing complexity.',
      ],
      link: 'https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/6617c4c2381409947dc42c7a_TFMM_litepaper.pdf',
    },
    {
      title: 'QuantAMM Protocol Litepaper',
      tldr: 'QuantAMM is the first protocol to utilise Temporal Function Market Making (TFMM). This paper explores strategies to determine weight trajectories for TFMM pools.',
      abstract: [
        'QuantAMM is the first protocol to utilise Temporal Function Market Making (TFMM). While still providing AMM functionality, core liquidity providing is not the primary objective on QuantAMM: TFMM is used to provide the rebalancing mechanism for on-chain quantitative asset management. This enables a new generation of DeFi passive products–Blockchain Traded Funds or BTFs. QuantAMM is targeting future institutional use by providing on-chain feature hooks that can likely enable necessary regional regulatory compliance.',
        'Utilizing novel gradient and precision estimators, standard portfolio management strategies are outlined and simulated, demonstrating the strength of the TFMM approach outside of traditional liquidity providing.',
        'We give a summary on TradFi fund construction and how QuantAMM utilises TFMM to provide the required on-chain infrastructure. Rigorous strategy testing approaches are also outlined to show approach efficacy.',
      ],
      link: 'https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/6617c4c260d10f98e065f1ea_QuantAMM_Litepaper.pdf',
    },
    {
      title:
        'Rebalancing-versus-Rebalancing: Improving the fidelity of Loss-versus-Rebalancing',
      tldr: 'LVR is a pivotal metric for measuring how efficient an AMM rebalances against a benchmark of perfect rebalancing as a price taker. LVR does not capture the frictions present in centralised rebalancing. RVR capures CEX spreads, fees, AMM gas and fees for a more realistic comparison.',
      abstract: [
        'Automated Market Makers (AMMs) hold assets and are constantly being rebalanced by external arbitrageurs to match external market prices. Loss-versus-rebalancing (LVR) is a pivotal metric for measuring how an AMM pool performs for its liquidity providers (LPs) relative to an idealised benchmark where rebalancing is done not via the action of arbitrageurs but instead by trading with a perfect centralised exchange with no fees, spread or slippage. This renders it an imperfect tool for judging rebalancing efficiency between execution platforms.',
        'We introduce Rebalancing-versus-rebalancing (RVR), a higher-fidelity model that better captures the frictions present in centralised rebalancing.',
        'We perform a battery of experiments comparing managing a portfolio on AMMs vs this new and more realistic centralised exchange benchmark—RVR. We are also particularly interested in dynamic AMMs that run strategies beyond fixed weight allocations–Temporal Function Market Makers. This is particularly important for asset managers evaluating execution management systems. In this paper we simulate more than 1000 different strategies settings as well as testing hundreds of different variations in centralised exchange (CEX) fees, AMM fees & gas costs.',
        'We find that, under this modeling approach, AMM pools (even with no retail/noise traders) often offer superior performance to CEXs for rebalancing, and that the performance of AMMs can be improved by using dynamic strategies.',
      ],
      link: 'https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/672283811331fc9bef39be23_RVR_30_10_24.pdf',
    },
    {
      title: 'Optimal Rebalancing in Dynamic AMMs',
      tldr: 'When changing weights in an AMM over time, you can change your weights in a linear manner. This paper explores non-linear routes between two target weights that are more efficient.',
      abstract: [
        'Dynamic AMM pools, as found in Temporal Function Market Making, rebalance their holdings to a new desired ratio (e.g. moving from being 50-50 between two assets to being 90-10 in favour of one of them) by introducing an arbitrage opportunity that disappears when their holdings are in line with their target. Structuring this arbitrage opportunity reduces to the problem of choosing the sequence of portfolio weights the pool exposes to the market via its trading function. Linear interpolation from start weights to end weights has been used to reduce the cost paid by pools to arbitrageurs to rebalance. Here we obtain the optimal interpolation in the limit of small weight changes (which has the downside of requiring a call to a transcendental function) and then obtain a cheap-to-compute approximation to that optimal approach that gives almost the same performance improvement. We then demonstrate this method on a range of market backtests, including simulating pool performance when trading fees are present, finding that the new approximately-optimal method of changing weights gives robust increases in pool performance. For a BTC-ETH-DAI pool from July 2022 to June 2023, the increases of pool P&L from approximately-optimal weight changes is ∼25% for a range of different strategies and trading fees.',
      ],
      link: 'https://arxiv.org/abs/2403.18737',
    },
    {
      title: 'Closed-form solutions for generic N-token AMM arbitrage',
      tldr: 'Is there a closed form solution to detecting arbitrage opportunities in AMMs. Yes, and it is faster than convex solvers.',
      abstract: [
        'Convex optimisation has provided a mechanism to determine arbitrage trades on automated market markets (AMMs) since almost their inception. Here we outline generic closed-form solutions for N-token geometric mean market maker pool arbitrage, that in simulation (with synthetic and historic data) provide better arbitrage opportunities than convex optimisers and is able to capitalise on those opportunities sooner. Furthermore, the intrinsic parallelism of the proposed approach (unlike convex optimisation) offers the ability to scale on GPUs, opening up a new approach to AMM modelling by offering an alternative to numerical-solver-based methods. The lower computational cost of running this new mechanism can also enable on-chain arbitrage bots for multi-asset pools.',
      ],
      link: 'https://arxiv.org/abs/2402.06731',
    },
    {
      title: 'Multiblock MEV opportunities & protections in dynamic AMMs',
      tldr: 'Changing weights presents the same opportunity for MEV as a trade over multiple blocks. Is there a way to attack that and what protections are there? Yes, changing weights slowly protects you over a known number of blocks.',
      abstract: [
        'Maximal Extractable Value (MEV) in Constant Function Market Making is fairly well understood. Does having dynamic weights, as found in liquidity bootstrap pools (LBPs), Temporal-function market makers (TFMMs), and Replicating market makers (RMMs), introduce new attack vectors? In this paper we explore how inter-block weight changes can be analogous to trades, and can potentially lead to a multi-block MEV attack. New inter-block protections required to guard against this new attack vector are analysed. We also carry out a raft of numerical simulations, more than 450 million potential attack scenarios, showing both successful attacks and successful defense.',
      ],
      link: 'https://arxiv.org/abs/2404.15489',
    },
  ];

  return (
    <div>
      {isMobile ? (
        <Row>
          <Col span={1}></Col>
          <Col span={22}>
            <MathJaxContext>
              <Row>
                <Col span={24}>
                  {research.map((item, index) => (
                    <Row key={index}>
                      <Col span={24}>
                        <Row>
                          <Col span={24}>
                            <h3
                              className={styles.researchSecondaryText}
                            >
                              {item.title}
                            </h3>
                            <p>
                              <span className={styles.fontWeightBold}>TLDR</span>{' '}
                              {item.tldr}
                            </p>
                          </Col>
                          <Col span={24}>
                            <p>
                              <span className={styles.fontWeightBold}>
                                ABSTRACT:
                              </span>{' '}
                              {item.abstract.map((paragraph, pIndex) => (
                                <p key={pIndex}>{paragraph}</p>
                              ))}
                            </p>
                          </Col>
                          <Col
                            span={24}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}                          >
                            <Button href={item.link} type="primary">
                              View Full Article
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ))}
                </Col>
              </Row>
            </MathJaxContext>
          </Col>
          <Col span={1}></Col>
        </Row>
      ) : (
        <MathJaxContext>
          <Row>
            <Col span={1}></Col>
            <Col className={styles.researchDesktopContainer} span={23}>
              {research.map((item, index) => (
                <Row key={index}>
                  <Col span={24}>
                    <Row>
                      <Col span={4} className={styles.researchDesktopLeftCol}>
                        <h3 className={styles.researchSecondaryText}>
                          {item.title}
                        </h3>
                        <p>
                          <span className={styles.fontWeightBold}>TLDR</span>{' '}
                          {item.tldr}
                        </p>
                      </Col>
                      <Col span={17} className={styles.researchDesktopMiddleCol}>
                        <p>
                          <span className={styles.fontWeightBold}>ABSTRACT:</span>{' '}
                          {item.abstract.map((paragraph, pIndex) => (
                            <p key={pIndex}>{paragraph}</p>
                          ))}
                        </p>
                      </Col>
                      <Col
                        span={3}
                        style={{
                          padding: 10,
                          display: 'flex',
                          alignItems: 'center',
                        }}                      >
                        <Button href={item.link} type="primary">
                          View Full Article
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
        </MathJaxContext>
      )}
    </div>
  );
}

export { Research };
