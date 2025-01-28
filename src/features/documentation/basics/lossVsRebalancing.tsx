import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Fade } from 'react-awesome-reveal';
import { Col, Row } from 'antd';

const LossVsRebalancing: React.FC = () => {
  return (
    <div>
      <Row>
        <Col span={4}></Col>
        <Col span={16}>
          <MathJaxContext>
            <Fade>
              <h1>Loss vs Rebalancing (LVR)</h1>
              <p>
                Loss vs Rebalancing (LVR) is a concept used in portfolio
                management to describe the trade-off between the potential loss
                of a portfolio and the benefits of rebalancing. Rebalancing is
                the process of realigning the weightings of a portfolio of
                assets to maintain a desired level of asset allocation. This is
                typically done by periodically buying or selling assets in the
                portfolio to maintain the original or desired level of asset
                allocation.
              </p>
              <p>
                Loss-Versus-Rebalancing is a metric that compares the P&L of an
                AMM pool versus that of an idealised portfolio that aims to
                mirror the pool.
              </p>
              <p>
                In a two token AMM pool we can interpret one token as the risk
                asset, with reserves <MathJax inline>{`x`}</MathJax>, and the
                other as the risk-off asset, with reserves{' '}
                <MathJax inline>{`y`}</MathJax>. We can then define{' '}
                <MathJax inline>{`P`}</MathJax> as the price of{' '}
                <MathJax inline>{`x`}</MathJax> using{' '}
                <MathJax inline>{`y`}</MathJax> as numeraire. The pool&apos;s
                value is{' '}
                <MathJax>{` \\[ V_\\mathsf{2token}(t):= P(t)x(t)+y(t)\\]`}</MathJax>
                The pool&apos;s reserves change over time from the action of
                traders and arbitrageurs.
              </p>
              <p>
                LVR introduces a &apos;rebalancing portfolio&apos; with value{' '}
                <MathJax inline>{`\\[V_\\mathsf{rebal}(t)\\]`}</MathJax> that
                aims to match continuously the holdings of an AMM pool&apos;s
                risk asset. The difference is that the rebalancing portfolio
                does its rebalancing not by the actions of traders/arbitrageurs
                but instead by trading externally at the market price perfectly
                frictionlessly (zero slippage and zero costs).
              </p>
              <p>
                In continuous time
                <MathJax
                  inline
                >{`\\[V_\\mathsf{rebal}(t) = V_\\mathsf{2token}(0) + \\int_0^t x(P_s)\\,dP_s\\]`}</MathJax>
                for <MathJax inline>{`t>0`}</MathJax>.
              </p>
              <p>
                LVR is then defined as
                <MathJax
                  inline
                >{`\\[\\mathsf{LVR}(t):= V_\\mathsf{rebal}(t) - V_\\mathsf{2token}(t).\\]`}</MathJax>
              </p>
              <p>
                LVR has been extended to handle when constant function market
                makers charge fees on their trades (called &apos;ARB&apos;).
                Fees mean that there is only an arbitrage opportunity if the
                pool&apos;s quoted prices sufficiently deviate from market
                prices to leave the pool&apos;s no-trade (a.k.a. no-arb) region.
                Within the setup studied (risk asset prices diffuse under
                geometric Brownian motion,{' '}
                <MathJax inline>{`\\[V_\\mathsf{rebal}(t)\\]`}</MathJax>{' '}
                unchanged, low fees, fast blocks), the presence of CFMM fees
                decreases LVR by the fraction of time that an arbitrage trade is
                possible.
              </p>
              <p>
                <strong>Measured performance of fixed weight AMMs</strong> Most
                AMM pools have static trading functions, where the pool aims to
                have a constant division of value between assets (for example, a
                Uniswap V2 pool aims to hold half of its value in each token in
                the pair). These strategies are known variously as constant-mix
                strategies, constant-weight asset allocation or constant
                rebalanced portfolios. These strategies can perform well, but
                what both IL and LVR are telling us is that implementing these
                strategies via an AMM pool is a particularly poor choice of
                rebalancing method.
              </p>
              <p>
                So far LVR and its extensions have only been used to compare
                efficiency of constant-mix strategies that (absent trading fees)
                tend to perform badly when done by AMMs.
              </p>
              <p>
                Mathematically, the concept of LVR can be expressed using the
                following equations:
              </p>
              <div>
                <MathJax
                  inline
                >{`\\[LVR = \\frac{\\text{Potential Loss}}{\\text{Rebalancing Benefits}}\\]`}</MathJax>
              </div>
              <p>Where:</p>
              <ul>
                <li>
                  <strong>Potential Loss</strong>: The potential loss of the
                  portfolio if it is not rebalanced.
                </li>
                <li>
                  <strong>Rebalancing Benefits</strong>: The benefits of
                  rebalancing the portfolio, including maintaining the desired
                  risk level and potentially improving returns.
                </li>
              </ul>
              <p>
                Another important equation related to LVR is the rebalancing
                threshold, which is the point at which the benefits of
                rebalancing outweigh the costs. This can be expressed as:
              </p>
              <div>
                <MathJax
                  inline
                >{`\\[\\text{Rebalancing Threshold} = \\frac{\\text{Transaction Costs} + \\text{Taxes}}{\\text{Expected Benefits of Rebalancing}}\\]`}</MathJax>
              </div>
            </Fade>
          </MathJaxContext>
        </Col>
        <Col span={4}></Col>
      </Row>
    </div>
  );
};

export default LossVsRebalancing;
