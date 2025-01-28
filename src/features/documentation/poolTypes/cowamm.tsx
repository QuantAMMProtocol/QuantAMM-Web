import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Fade } from 'react-awesome-reveal';
import { Col, Row } from 'antd';

const CowammPoolDescription: React.FC = () => {
  return (
    <Row>
      <Col span={4}></Col>
      <Col span={16}>
        <MathJaxContext>
          <Fade>
            <div style={{ padding: '20px' }}>
              <h1>COWAMM Pool</h1>
              <p>
                A CowAMM (Continuous-Weighted AMM) is a type of AMM that is
                designed to be clearing-price consistent. This means that the
                average price at which the CowAMM is willing to trade an asset
                is equal to the marginal price after the trade. This property is
                important because it ensures that the CowAMM is always trading
                at the market price, which helps to prevent arbitrage
                opportunities and price manipulation.
              </p>
              <p>
                The main concepts of interest using a simple constant-product
                function (both for the CFAMM and the FM-AMM), no fees, and
                keeping formalities to the minimum. In the next section, we
                generalize our definitions and results and introduce additional
                elements.
              </p>
              <p>
                As a preliminary step, the trading function of a constant
                product AMM is derived, the simplest and most common type of
                CFAMM. Suppose that there are two assets, ETH and DAI. A
                constant product AMM (CPAMM) is willing to trade ETH for DAI (or
                vice versa) as long as the product of its liquidity reserves
                remains constant (see Figure 1 for an illustration). Call Y and
                X its initial liquidity reserves in DAI and ETH, respectively,
                and <MathJax inline>{`p_{CPAMM}(x)`}</MathJax> the average price
                at which the CPAMM is willing to trade x ETH, where x &gt; 0
                means that CPAMM is selling ETH while x &lt; 0 means that the
                CPAMM is buying ETH. For the product of the liquidity reserves
                to be constant, it must be that
              </p>
              <MathJax>{`\\[ Y \\cdot X = (Y + p_{CPAMM}(x) \\cdot x)(X - x) \\]`}</MathJax>
              <p>or</p>
              <MathJax>{`\\[ p_{CPAMM}(x) = \\frac{Y}{X - x} \\]`}</MathJax>
              <p>
                Note that the marginal price of a CPAMM (i.e., the price to
                trade an arbitrarily small amount) is equal to the ratio of its
                liquidity reserves. The key observation is that, in a CPAMM, a
                trader willing to trade x pays a price different from the
                marginal price after the trade. This is precisely the reason why
                arbitrageurs can exploit a CPAMM: an arbitrageur who trades with
                the CPAMM to bring its marginal price in line with some
                exogenously determined equilibrium price does so at an
                advantageous price (and hence makes a profit at the expense of
                the CPAMM LPs).
              </p>
              <p>
                An FM-AMM is defined as an AMM in which, for every trade, the
                average price equals the marginal price after the trade – a
                property called clearing-price consistency. For ease of
                comparison with the CPAMM described earlier, suppose that the
                FM-AMM function is the product of the two liquidity reserves. If
                its marginal price is, again, the ratio of its liquidity
                reserves, then the AMM is clearing-price consistent if and only
                if its price function <MathJax inline>{`p(x)`}</MathJax> is
              </p>
              <MathJax>{`\\[ p(x) = \\frac{Y + x \\cdot p(x)}{X - x} \\]`}</MathJax>
              <p>
                where the RHS of the above expression is the ratio of the two
                liquidity reserves after the trade. Solving for{' '}
                <MathJax inline>{`p(x)`}</MathJax> yields:
              </p>
              <MathJax>{`\\[ p_{FM-AMM}(x) \\equiv p(x) = \\frac{Y}{X - 2x} \\]`}</MathJax>
              <p>
                which implies that the FM-AMM’s marginal price is, indeed, the
                ratio of the liquidity reserves. Hence, a given trade on the
                FM-AMM generates twice the price impact than the same trade on
                the traditional CPAMM (cf. the expression for{' '}
                <MathJax inline>{`p_{CPAMM}(x)`}</MathJax>). Interestingly, an
                FM-AMM can also be seen as a price-taking agent maximizing an
                objective function. If its objective function is the product of
                the two liquidity reserves, then for a given price{' '}
                <MathJax inline>{`p`}</MathJax> the FM-AMM supplies x ETH by
                solving the following problem:
              </p>
              <MathJax>{`\\[ x_{FM-AMM}(p) = \\text{argmax}_x \\{(X - x)(Y + p \\cdot x)\\} \\]`}</MathJax>
              <p>It is easy to check that the FM-AMM supply function is:</p>
              <MathJax>{`\\[ x_{FM-AMM}(p) = \\frac{1}{2} \\left( X - \\frac{Y}{p} \\right) \\]`}</MathJax>
              <p>
                Hence, to purchase x ETH on the FM-AMM, the price needs to be,
                again:
              </p>
              <MathJax>{`\\[ p_{FM-AMM}(x) = \\frac{Y}{X - 2x} \\]`}</MathJax>
              <p>
                It follows that, whereas a traditional CPAMM always trades along
                the same curve given by <MathJax inline>{`Y \\cdot X`}</MathJax>
                , the FM-AMM trades as to be on the highest possible curve. With
                some approximation, you can see an FM-AMM as a traditional CPAMM
                in which additional liquidity is added with each trade. See
                Figure 2 for an illustration.
              </p>
              <p>
                A final observation is that the FM-AMM’s trading function is
                equivalent to
              </p>
              <MathJax>{`\\[ p \\cdot (X - x_{FM-AMM}(p)) = Y + p \\cdot x_{FM-AMM}(p) \\]`}</MathJax>
              <p>
                In other words, for a given <MathJax inline>{`p`}</MathJax>, the
                values of the two liquidity reserves are equal after the trade.
                Therefore, an FM-AMM with product function trades to implement a
                passive investment strategy, in which the total value of the two
                reserves is equally split between the two assets (that is, a
                passive investment strategy with weights 1/2, 1/2). It is easy
                to check that the FM-AMM can implement any passive investment
                strategy with fixed weights (α, 1 − α) by specifying the
                objective function as{' '}
                <MathJax inline>{`(X - x)^α(Y + p \\cdot x)^{1-α}`}</MathJax>.
              </p>
            </div>
          </Fade>
        </MathJaxContext>
      </Col>
      <Col span={4}></Col>
    </Row>
  );
};

export default CowammPoolDescription;
