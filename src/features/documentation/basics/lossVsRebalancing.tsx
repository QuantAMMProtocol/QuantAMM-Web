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
              <h1>Loss-Versus-Rebalancing (LVR)</h1>
              <p>
                <a href="https://arxiv.org/abs/2208.06046">
                  Loss-Versus-Rebalancing (LVR)
                </a>{' '}
                measures how efficiently an AMM pool performs compared to an
                idealized portfolio executing the same rebalancing strategy with
                zero trading costs. It quantifies the difference between an AMM
                pool's value and that of a frictionless portfolio maintaining
                the same target composition through direct market trades.
              </p>

              <p>
                In a two token AMM pool we can interpret one token as the risk
                asset, with reserves <MathJax inline>{`x`}</MathJax>, and the
                other as the risk-off (numeraire) asset, with reserves{' '}
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
                makers charge fees on their trades (called{' '}
                <a href="https://arxiv.org/abs/2305.14604">ARB</a>). Fees mean
                that there is only an arbitrage opportunity if the pool&apos;s
                quoted prices sufficiently deviate from market prices to leave
                the pool&apos;s no-trade (a.k.a. no-arb) region. Within the
                setup studied (risk asset prices diffuse under geometric
                Brownian motion,{' '}
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
                LVR, as proposed, (and its extension ARB) has been used to
                analyse the efficiency of two-token constant-mix strategies that
                (absent trading fees) tend to perform badly when done by AMMs.
                In this simulator we can apply LVR modelling to any AMM pool,
                including our own QuantAMM pools.
              </p>
            </Fade>
          </MathJaxContext>
        </Col>
        <Col span={4}></Col>
      </Row>
    </div>
  );
};

export default LossVsRebalancing;
