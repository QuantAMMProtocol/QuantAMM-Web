import { Col, Radio, Row, Form } from 'antd';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { useState } from 'react';
interface OptionalProps {
  hideTitle?: boolean;
  fixedEL15?: boolean;
}

export function QuantAMMPoolDescription(props: OptionalProps) {
  const [eli5, setEli5] = useState('ELI5');

  return (
    <MathJaxContext>
      <Row>
        <Col span={2}></Col>
        <Col span={20}>
          <Row>
            <Col span={24}>
              <div hidden={props.hideTitle}>
                <h2>QuantAMM&apos;s time-varying trading function</h2>
              </div>
            </Col>
            <Col span={24}>
              <div hidden={props.fixedEL15}>
              <Form.Item style={{ marginTop: '5px' }}>
                <Radio.Group
                  size="small"
                  value={eli5}
                  onChange={(e) => setEli5(e.target.value)}
                >
                  <Radio.Button disabled={true}>
                    User Knowledge Level:{' '}
                  </Radio.Button>
                  <Radio.Button value={'ELI5'}>ELI5</Radio.Button>
                  <Radio.Button value={'Quant'}>
                    Quant
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
              </div>
            </Col>
            <div hidden={eli5 != 'ELI5'}>
              <h3>How vaults and indexes normally work</h3>
              <p>
                Crypto vaults usually involve an off-chain manager who decides
                periodically to trade on DEX venues to rebalance holdings within
                the vault to what the manager thinks the vault should hold.
                Older index protocols paused the vaults and rebalanced manually.
                Newer indexes rebalance with on-chain auctions however these are
                also prone to failure and expensive.
              </p>
              <h3>How Automated Market Makers work</h3>
              <p>
                Automated market makers usually provide a venue for traders to
                swap one token for another at an automated price. The holdings
                within the liquidity pool are kept at constant equal weights.
              </p>
              <h3 style={{ color: 'var(--secondary-text-color)' }}>How QuantAMM BTFs work</h3>
              <p style={{ color: 'var(--secondary-text-color)' }}>
                QuantAMM BTFs are automated market maker pools. However instead
                of offering a competitive market price, BTFs offer a slightly
                off market price. The aim of this off market price is to allow
                traders to rebalance the holdings in the direction of the off
                market drift. How is the off market price decided? On-chain,
                automatic rules determine what weights the pool should hold
                given market movements. This means that QuantAMM BTFs can run index and vault like
                rebalancing continuously and efficiently.
              </p>
            </div>
            <div hidden={eli5 == 'ELI5'}>
              <Col span={24}>
                <p>
                  <span>QuantAMM updates</span>
                  <MathJax inline>{' \\(\\mathbf{w}\\) '}</MathJax>
                  <span>
                    {' '}
                    on-chain using on-chain signals so that the allocation of
                    assets in the DEX is responsive to market information. Thus,
                    to indicate this new dependency of the components of
                  </span>
                  <MathJax inline>{' \\(\\mathbf{w}\\) '}</MathJax>
                  <span>on time, we write</span>
                  <MathJax inline>{' \\(w_i(t)\\) '}</MathJax>
                  <span>
                    and the time-varying law that defines QuantAMM, the trading
                    function, becomes
                  </span>
                </p>
                <MathJax>
                  {
                    '\\[\\prod_{i=1}^{N} R_i^{w_i(t)}= k(t), \\quad\\mathrm{where\\,} \\sum_{i=1}^N w_i(t) = 1, \\,\\,\\mathrm{and\\,\\,} \\forall i\\,\\, 0\\leq w_i(t)<1.\\]'
                  }
                </MathJax>
                <p>
                  <span>where we have made the time-dependence of</span>
                  <MathJax inline>{' \\(k\\) '}</MathJax>
                  <span>
                    explicit, as it now depends on the current, and changing,
                    value of
                  </span>
                  <MathJax inline>{' \\(\\mathbf{w}(t)\\). '}</MathJax>
                </p>
                <p>
                  <span>Since any trade with a pool must not decrease</span>
                  <MathJax inline>{' \\(k(t)\\), '}</MathJax>
                  <span>
                    the change in weights is all that is required to cause the
                    pool&apos;s reserves to be rebalanced: those trades which
                    take place are those which bring the reserves into the
                    target ratio, meaning that the DEX is not required to
                    execute any trades of its own to enact the rebalancing. At
                    the same time, this means that a QuantAMM pool can reduce
                    exposure to impermanent loss compared to a pool with static
                    weights, since those trades which take place move the
                    reserves from less-desired assets (whose weights decrease)
                    into more-desired ones (as their weights increase).
                  </span>
                </p>
                <h3>How to determine the target weights</h3>
                <p>
                  The key question is then, in what way should pools&apos;
                  weights change? Indeed, there is a universe of possible such
                  update rules — that is, possible functions to determine the
                  changes in weights — but for an update rule to be appealing it
                  has to offer superior capital performance than HODL: it has to
                  be an effective strategy. It also has to be feasible to run
                  on-chain for a given blockchain (it has to be economical to
                  run).
                </p>
                <p>
                  The update rule section defines potential rules that have
                  performed well in various simulated time frames. The price
                  gradient estimation section describes how we can do this
                  efficiently on chain. The update rule also has to fulfill
                  various natural mathematical properties, for example making
                  sure that the resulting weights are valid by summing to one
                  and having values in the range [0, 1), or a range with that.
                </p>
                <p>
                  We believe that automated, on-chain, permission-less and
                  non-custodial methods for this, built as a DEX, are the most
                  desirable, consistent with the broad ethos of DeFi and having
                  real-world advantages to the users of such a protocol. These
                  include:
                </p>
                <p>1. System reliability through decentralized execution;</p>
                <p>
                  2. the ease of verifying the logic and structure of the
                  portfolio strategy, as it is implemented as a smart contract;
                </p>
                <p>
                  3. the constant access to the protocol and thus one’s staked
                  liquidity.
                </p>
              </Col>
              <Col span={24}>
                <span>
                  <h2>
                    QuantAMM LPs do not have to suffer Impermanent Loss: they
                    can see their portfolio increase in value
                  </h2>
                </span>
              </Col>
              <Col span={24}>
                <p>
                  In the previous situation we considered the case of constant
                  weights with changing market prices. We will now consider how
                  the holdings, and thus value, of a QuantAMM pool changes when
                  the weights are updated. We will consider fixed market prices
                  but a pool with changing weights. So, mirroring the above, we
                  have that, given a change in pool weights, arbitrageurs will
                  trade with the pool until the quoted prices of the pool match
                  the current market prices.
                </p>
                <p>
                  <span>We will start with weights</span>
                  <MathJax inline>{' \\(w(t_0)\\) '}</MathJax>
                  <span>
                    , and then after the update we are a moment later in time
                  </span>
                  <MathJax inline>{" \\(t' = t_0+\\delta_t\\) "}</MathJax>
                  <span>and we have new weights</span>
                  <MathJax inline>{" \\(w(t')\\) "}</MathJax>
                  <span>, but </span>
                  <MathJax inline>{" \\(p(t') = p(t_0)\\) "}</MathJax>
                  <span>. This gives us:</span>
                </p>
                <MathJax>
                  {
                    " \\[R(t') = R(t_0) \\frac{w(t')}{w(t_0)}\\prod_{i=1}^N \\left(\\frac{w_i(t_0)}{w_i(t')}\\right)^{w_i(t')}\\] "
                  }
                </MathJax>
                <p>
                  where multiplication and division between vectors is performed
                  elementwise. See the technical appendix of the whitepaper for
                  the derivation. From this we can get the weight-update
                  counterpart to the equation above for how value change with
                  prices. The value after the weight-change is
                </p>
                <MathJax>
                  {
                    " \\[V_{\\Delta w}(t') = \\sum_{i=1}^N p_i(t') R_i(t') = \\sum_{i=1}^N p_i(t_0) R_i(t') = \\sum_{i=1}^N p_i(t_0) R_i(t_0) \\frac{w_i(t')}{w_i(t_0)}\\prod_{k=1}^N \\left(\\frac{w_k(t_0)}{w_k(t')}\\right)^{w_k(t')}\\] "
                  }
                </MathJax>
                <p>
                  For the above equation, the particular trajectory of weights
                  determines how the reserves, and thus the value, changes. Of
                  course when QuantAMM is running market prices will change, so
                  to model how reserves change for QuantAMM we can intersperse
                  changes-of-weights with changes-of-prices. For a single such
                  block, where first the market prices change and then the pool
                  updates its weights, we get:
                </p>
                <MathJax>
                  {
                    " \\[R_{\\mathrm{quantAMM}}(t') = R(t_0) \\frac{p(t_0)}{p(t')}\\frac{w(t')}{w(t_0)}\\prod_{i=1}^N \\left(\\frac{p_i(t')}{p_i(t_0)}\\right)^{w_i(t_0)}\\prod_{k=1}^N \\left(\\frac{w_k(t_0)}{w_k(t')}\\right)^{w_k(t')}\\] "
                  }
                </MathJax>
                <p>
                  <span>
                    where again multiplication and division between vectors is
                    performed elementwise. From the path-dependency of of the
                    QuantAMM
                  </span>
                  <MathJax inline>{" \\(R(t')\\) "}</MathJax>
                  <span>
                    equation, this &apos;combined&apos; update is also
                    path-dependent (terms involving intermediate values of
                    variables do not cancel out) and so now pool reserves depend
                    on both the trajectory of prices and that of weights. The
                    corresponding change in value for one combined update is:
                  </span>
                </p>
                <MathJax style={{ fontSize: 12 }}>
                  {
                    " \\[V_{\\mathrm{quantAMM}}(t') = \\sum_{i=1}^N p_i(t') R(t')_{\\mathrm{quantAMM}, i} = \\sum_{i=1}^N p_i(t_0) R_i(t_0) \\frac{p_i(t_0)}{p_i(t')}\\frac{w_i(t')}{w_i(t_0)}\\prod_{k=1}^N \\left(\\frac{p_k(t')}{p_k(t_0)}\\right)^{w_k(t_0)}\\prod_{\\ell=1}^N \\left(\\frac{w_\\ell(t_0)}{w_\\ell(t')}\\right)^{w_\\ell(t')}\\] "
                  }
                </MathJax>
                <p>
                  <span>We cannot write a simple equivalent to the</span>
                  <MathJax inline>{' \\(\\Delta V\\) '}</MathJax>
                  <span>
                    {' '}
                    as shown above for normal DEXes for these combined QuantAMM
                    updates. The value of the QuantAMM pool at some later time
                    is not guaranteed to be less than holding ones initial
                    capital, as it is for non-dynamic DEXes.
                  </span>
                </p>
                <p>
                  <b>
                    QuantAMM does not have to suffer from Impermanent Loss.
                    Instead the value of a QuantAMM pool depends intimately on
                    the sequence of weights and prices over time, and as such
                    its value can increase above simply holding one&apos;s
                    capital.
                  </b>
                </p>
              </Col>
            </div>
          </Row>
        </Col>
        <Col span={2}></Col>
      </Row>
    </MathJaxContext>
  );
}
