import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Fade } from 'react-awesome-reveal';
import { Col, Row } from 'antd';

const RebalancingVsRebalancing: React.FC = () => {
  return (
    <div>
      <Row>
        <Col span={4}></Col>
        <Col span={16}>
          <MathJaxContext>
            <Fade>
              <h1>Rebalancing-Verus-Rebalancing</h1>
              <p>
                While Loss-Versus-Rebalancing (LVR) compares AMM performance to
                idealized rebalancing,{' '}
                <a href="https://arxiv.org/abs/2410.23404">
                  Rebalancing-Verus-Rebalancing (RVR)
                </a>{' '}
                compares it to centralised exchange (CEX) execution with
                realistic trading costs. This benchmark captures the actual
                alternatives available to liquidity providers, including
                spreads, fees, and gas costs.
              </p>
              <p>
                RVR extends these comparisons to N{'>'}2 asset portfolios,
                providing a practical framework for evaluating AMM performance
                against traditional market making approaches.
              </p>
              <p>
                The following table compares the core features of LVR, its fee
                extended model ARB and RVR:
              </p>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '5px', border: '1px solid white' }}>
                      Model Features
                    </th>
                    <th style={{ padding: '5px', border: '1px solid white' }}>
                      LVR
                    </th>
                    <th style={{ padding: '5px', border: '1px solid white' }}>
                      ARB
                    </th>
                    <th style={{ padding: '5px', border: '1px solid white' }}>
                      RVR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      CEX Spread
                    </td>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      0
                    </td>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      0
                    </td>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      TradFi model
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      CEX Fees
                    </td>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      0
                    </td>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      0
                    </td>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      Fee Present
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      AMM Fees
                    </td>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      0
                    </td>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      Fee Present
                    </td>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      Fee Present
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      AMM Gas Cost
                    </td>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      0
                    </td>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      0
                    </td>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      Fixed Costs
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      AMM tokens
                    </td>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      2
                    </td>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      2
                    </td>
                    <td style={{ padding: '5px', border: '1px solid white' }}>
                      N
                    </td>
                  </tr>
                </tbody>
              </table>

              <h2>CEX Portfolio Model</h2>

              <p>
                The CEX portfolio maintains reserves
                <MathJax inline>
                  {
                    ' \\( \\mathbf{R}_{\\text{cex}}(t) = \\{R_{\\text{cex},i}(t)\\} \\) '
                  }
                </MathJax>
                . The change in reserves
                <MathJax inline>
                  {
                    ' \\( \\mathbf{R}_{\\text{cex}}(t) - \\mathbf{R}_{\\text{cex}}(t-1) \\) '
                  }
                </MathJax>
                needed to rebalance a portfolio is
              </p>
              <MathJax>
                {
                  ' \\[ \\mathbf{R}_{\\text{cex}}(t) - \\mathbf{R}_{\\text{cex}}(t-1) = \\frac{\\mathbf{w}(t)V_{\\text{cex}}(t)}{\\mathbf{p}(t)} - \\frac{\\mathbf{w}(t-1)V_{\\text{cex}}(t-1)}{\\mathbf{p}(t-1)}, \\]'
                }
              </MathJax>
              <p>
                where
                <MathJax inline>
                  {
                    ' \\( V_{\\text{cex}}(t) := \\sum_{i=1}^{N} R_{\\text{cex},i}(t)p_i(t) \\) '
                  }
                </MathJax>
                is the value of our CEX-rebalanced portfolio and all division
                between vectors is done elementwise. Rebalancing trades incur
                costs from spreads and fees:
              </p>

              <MathJax>
                {`\\[ V_{\\text{cex}}(t) = \\sum_{i=1}^{N} R_{\\text{cex},i}(t-1)p_i(t) - c(\\mathbf{R}_{\\text{cex}}(t), \\mathbf{R}_{\\text{cex}}(t-1), \\mathbf{p}(t)) \\]`}
              </MathJax>

              <p>
                Trading costs decompose into commission fees and spread costs:
                <MathJax inline>
                  {
                    ' \\( c(\\cdot) = c_{\\text{fees}}(\\cdot) + c_{\\text{spread}}(\\cdot) \\) '
                  }
                </MathJax>
              </p>

              <h3>Commission Fees</h3>

              <p>
                Fees apply to the outgoing leg of trades, parameterized by
                <MathJax inline>{' \\( \\tau_{\\text{cex}} \\) '}</MathJax>:
              </p>

              <MathJax>
                {`\\[ c_{\\text{fees}} = \\tau_{\\text{cex}} \\sum_{i=1}^{N} p_i(t)\\Delta_i \\]`}
              </MathJax>

              <p>
                where <MathJax inline>{' \\( \\Delta_i \\) '}</MathJax>{' '}
                represents outgoing quantities.
              </p>

              <h3>Spread Costs</h3>

              <p>
                Market orders incur spread costs proportional to trade size:
              </p>

              <MathJax>
                {`\\[ c_{\\text{spread}} = \\frac{1}{2} \\sum_{i=1}^{N} p_i(t)s_i(t)\\lvert R_{\\text{cex},i}(t) - R_{\\text{cex},i}(t-1)\\rvert \\]`}
              </MathJax>

              <h3>Implementation</h3>

              <p>
                The system of equations determining portfolio value and optimal
                trades requires numerical solution, as trading costs depend on
                trade size while optimal trades depend on costs.
              </p>

              <h2>AMM Model</h2>

              <p>
                The AMM comparison includes pool fees and a 5-block
                (approximately one minute) arbitrage discovery period. Gas costs
                create a minimum profitable trade size, expanding the no-trade
                region beyond pure fee considerations.
              </p>

              <div
                style={{
                  margin: '20px 0',
                  padding: '15px 20px',
                  borderLeft: '3px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  fontSize: '0.95em',
                }}
              >
                <strong>Note:</strong> RVR assumes that the market provides
                infinite liquidity at the bid and ask prices, i.e. RVR maintains
                the assumption from LVR that there is no slippage. This means
                that RVR does not include market impact here, but we note that
                in preliminary investigations using standard market impact
                modeling approaches RVR finds that including it makes
                vanishingly small difference to the results.
              </div>
            </Fade>
          </MathJaxContext>
        </Col>
        <Col span={4}></Col>
      </Row>
    </div>
  );
};

export default RebalancingVsRebalancing;
