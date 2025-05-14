import { Button, Card, Col, Collapse, Row, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { Radio } from 'antd';
import { SimulationRunBreakdown } from '../../../simulationResults/simulationResultSummaryModels';
import { getBreakdown, Pool } from '../../../../services/breakdownService';
import { WeightChangeOverTimeGraph } from '../../../shared/graphs/weightChangeOverTime';
import { PowerChannelUpdateRule } from '../../updateRules/powerChannelUpdateRule';
import { SimulationResultMarketValueChart } from '../../../simulationResults/visualisations/simulationResultMarketValueChart';
import { AnalysisSimplifiedBreakdownTable } from '../../../simulationResults/breakdowns/simulationRunPerformanceSimpleTable';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { InfoCircleOutlined } from '@ant-design/icons';

export function BaseMacroFactSheetDesktop() {
  const [breakdowns, setBreakdowns] = useState<
    Record<string, SimulationRunBreakdown>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [faqEli5, setFAQEli5] = useState('ELI5');

  const items = [
    {
      key: '1',
      initialOpen: true,
      label: 'How do BTFs rebalance holdings?',
      children: (
        <>
          <div hidden={faqEli5 != 'ELI5'}>
            <p>
              Bitcoin&apos;s price is tanking. The BTF&apos;s automatic strategy
              says sell Bitcoin. Usually you need a go to an exchange and sell
              at a price quoted by the exchange. If you are selling a large
              amount or the exchange is offering a bad price you may not get the
              price you want.
            </p>
            <p>
              QuantAMM offers an attractive price to the global community for
              someone to buy the BTC off you.
            </p>
            <p>
              If done right offering a price is more efficient as you don&apos;t pay fees
              fees or slippage to an exchange
            </p>
            <p>
              It also removes considerable protocol complexity as you don&apos;t need
              a complex trade execution layer so the BTF can run fully on-chain.
              This means you don&apos;t have to trust an unknown manager to
              trade
            </p>
          </div>
          <div hidden={faqEli5 != 'Crypto Native'}>
            <p>
              BTFs are Balancer V3 DEX pools with weights that change from block
              to block. Using the standard G3M AMM pricing formula, by changing
              the weight you change the price. This offers a slightly off-market
              arbitrage opportunity to the market in the direction you want to
              rebalance. If that opportunity is large enough an external
              arbitrageur trades with you and rebalances your holdings.
            </p>
            <p>
              The arbitrageur pays fees to you and you experience minor slippage
              if the arbitrageurs are aggressive - a good assumption to make. If
              the (slippage - fees) is less than the (fees + slippage) you pay
              to an external exchange, offering a price was more efficient than
              taking a price.
            </p>
            <p>
              By offering tiny arbitrage opportunities per block you also avoid
              complex trade routing layers that require you to spread trades out
              across multiple venues and time to avoid MEV, sandwich attacks and
              slippage.
            </p>
          </div>
          <div hidden={faqEli5 != 'Quant'}>
            <MathJaxContext>
              <p>
                <span>
                  BTF architecture has weights based on block time{' '}
                  <MathJax inline>{' \\(w(t)\\) '}</MathJax>, given the
                  dependancy on time we call this Temporal Function Market
                  Making (TFMM) rather than Constant Function Market Making
                  (CFMM):
                </span>
              </p>
              <MathJax>
                {
                  '\\[\\prod_{i=1}^{N} R_i^{w_i(t)}= k(t), \\quad\\mathrm{where\\,} \\sum_{i=1}^N w_i(t) = 1, \\,\\,\\mathrm{and\\,\\,} \\forall i\\,\\, 0\\leq w_i(t)<1.\\]'
                }
              </MathJax>
              <p>
                <span>Since any trade with a pool must not decrease</span>
                <MathJax inline>{' \\(k(t)\\), '}</MathJax>
                <span>
                  the change in weights is all that is required to cause the
                  pool&apos;s reserves to be rebalanced: those trades which take
                  place are those which bring the reserves into the target
                  ratio, meaning that the DEX is not required to execute any
                  trades of its own to enact the rebalancing.
                </span>
              </p>
              <p>
                As <MathJax inline>{' \\(w(t)\\) '}</MathJax> changes between
                blocks, in any one block BTFs are standard G3M pools like
                vanilla Balancer Weighted pools. This means DEX aggregators,
                arbitrageurs, depositors all face known standard pricing and
                practices making integrations easier.
              </p>
            </MathJaxContext>
          </div>
        </>
      ),
    },
    {
      key: '2',
      label: 'Is it complex to LP?',
      children: (
        <>
          <div hidden={faqEli5 != 'ELI5'}>
            <p>
              Deposit your tokens into the BTF and get BTF tokens in your
              wallet. Withdraw the BTF token and get underlying tokens back.
            </p>
            <p>Fire and forget. Simple.</p>
            <p>
              No complex layered deposits, no lock ins, no maintenance fees.
            </p>
            <p>No Custodian. No Fuss.</p>
            <p>
              QuantAMM is built using Balancer V3. Your deposits have the safety of
              Balancer V3&apos;s state of the art vault.
            </p>
          </div>
          <div hidden={faqEli5 != 'Crypto Native'}>
            <p>
              You get pool ERC20 tokens proportional to your deposit. This may
              be a multitoken deposit proportional to the pool weights. Or it
              can be a single token unbalanced deposit that is slightly less
              efficient.
            </p>
            <p>
              As with most AMMs the total supply depends on deposits and
              withdrawals of others. This means that you do not have to do any
              maintenance or rebalancing yourself. When you come to withdraw the
              proportion of the underlying that equates to your pool tokens will
              be transferred to you.
            </p>
            <p>
              Balancer V3 is a non custodial AMM with a vault that
              is heavily audited.
            </p>
          </div>
          <div hidden={faqEli5 != 'Quant'}>
            <p>
              Proportional asset deposits and withdrawals are standard G3M and
              given changes in weights are small per block the min slippage can
              be small. As a reminder single asset deposits are defined as:
            </p>
            <MathJaxContext>
              <MathJax dynamic inline={false}>
                {
                  '\\[A_t = B_t \\cdot \\frac{\\left(\\left(1 + \\frac{P_{\\text{issued}}}{P_{\\text{supply}}}\\right)^{\\frac{1}{W_t}} - 1\\right)}{(1 - W_t) \\cdot swapFee}\\]'
                }
              </MathJax>
              <p>Single asset withdrawals are defined as:</p>
              <MathJax dynamic inline={false}>
                {`\\[P_{\\text{redeemed}} = P_{\\text{supply}} \\cdot \\left[ 1 - \\left( 1 - \\frac{\\frac{A_t}{(1 - (1 - W_t) \\cdot swapFee)}}{B_t} \\right)^{W_t} \\right]\\]`}
              </MathJax>
            </MathJaxContext>
          </div>
        </>
      ),
    },
    {
      key: '3',
      label: 'Do BTFs earn yield and swap fees?',
      children: (
        <>
          <div hidden={faqEli5 != 'ELI5'}>
            <p>
              BTFs are Balancer AMM pools. Retail swappers can still swap on the
              pools earning you swap fees on top of your BTF capital
              performance. If a constituent is yield bearing then that value is
              captured inside the BTF. Incentives are also provided and can be
              seen on the pool exploration pages.
            </p>
          </div>
          <div hidden={faqEli5 != 'Crypto Native'}>
            <p>
              Given the BTF is an AMM pool itself it has all the benefits of a
              next gen AMM. Balancer V3 has different kinds of routers including
              batch routers and MEV resistant routers. The pools also recycle
              yield back into the pool. As QuantAMM is built using Balancer V3
              DEX aggregation is also considerably easier increasing volumes.
            </p>
          </div>
          <div hidden={faqEli5 != 'Quant'}>
            <MathJaxContext>
              <MathJax>{'\\[\\prod_{i=1}^{N} R_i^{w_i(t)}= k(t)\\]'}</MathJax>
              <span>
                At any given block time BTFs becomes standard G3M pools and
                allow for any ratio of swaps.
              </span>
              <span>
                This means, not only is arbitrage possible but retail swaps
                possible.
              </span>
              <p>
                <span>
                  As the change in weights offer a slightly off market price
                  this may be the best price for retail.
                </span>
                <span>
                  Given the change in weights arbitrage volume is also typically
                  2x larger given.
                </span>
              </p>
              <p>The following gives a price for a swap:</p>

              <MathJax dynamic inline={false}>
                {`\\[1 - \\frac{\\Delta_2}{R_2} = \\left( 1 + \\gamma \\frac{\\Delta_1}{R_1} \\right)^{-\\frac{w_1}{w_2}}.\\]`}
              </MathJax>
            </MathJaxContext>
          </div>
        </>
      ),
    },
    {
      key: '4',
      label: "Isn't this vulnerable to MEV?",
      children: (
        <>
          <div hidden={faqEli5 != 'ELI5'}>
            <p>
              Maximal extractable value or MEV has the ultimate effect of
              leaking value of your trade to bots. QuantAMM BTFs adhere to
              stringent guards to make sure you leak as little value as
              possible. Our novel approach can be up to 15% more efficient than
              even VIP exchanges.
            </p>
          </div>
          <div hidden={faqEli5 != 'Crypto Native'}>
            <p>
              A change in weights is a change in the price of a token. This
              exposes a price difference across blocks leading to a potential
              multiblock arbitrage opportunity.
            </p>
            <p>
              Similarly, a large weight change is analogous to a large trade. In
              DeFi the larger the trade the greater the slippage and risk. By
              applying a speed limit to the weight changes based on substantial
              research this risk can be mitigated.
            </p>
          </div>
          <div hidden={faqEli5 != 'Quant'}>
            <MathJaxContext>
              <p>
                In this attack, the attacker first manipulates the pool&apos;s
                quoted price for the second token to be
                <MathJax inline>
                  {' \\(m_{\\text{manip, AMM, 2}} = (1 + \\epsilon)m_p\\) '}
                </MathJax>
                , where{' '}
                <MathJax inline>
                  {' \\(\\epsilon \\geq \\epsilon_0\\) '}
                </MathJax>
                .<MathJax inline>{' \\(\\epsilon_0\\) '}</MathJax> is the
                &apos;do nothing&apos; or &apos;NULL&apos; value—equivalent to
                there being no attack carried out. When fees are present and we
                are in a worst-case scenario for the pool,{' '}
                <MathJax inline>{' \\(\\epsilon_0 > 0\\) '}</MathJax>.
                <MathJax inline>{' \\(C(\\epsilon)\\) '}</MathJax> denotes the
                cost to the attacker of performing the first,
                price-manipulating, trade.
                <MathJax inline>{' \\(X(\\epsilon)\\) '}</MathJax> denotes the
                return to the attacker from the post-weight-update arbitrage
                trade. The overall benefit to the attacker over not carrying out
                the attack and just being an arbitrageur,
                <MathJax inline>{' \\(Z(\\epsilon)\\) '}</MathJax>, is thus
                <MathJax>
                  {
                    ' \\[Z(\\epsilon) = X(\\epsilon) - C(\\epsilon) - X(\\epsilon_0)\\] '
                  }
                </MathJax>
              </p>
              <p>
                When <MathJax inline>{' \\(Z(\\epsilon) > 0\\) '}</MathJax> the
                return from the attack,
                <MathJax inline>
                  {' \\(X(\\epsilon) - C(\\epsilon)\\) '}
                </MathJax>
                , is greater than the vanilla, just-doing-arbitrage return
                <MathJax inline>{' \\(X(\\epsilon_0)\\) '}</MathJax>. We can
                obtain bounds on{' '}
                <MathJax inline>{' \\(X(\\epsilon)\\) '}</MathJax> and{' '}
                <MathJax inline>{' \\(C(\\epsilon)\\) '}</MathJax>
                when fees are present without having them in closed form.
              </p>
              <p>
                Post-trade, the quoted prices are
                <MathJax>
                  {
                    ' \\[m_{\\text{attacker}} = m_p(1 + \\epsilon) = \\frac{1}{\\gamma} \\frac{w_2}{R_2 - \\Delta_2} \\frac{w_1}{R_1 + \\Delta_1}.\\] '
                  }
                </MathJax>
              </p>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button href="https://arxiv.org/abs/2404.15489" size="small">
                  View Full Paper
                </Button>
              </div>
            </MathJaxContext>
          </div>
        </>
      ),
    },
    {
      key: '5',
      label: 'Why would I just not run a fund on a CEX?',
      children: (
        <>
          <div hidden={faqEli5 != 'ELI5'}>
            <p>
              Research has shown how running funds as BTFs can be considerably
              more efficient. Not only is it more efficient but BTFs also earn
              DEX swap fees and charge no streaming fees. This provides enhanced
              revenue on top of token appreciation and yield that CEXs do not
              provide.
            </p>
          </div>
          <div hidden={faqEli5 != 'Crypto Native'}>
            <p>
              LVR is the current state of the art metric to define AMM
              efficiency. We expand LVR to include CEX level realism and
              demonstrate how, under a broad range of strategies, CEX fees and
              spreads more often than not it is more efficient to run funds as
              dynamic weighted AMMs rather than running a fund on a CEX.
            </p>
          </div>
          <div hidden={faqEli5 != 'Quant'}>
            LVR is a idealistic metric to compare AMM efficiency compared to a
            CEX. We create a new metric called RVR with the following
            properties:
            <table
              style={{
                width: '100%',
                tableLayout: 'fixed',
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      width: '25%',
                      textAlign: 'center',
                      border: '1px solid white',
                    }}
                  >
                    Model Features
                  </th>
                  <th
                    style={{
                      width: '25%',
                      textAlign: 'center',
                      border: '1px solid white',
                    }}
                  >
                    LVR
                  </th>
                  <th
                    style={{
                      width: '25%',
                      textAlign: 'center',
                      border: '1px solid white',
                    }}
                  >
                    ARB
                  </th>
                  <th
                    style={{
                      width: '25%',
                      textAlign: 'center',
                      border: '1px solid white',
                    }}
                  >
                    RVR
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    CEX Spread
                  </td>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    0
                  </td>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    0
                  </td>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    TradFi model
                  </td>
                </tr>
                <tr>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    CEX Fees
                  </td>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    0
                  </td>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    0
                  </td>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    Fee Present
                  </td>
                </tr>
                <tr>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    AMM Fees
                  </td>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    0
                  </td>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    Fee Present
                  </td>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    Fee Present
                  </td>
                </tr>
                <tr>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    AMM Gas Cost
                  </td>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    0
                  </td>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    0
                  </td>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    Fixed Costs
                  </td>
                </tr>
                <tr>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    AMM tokens
                  </td>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    2
                  </td>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    2
                  </td>
                  <td
                    style={{ textAlign: 'center', border: '1px solid white' }}
                  >
                    N
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              In a paper we outline how, even with strategy variations, fee and
              gas variations, significant efficiencies over CEX run portfolios
              can be achieved.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                href="https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/672283811331fc9bef39be23_RVR_30_10_24.pdf"
                size="small"
              >
                View Full Paper
              </Button>
            </div>
          </div>
        </>
      ),
    },
  ];
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
        'baseMacroBTFAugTest',
        'baseMacroCFMMAugTest',
        'baseMacroHodlAugTest',
        'baseMacroBTFAugTrain',
        'baseMacroCFMMAugTrain',
        'baseMacroHodlAugTrain',
        'baseMacroBTF2025Test',
        'baseMacroCFMM2025Test',
        'baseMacroHodl2025Test',
      ] as Pool[])
        .catch(console.error)
        .finally(() => {
          setLoading(false);
          console.log('Breakdowns loaded:', breakdowns);
        });
    }
  }, [loading, breakdowns]);

  const [period, setPeriod] = useState<string>('AugTest');
  const baseMacroBTF = useMemo(() => `baseMacroBTF${period}`, [period]);
  const baseMacroCFMM = useMemo(() => `baseMacroCFMM${period}`, [period]);
  const baseMacroHODL = useMemo(() => `baseMacroHodl${period}`, [period]);

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
              src="/assets/baseMacro_mono.png"
              alt="BASE MACRO BTF Icon"
              style={{ width: '30%', height: 'auto' }}
            />
            <h1 style={{ textAlign: 'center', margin: 0 }}>
              The Base Macro BTF
            </h1>
            <p style={{ textAlign: 'center' }}>
              Base is one of the pioneering chains for DeFi. It is a layer 2
              solution built on the Ethereum blockchain, designed to provide
              faster and cheaper transactions while maintaining the security and
              decentralization of Ethereum. Base is designed to be a platform
              for building decentralized applications (dApps) and smart
              contracts, enabling developers to create innovative solutions in
              the DeFi space.
            </p>
          </div>
        </Col>
        <Col span={1}></Col>
        <Col span={11}>
          <h4>BTF Objective</h4>
          <p>
            The Base Macro BTF provides exposure to some of the megal cap tokens
            on Base. The BTF is was trained on more bullish market conditions.
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
            It is crucial to recognize that BTFs carry risks. Reallocation
            strategies are not market-neutral and involve directional
            assumptions about asset allocation. Furthermore, the value of assets
            can be affected by macro economic factors and global events.
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
              <Card title="GENERAL DETAILS" style={{ height: '100%' }}>
                <Row>
                  <Col span={2}></Col>
                  <Col span={10}>
                    <Col span={24}>
                      <Tag
                        style={{ margin: 10, color: '#c7b283', width: '80%' }}
                        color="primary"
                      >
                        Deployment Links
                      </Tag>
                    </Col>
                    <Col span={24}>
                      <Tag style={{ margin: 10, width: '80%' }} color="primary">
                        Pool Factory Contract
                      </Tag>
                    </Col>
                    <Col span={24}>
                      <Tag style={{ margin: 10, width: '80%' }} color="primary">
                        Strategy Runner Contract
                      </Tag>
                    </Col>
                    <Col span={24}>
                      <Tag style={{ margin: 10, width: '80%' }} color="primary">
                        Chainlink cbBTC Oracle
                      </Tag>
                    </Col>
                    <Col span={24}>
                      <Tag style={{ margin: 10, width: '80%' }} color="primary">
                        Chainlink USDC Oracle
                      </Tag>
                    </Col>
                    <Col span={24}>
                      <Tag style={{ margin: 10, width: '80%' }} color="primary">
                        Chainlink AERO Oracle
                      </Tag>
                    </Col>
                    <Col span={24}>
                      <Tag style={{ margin: 10, width: '80%' }} color="primary">
                        Chainlink WETH Oracle
                      </Tag>
                    </Col>
                    <Col span={24}>
                      <Tag style={{ margin: 10, width: '80%' }} color="primary">
                        Chainlink Automation Task
                      </Tag>
                    </Col>
                  </Col>
                  <Col span={10}>
                    <Col span={24}>
                      <Tag
                        style={{ margin: 10, width: '80%', color: '#c7b283' }}
                        color="primary"
                      >
                        Fixed Settings
                      </Tag>
                    </Col>
                    <Col span={24}>
                      <Tag style={{ margin: 10, width: '80%' }} color="primary">
                        Strategy Interval: 24H
                      </Tag>
                    </Col>
                    <Col span={24}>
                      <Tag style={{ margin: 10, width: '80%' }} color="primary">
                        Strategy: Power Channel
                      </Tag>
                    </Col>
                    <Col span={24}>
                      <Tag style={{ margin: 10, width: '80%' }} color="primary">
                        Staleness Limit: 24H
                      </Tag>
                    </Col>
                    <Col span={24}>
                      <Tag style={{ margin: 10, width: '80%' }} color="primary">
                        Swap Fee: 0.3%
                      </Tag>
                    </Col>
                    <Col span={24}>
                      <Tag style={{ margin: 10, width: '80%' }} color="primary">
                        Withdrawal Fee: 0%
                      </Tag>
                    </Col>
                    <Col span={24}>
                      <Tag style={{ margin: 10, width: '80%' }} color="primary">
                        Streaming Fee: 0%
                      </Tag>
                    </Col>
                  </Col>
                  <Col span={2}></Col>
                </Row>
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
                <span>SIMULATED COMPOSITION OVER TIME</span>
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
                  simulationRunBreakdown={breakdowns[baseMacroBTF]}
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
          <h1 style={{ marginLeft: '10px' }}>
            SIMULATED CUMULATIVE PERFORMANCE
          </h1>
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
                        breakdowns[baseMacroBTF],
                        breakdowns[baseMacroCFMM],
                        breakdowns[baseMacroHODL],
                      ]
                }
                overrideSeriesStrokeColor={{
                  'Power Channel': '#c7b283',
                  'Balancer Weighted': '#528aae',
                  HODL: '#52ad80',
                }}
                overrideSeriesName={{
                  'Power Channel': 'BASE MACRO BTF',
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
                title={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>QUANTAMM REBALANCING</span>
                    <Radio.Group
                      size="small"
                      buttonStyle="solid"
                      value={faqEli5}
                      onChange={(e) => setFAQEli5(e.target.value)}
                      style={{ fontWeight: 'normal' }}
                    >
                      <Radio.Button value="ELI5">ELI5</Radio.Button>
                      <Radio.Button value="Crypto Native">
                        Crypto Native
                      </Radio.Button>
                      <Radio.Button value="Quant">Quant</Radio.Button>
                    </Radio.Group>
                  </div>
                }
                style={{ height: '80vh', overflowY: 'auto' }}
              >
                <Collapse
                  defaultActiveKey={['1']}
                  style={{ width: '100%', backgroundColor: '#162536' }}
                  accordion
                  items={items}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={1}></Col>
        <Col span={11}>
          <Row>
            <Col span={24} style={{ height: '100%' }}>
              <Card
                title="BASE MACRO WEIGHT STRATEGY"
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
                          breakdowns[baseMacroBTF],
                          breakdowns[baseMacroCFMM],
                          breakdowns[baseMacroHODL],
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
      <Row style={{ height: '130vh' }}>
        <Col span={1}></Col>
        <Col span={10}>
          <Row style={{ height: '130vh' }}>
            <Col span={24}>
              <Card
                title="Advantages"
                style={{ height: '130vh', overflowY: 'auto' }}
              >
                <Row>
                  <Col span={12}>
                    <Card
                      style={{ margin: '5px', height: '57vh' }}
                      title={'Advanced Infrastructure'}
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
                      style={{ margin: '5px', height: '57vh' }}
                      title={'Responsive Strategies'}
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
                      style={{ margin: '5px', height: '57vh' }}
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
                    <Card
                      title="Cross asset baskets"
                      style={{ margin: '5px', height: '57vh' }}
                    >
                      <Row>
                        <Col span={24}>
                          <p>
                            USDC provides a stablecoin that is the most widely
                            used in DeFi. It is the most liquid and widely
                            accepted stablecoin in the crypto ecosystem.
                          </p>
                          <p>
                            AERO is a Base native DeFi token. While this token
                            carries potential protocol risk and higher
                            volatility, it is a key native token of the Base
                            ecosystem.
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
          <Card style={{ height: '130vh', overflowY: 'auto' }} title={'Risks'}>
            <Row>
              <Col span={12}>
                <Card
                  style={{ margin: '5px', height: '57vh' }}
                  title={'Directional Strategies'}
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
                        Given Base&apos;s age and the age of certain tokens
                        within the BTF. Training and test periods are liminted.
                      </p>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  style={{ margin: '5px', height: '57vh' }}
                  title={'AMM Mathematics'}
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
                <Card
                  title="Contract Risk"
                  style={{ margin: '5px', height: '57vh' }}
                >
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
                  style={{ margin: '5px', height: '57vh' }}
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
            A training period of March 2021-August 2024 was selected and
            parameters were selected using the machine learning technique
            called: Stochastic Gradient Descent. This was performed by the
            QuantAMM team using the QuantAMM simulator framework. A parameter
            set was selected that maximised the Sharpe Ratio of the strategy.
            This was selected over other objectives such as maximising Ulcer or
            Calmer Ratios as the parameter set showed better test set
            statistics. Random 73-day length windows were selected within the
            training price range and optimisation was performed via stochastic
            gradient descent for 6000 steps with batches of 16 windows.
          </p>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Row style={{ height: '130vh' }}>
        <Col span={1}></Col>
        <Col span={10}>
          <Col span={24}>
            <Card
              title="Training window March 2021 - Aug 2024"
              style={{ height: '130vh' }}
            >
              <Row>
                <Col span={24}>
                  <div hidden={loading}>
                    <h5>Constituent weights over time</h5>
                    <WeightChangeOverTimeGraph
                      simulationRunBreakdown={breakdowns.baseMacroBTFAugTrain}
                      overrideChartTheme="ag-default-dark"
                      overrideXAxisInterval={1}
                    />
                    <h5>Cumulative performance over time</h5>
                    <SimulationResultMarketValueChart
                      hideTitle={true}
                      breakdowns={
                        loading
                          ? []
                          : [
                              breakdowns.baseMacroBTFAugTrain,
                              breakdowns.baseMacroCFMMAugTrain,
                              breakdowns.baseMacroHodlAugTrain,
                            ]
                      }
                      overrideSeriesStrokeColor={{
                        'Power Channel': '#c7b283',
                        'Balancer Weighted': '#528aae',
                        HODL: '#52ad80',
                      }}
                      overrideSeriesName={{
                        'Power Channel': 'BASE MACRO BTF',
                        'Balancer Weighted': 'Traditional DEX',
                      }}
                      overrideNagivagtion={false}
                      overrideXAxisInterval={1}
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
          <Card title={'Parameters Selected'} style={{ height: '130vh' }}>
            <Row>
              <Col span={12}>
                <Card
                  style={{ margin: '5px', height: '57vh' }}
                  title={
                    <Tooltip title="The following section describes the technique and mutability of the parameters used in the strategy">
                      Multi-block MEV{'  '} <InfoCircleOutlined />
                    </Tooltip>
                  }
                >
                  <Row>
                    <Col span={24}>
                      <p>
                        Absolute minimum weight guard rails of 10% and 3% were
                        tested. The final guard rail chosen was 3%.
                      </p>
                      <p>
                        The speed limit weights can change in one day (epsilon
                        max) was selected to be 0.432
                      </p>
                      <p>
                        The speed limit is tied to a maximum trade size of 10%
                        of pool constituent reserves.
                      </p>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  style={{ margin: '5px', height: '57vh' }}
                  title={
                    <Tooltip title="The following represent different forms of the lambda setting used for different tooling. ">
                      Lambda Settings
                    </Tooltip>
                  }
                >
                  <Row>
                    <Col span={24}>
                      <Tooltip title="Lambda is the parameter used in the gradient estimators for the power channel. This is the on-chain value stored in the contracts">
                        <p>
                          Lambda:{'  '} <InfoCircleOutlined />
                        </p>
                        <Tag style={{ margin: '5px' }}>
                          cbBTC - 0.9784309018144351
                        </Tag>
                        <Tag style={{ margin: '5px' }}>
                          AERO - 0.9925922273835435
                        </Tag>
                        <Tag style={{ margin: '5px' }}>
                          USDC - 0.6009182385585357
                        </Tag>
                        <Tag style={{ margin: '5px' }}>
                          WETH - 0.2679511251319175
                        </Tag>
                      </Tooltip>
                    </Col>
                    <Col span={24}>
                      <Tooltip title="Memory days is a conversion of the lambda setting to a more understandable unit of the number of days of prices used in the strategy">
                        <p>
                          Memory Days:{'  '} <InfoCircleOutlined />
                        </p>
                        <Tag style={{ margin: '5px' }}>cbBTC - 167.272730</Tag>
                        <Tag style={{ margin: '5px' }}>AERO - 365.0</Tag>
                        <Tag style={{ margin: '5px' }}>USDC - 7.684642</Tag>
                        <Tag style={{ margin: '5px' }}>WETH - 3.200556</Tag>
                      </Tooltip>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title="Aggressiveness"
                  style={{ margin: '5px', height: '57vh' }}
                >
                  <Row>
                    <Col span={24}>
                      <p>
                        How strongly does the strategy react to price changes? This is the strategy aggressiveness.
                      </p>
                    </Col>
                    <Col span={24}>
                      <Tooltip title="Otherwise known as k_per_day. This is the multiplier applied to the strategy signal to get the weight change per day">
                        <p>
                          Aggressiveness: {'  '} <InfoCircleOutlined />
                        </p>
                        <Tag style={{ margin: '5px' }}>cbBTC - 5.608611948</Tag>
                        <Tag style={{ margin: '5px' }}>AERO - 43.81829052</Tag>
                        <Tag style={{ margin: '5px' }}>USDC - 7.015760734</Tag>
                        <Tag style={{ margin: '5px' }}>WETH - 39.89684253</Tag>
                      </Tooltip>
                    </Col>
                    <Col span={24}>
                      <Tooltip title="k is the on-chain value stored in the contracts and is the exact parameter used in the strategy calculations">
                        <p>
                          k:{'  '} <InfoCircleOutlined />
                        </p>
                        <Tag style={{ margin: '5px' }}>
                          cbBTC - 938.167832
                        </Tag>
                        <Tag style={{ margin: '5px' }}>
                          AERO - 15993.676043
                        </Tag>
                        <Tag style={{ margin: '5px' }}>
                          USDC - 306.592966
                        </Tag>
                        <Tag style={{ margin: '5px' }}>
                          WETH - 22.454340
                        </Tag>
                      </Tooltip>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title="Exponent"
                  style={{ margin: '5px', height: '57vh' }}
                >
                  <Row>
                    <Col span={24}>
                      <p>
                        The following represent different forms of the lambda
                        setting used for different tooling
                      </p>
                    </Col>
                    <Col span={24}>
                      <Tooltip title="The exponent is a variable used in the power channel strategy that dictate how big a price change has to be before the strategy starts to notice it. It is the primary difference between other strategies like momentum.">
                        <p>
                          Exponent:{'  '} <InfoCircleOutlined />
                        </p>
                        <Tag style={{ margin: '5px' }}>cbBTC - 1</Tag>
                        <Tag style={{ margin: '5px' }}>AERO - 2.4705463110202333</Tag>
                        <Tag style={{ margin: '5px' }}>USDC - 1</Tag>
                        <Tag style={{ margin: '5px' }}>WETH - 1</Tag>
                      </Tooltip>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={1}></Col>
      </Row>
    </div>
  );
}
