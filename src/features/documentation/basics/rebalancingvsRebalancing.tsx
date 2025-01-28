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
              <h1>Rebalancing vs Rebalancing</h1>
              <p>
                Benchmarks are useful to the extent that they can inform
                decisions. While LVR is a useful abstraction, a benchmark
                proposed by the QuantAMM team is a benchmark that models with
                higher fidelity how rebalancing against a centralised exchange
                is done. Rebalancing a portfolio incurs costs. Our goal is to
                capture more closely the range of available approaches that are
                potentially accessible to LPs.
              </p>
              <p>
                This benchmark that is equatable to one of the most widely used
                methods for portfolio execution management: rebalancing using a
                centralised exchange (CEX). The benchmark adds modelling of some
                of the costs associated with CEX trades, while also extending
                these concepts to multi-asset N{'>'}2 portfolios in a simple
                way. Given we are now comparing two rebalancing mechanisms,
                rather than an idealised benchmark and a target rebalancing
                system, we call the resulting metric
                Rebalancing-versus-Rebalancing or RVR.
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

              <h2>Centralised portfolio modelling</h2>
              <p>
                In RVRthe fees charged by centralised exchanges are modelled and
                the presence of the spread for the rebalancing portfolio.
                Industry standard approaches are taken, as described in the full
                technical note.
              </p>

              <h3>Rebalancing trade</h3>
              <p>
                The centralised rebalancing portfolio has reserves
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
                between vectors is done elementwise. For how the value changes
                as prices and weights change and the portfolio is rebalanced, we
                follow the approach of.
              </p>
              <p>This gives us</p>
              <MathJax>
                {
                  '\\[ V_{\\text{cex}}(t) = \\sum_{i=1}^{N} R_{\\text{cex},i}(t-1)p_i(t) - c(\\mathbf{R}_{\\text{cex}}(t), \\mathbf{R}_{\\text{cex}}(t-1), \\mathbf{p}(t)), \\]'
                }
              </MathJax>
              <p>
                where
                <MathJax inline>{' \\( c(\\cdot) \\) '}</MathJax>
                is the cost of doing the rebalancing trade.The costs of doing a
                trade are decomposed into costs from commission fees and from
                the presence of the spread:
                <MathJax inline>
                  {
                    ' \\( c(\\cdot) = c_{\\text{fees}}(\\cdot) + c_{\\text{spread}}(\\cdot) \\) '
                  }
                </MathJax>
                .
              </p>
              <p>
                RVR assumes that the market provides infinite liquidity at the
                bid and ask prices, i.e. RVR maintains the assumption from LVR
                that there is no slippage. This means that RVR does not include
                market impact here, but RVR notes that in preliminary
                investigations using standard market impact modeling approaches
                RVR finds that including it makes vanishingly small difference
                to the results.
              </p>

              <h3>Commission fees</h3>
              <p>
                A simple model for commission fees is to charge a fee amount on
                the outgoing leg of the trade from the CEX. RVR will
                parameterise the fees as
                <MathJax inline>{' \\( \\tau_{\\text{cex}} \\) '}</MathJax>, (
                <MathJax inline>
                  {' \\( \\tau_{\\text{cex}} = 1 - \\gamma_{\\text{cex}} \\) '}
                </MathJax>
                ).
              </p>
              <p>
                RVR denotes the outgoing leg of the trade
                <MathJax inline>{' \\( \\mathbf{\\Delta} \\) '}</MathJax>, so
                <MathJax inline>
                  {
                    ' \\( \\Delta_i = \\left(R_{\\text{cex},i}(t) - R_{\\text{cex},i}(t-1)\\right)\\mathbb{I}_{R_{\\text{cex},i}(t) - R_{\\text{cex},i}(t-1) > 0} \\) '
                  }
                </MathJax>
                , where
                <MathJax inline>{' \\( \\mathbb{I}_{\\cdot} \\) '}</MathJax>
                is an indicator function that returns 1 if the expression in its
                subscript is true, otherwise returning 0.
                <MathJax inline>{' \\( c_{\\text{fees}} \\) '}</MathJax>
                is then simply
              </p>
              <MathJax>
                {
                  '\\[ c_{\\text{fees}}(\\mathbf{R}_{\\text{cex}}(t), \\mathbf{R}_{\\text{cex}}(t-1), \\mathbf{p}(t)) = \\tau_{\\text{cex}} \\sum_{i=1}^{N} p_i(t)\\Delta_i. \\]'
                }
              </MathJax>

              <h3>Spread</h3>
              <p>
                RVR models the rebalancing portfolio as trading via market
                orders, so buying at the ask and selling at the bid, following.
                For given bid-ask spreads
                <MathJax inline>{' \\( \\mathbf{s}(t) \\) '}</MathJax>
                (each given as a proportion in the same numeraire as the market
                prices
                <MathJax inline>{' \\( \\mathbf{p}(t) \\) '}</MathJax>) for the
                <MathJax inline>{' \\( N \\) '}</MathJax>
                assets present,
                <MathJax inline>{' \\( c_{\\text{spread}} \\) '}</MathJax>
                is simply
              </p>
              <MathJax>
                {
                  '\\[ c_{\\text{spread}}(\\mathbf{R}_{\\text{cex}}(t), \\mathbf{R}_{\\text{cex}}(t-1), \\mathbf{p}(t)) = \\frac{1}{2} \\sum_{i=1}^{N} p_i(t)s_i(t)\\lvert R_{\\text{cex},i}(t) - R_{\\text{cex},i}(t-1)\\rvert. \\]'
                }
              </MathJax>

              <h3>Calculating the trades</h3>
              <p>
                Putting the above together, RVR has a system of equations from
                which RVR wants to obtain the post-rebalancing value of the
                portfolio
                <MathJax inline>{' \\( V_{\\text{cex}}(t) \\) '}</MathJax>
                and the trade RVR takes to get us there,
                <MathJax inline>
                  {
                    ' \\( \\mathbf{R}_{\\text{cex}}(t) - \\mathbf{R}_{\\text{cex}}(t-1) \\) '
                  }
                </MathJax>
                . The trade you want to do depends on the cost, and the cost
                depends on the trade. This problem is not solvable analytically,
                but using fast numerical solvers RVR can calculate
                <MathJax inline>{' \\( V_{\\text{cex}}(t) \\) '}</MathJax>
                and
                <MathJax inline>
                  {
                    ' \\( \\mathbf{R}_{\\text{cex}}(t) - \\mathbf{R}_{\\text{cex}}(t-1) \\) '
                  }
                </MathJax>
                as needed in our simulations.
              </p>

              <h2>AMM portfolio modelling</h2>

              <h3>Trade</h3>
              <p>
                AMMs charge fees on their trades. It is reasonable to take this
                into account in modelling the performance of AMM pools. In the
                first part of this analysis will assume no noise trades at all,
                just that arbitrageurs trade with the pool when it is in their
                interest to do so. Later on in the results section RVR will make
                use of a simple model for noise trades. In these calculations we
                benefit from recent advances in closed form expressions for the
                optimal arbitrage trade against G3M pools.
              </p>
              <p>
                Although TFMM pools benefit from being arbed quickly, as soon as
                the arbitrage opportunity first appears, RVR applies a 5 block
                discovery period, which for ETH mainnet amounts to one minute.
                This is to make it so that in our simulations RVR is not relying
                on the immediate action of arbitrageurs. Decreasing this
                discovery period would only increase performance.
              </p>

              <h3>Gas Costs</h3>
              <p>
                Standard modelling the no-arbitrage (aka &apos;no-trade&apos;)
                region of a pool---the combinations of quoted prices and market
                prices for which arbitrageurs cannot gain from trading against
                the pool ---assumes that the arbitrageur trades where the market
                value of the trade gives a return
                <MathJax inline>{'>0'}</MathJax>.
              </p>
              <p>
                One obvious cost that arbitrageurs have to cover is the gas cost
                of their own transactions. RVR requires that the arbitrage trade
                has to produce a profit greater than a threshold USD amount,
                which RVR will vary in our analysis.
              </p>
            </Fade>
          </MathJaxContext>
        </Col>
        <Col span={4}></Col>
      </Row>
    </div>
  );
};

export default RebalancingVsRebalancing;
