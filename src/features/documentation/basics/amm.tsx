import { Col, Row } from 'antd';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Fade } from 'react-awesome-reveal';

export function AMMDescription() {
  return (
    <Row>
      <Col span={4}></Col>
      <Col style={{ padding: 20 }} span={16}>
        <Fade>
          <MathJaxContext>
            <h2>Simulating Automated Market Makers</h2>
            <p>
              Automated Market Makers (AMMs) are autonomous systems that manage
              holdings of assets. While first designed as a way to enable
              permissionless trading, a fundamental innovation is the
              transformation of portfolio management into pure mathematical
              functions operating on-chain. The QuantAMM Simulator provides a
              mathematical framework for exploring this design space within the
              Balancer V3 protocol. It models the mathematical relationships
              between pool design, trading mechanics, and market dynamics. The
              simulator enables mathematical verification of AMM designs without
              capital deployment. It systematically evaluates pool performance
              against historical market data to quantify behavior under
              real-world conditions.
            </p>
            <p>
              Other AMM simulations replay historical transaction sequences,
              constraining analysis to existing pool designs, pool compositions
              and trade flows. That approach optimizes liquidity provision
              solely for swap fee collection.
            </p>
            <p>
              AMMs are complete portfolio management systems, so this simulator
              focuses on how LP tokens accrue value from the changes in value of
              the assets in the pool. To that end, we have designed the
              simulator to model <i>any</i> basket of assets over any time span,
              given a time series of prices. The simulator works by calculating
              and applying the arbitrage trades that exist for pools.
            </p>
            <p>
              Advanced users can also model provided trade data, custom hooks
              that vary pool fees, and even turn off the arbitrage trades.
            </p>
            <p>
              The simulator models Balancer weighted pools, CowAMM pools,
              Gyroscope E-CLP pools, and our own QuantAMM pools.
            </p>
            <h3>Automated Market Maker 101</h3>
            <p>
              Automated Market Makers (AMMs) are a variety of decentralised
              exchange (DEX) where a mathematical formula is used on-chain to
              structure and execute exchanges out of a pool containing a basket
              of assets. Liquidity providers (LPs) deposit reserves of assets
              into the system, which are used as working capital against which
              the third-party traders can exchange.
            </p>
            <p>
              AMM pools charge fees on trades, giving a revenue stream to LPs.
              These pools can be thought of, however, as a form of asset
              management. The mathematical function that defines which trades
              against pool-held-reserves are accepted implicitly defines a
              strategy for the allocation of value between assets in the pool.
            </p>
            <p>
              In this form of asset management, the AMM pool reserves are the
              portfolio holdings. Rebalancing occurs due to the action of
              arbitrageurs: if the pool holds anything other than its desired
              allocation it quotes off-market prices. % the pool holding
              anything other than its desired allocation leads to the pool
              quoting off-market prices. Trades that take advantage of these
              off-market prices push the pool towards holding its desired
              portfolio and reduces the mis-pricing. In other words, the pool
              pays arbitrageurs to rebalance.
            </p>
            <h3>Understanding AMM Mechanics</h3>
            <p>
              <span>
                The simplest Constant-Function Market Maker (CFMM) is where the
                trading function is the product of the quantity of two tokens
                deposited:
              </span>
              <MathJax>{' \\[R_1 R_2 = k\\]'}</MathJax>
              <span>where</span>
              <MathJax inline>{' \\(R_1\\) '}</MathJax>
              <span>
                is the amount of reserves held by the protocol of the first
                token (wETH, say) and
              </span>
              <MathJax inline>{' \\(R_2\\) '}</MathJax>
              <span>is that of the second token (wBTC, say).</span>
            </p>
            <p>
              <span>
                If a trader comes wishing to transact with this Uniswap pool, to
                exchange one token for another, they must propose a transactions
                such that the updated reserves of the pool (
              </span>
              <MathJax inline>{' \\(\\tilde{R}_1 \\tilde{R}_2\\) '}</MathJax>
              <span>
                ) after this proposed transaction still multiply to a value at
                least as large as before:
              </span>
              <MathJax>
                {' \\[\\tilde{R}_1 \\tilde{R}_2 \\geq k = R_1 R_2\\]'}
              </MathJax>
              <span>
                (Here we are ignoring fees charged on the transaction, for
                simplicity&apos;s sake.)
              </span>
            </p>
          </MathJaxContext>
        </Fade>
      </Col>
      <Col span={4}></Col>
    </Row>
  );
}

export default AMMDescription;
