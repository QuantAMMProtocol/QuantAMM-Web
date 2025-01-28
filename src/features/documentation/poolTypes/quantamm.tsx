import { Col, Row } from 'antd';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Fade } from 'react-awesome-reveal';

export function QuantAMMPoolDescription() {
  return (
    <MathJaxContext>
      <Row>
        <Col span={4}></Col>
        <Col span={16}>
          <Row style={{ padding: 20 }}>
            <Col span={24}>
              <h2>QuantAMM&apos;s time-varying trading function</h2>
            </Col>
            <Col span={24}>
              <Fade>
                <p>
                  <span>Our proposal is to update</span>
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
                  <MathJax inline>{' \\(\\mathbf{w}(t)\\). '}</MathJax>.
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
                    the same time, this ensures that a QuantAMM pool is better
                    able to avoid impermanent loss than a pool with static
                    weights, since those trades which take place move the
                    reserves from less-desired assets (whose weights decrease)
                    into more-desired ones (as their weights increase).
                  </span>
                </p>
                <h3>How to determine the target weights</h3>
                <p>
                  The inevitable quesiton is then, in what way should
                  pools&apos; weights change? Indeed, there is a universe of
                  possible such update rules — that is, possible functions to
                  determine the changes in weights — but for an update rule to
                  be appealing it has to offer superior capital performance than
                  HODL: it has to be an effective strategy. It also has to be
                  feasible to run on-chain for a given blockchain (it has to be
                  economical to run).
                </p>
                <p>
                  The update rule section defines potential rules that have
                  performed well in various simulated time frames. The price
                  gradient estimation section describes how we can do this
                  efficiently on chain. The update rule also has to fulfill
                  various natural mathematical properties, for example making
                  sure that the resulting weights are valid by summing to one
                  and having values in the range [0, 1).
                </p>
                <p>
                  We believe that automated, on-chain, permission-less and
                  non-custodial methods for this, built as a DEX, are the most
                  desirable, in-keeping both with the broad ethos of DeFi as
                  well as having real-world advantages to the users of such a
                  protocol. These include:
                </p>
                <p>
                  1. The reliability of the system, as it would not rely on some
                  central organisation or machine to make manage capital;
                </p>
                <p>
                  2. the ease of verifying the logic and structure of the
                  portfolio strategy, as it is implemented as a smart contract;
                </p>
                <p>
                  3. the constant access to the protocol and thus one’s staked
                  liquidity.
                </p>
              </Fade>
            </Col>
            <Col span={24}>
              <Fade>
                <span>
                  <h2>
                    QuantAMM LPs do not have to suffer Impermanent Loss: they
                    can see their portfolio increase in value
                  </h2>
                </span>
              </Fade>
            </Col>
            <Col span={24}>
              <Fade>
                <p>
                  In the previous situation we considered the case of constant
                  weights with changing market prices. We will now consider how
                  the holdings, and thus value, of a QuantAMM pool changes when
                  the weights are updated. That is, now we will consider fixed
                  market prices but a pool with changing weights. So, mirroring
                  the above, we have that, given a change in pool weights,
                  arbitrageurs will trade with the pool until the quoted prices
                  of the pool match the current market prices.
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
              </Fade>
            </Col>
          </Row>
        </Col>
        <Col span={4}></Col>
      </Row>
    </MathJaxContext>
  );
}
