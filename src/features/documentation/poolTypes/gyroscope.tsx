import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Fade } from 'react-awesome-reveal';
import { Col, Row } from 'antd';

const GyroscopePoolDescription: React.FC = () => {
  return (
    <div>
      <Row>
        <Col span={4}></Col>
        <Col span={16}>
          <Fade>
            <h1>Gyroscope Protocol</h1>
            <p>
              The Gyroscope protocol is a decentralized finance (DeFi) protocol
              designed to provide stable and efficient automated market making
              (AMM) for various assets. It leverages advanced mathematical
              models to ensure liquidity and minimize slippage.
            </p>
            <MathJaxContext>
              <div>
                <h2>Mathematical Model</h2>
                <p>
                  The core of the Gyroscope protocol is based on the following
                  equation:
                </p>
                <MathJax>{` \\[ P(x) = \\frac{d}{dx} \\left( \\frac{1}{x} \\right) \\] `}</MathJax>
                <p>
                  This equation ensures that the price of the asset is inversely
                  proportional to its supply, providing stability and efficiency
                  in the market.
                </p>
              </div>
            </MathJaxContext>

            <h1>ECLP AMMs</h1>
            <p>
              ECLP (Efficient Constant Liquidity Pools) AMMs are a type of
              automated market maker that maintain constant liquidity for
              trading pairs. They are designed to provide efficient and stable
              trading experiences by adjusting liquidity dynamically based on
              market conditions.
            </p>
            <MathJaxContext>
              <div>
                <h2>Mathematical Model</h2>
                <p>
                  The ECLP AMM model can be described by the following equation:
                </p>
                <MathJax>{` \\[ L = k \\cdot \\sqrt{x \\cdot y}\\] `}</MathJax>
                <p>
                  Where <MathJax inline>{`L`}</MathJax> is the liquidity,{' '}
                  <MathJax inline>{`k`}</MathJax> is a constant, and{' '}
                  <MathJax inline>{`x`}</MathJax> and{' '}
                  <MathJax inline>{`y`}</MathJax> are the reserves of the two
                  assets in the pool. This equation ensures that the product of
                  the reserves remains constant, providing efficient liquidity
                  management.
                </p>
              </div>
            </MathJaxContext>

            <h2>Gyroscope Protocol Mission</h2>
            <p>
              The Gyroscope protocol&apos;s mission is to build robust public
              infrastructure for DeFi. The central piece is a fully-backed
              stablecoin with all-weather reserves and autonomous price
              bounding.
            </p>

            <h3>Fully Backed Stablecoin</h3>
            <p>
              The Gyroscope stablecoin aims at a long-term reserve ratio of
              100%, where every unit of stablecoin is backed by 1 USD worth of
              collateral.
            </p>

            <h3>All-Weather Reserve</h3>
            <p>
              The reserve is a basket of protocol-controlled assets that jointly
              collateralize the issued stablecoin. Initially, most assets will
              be other stablecoins. The reserve aims to diversify all risks in
              DeFi to the greatest extent possible. It considers more than just
              price risk, but also censorship, regulatory, counterparty, oracle,
              and governance risks.
            </p>

            <h3>Autonomous Price Bounding</h3>
            <p>
              Prices for minting and redeeming stablecoins are set autonomously
              to balance the goal of maintaining a tight peg with the goal of
              long-term viability of the project in the face of short-term
              crises.
            </p>

            <h2>Core Stability Mechanisms</h2>
            <h3>Scenario A: Stablecoin Priced Above Par Value</h3>
            <p>
              If the price rises above the peg, more stablecoins can be minted
              and sold on the market, with the proceeds growing the reserve.
              This is effectively a closed arbitrage loop on the upside. In a
              future iteration of the protocol, further programmatic logic could
              be added to respond to transitory market events (such as a loss of
              confidence in another stablecoin), which could otherwise have an
              outsized and unpredictable impact on Gyroscope. By measuring the
              level of inflows and outflows, two additional risk controls can be
              set-up: (1) dynamic fees to mint/redeem, (2) circuit breakers to
              temporarily disable minting. These risk controls can be further
              explored for potential usage in a later iteration of the protocol.
            </p>

            <h3>Scenario B: Stablecoin Priced Below Par Value</h3>
            <p>
              Depending on the reserve value covering 100% of the stablecoin
              supply or not, this scenario plays out differently:
            </p>
            <p>
              With healthy reserves, the same arbitrage loop as on the upside
              exists. Stablecoins can be bought on the market and redeemed for
              $1 worth of reserve assets. This is the default case, as supported
              by the first line of defense, the all-weather reserve design,
              which makes the asset-backing as robust as possible.
            </p>
            <p>
              If there is a large shock to the reserve, additional lines of
              defense exist, including autonomous price bounding.
            </p>

            <h2>Lines of Protocol Defense</h2>
            <p>
              Multiple lines of defense exist to maintain a stable system. The
              first line of defense is the all-weather reserve which stores all
              issuance proceeds and further diversifies all risks in DeFi to the
              extent possible. This aims for full collateralization as the
              default scenario. The all-weather reserve is diversifying against
              more than just price risk, but also censorship, regulatory,
              counterparty, oracle, and governance risks. While the reserve will
              initially be almost exclusively composed of other stablecoins,
              this may vary over the longer-term. A large shock to the reserve
              would only occur if there are even larger problems in other DeFi
              systems, in which case Gyroscope would aim to provide the least
              bad outcome.
            </p>
            <p>
              If there is a large shock to the reserve, then the second line of
              defense, Gyroscope’s autonomous pricing takes control. If
              stablecoin units become undercollateralized, the bonding curve of
              the redemption market provides decreasing redemption quotes as a
              circuit breaker to maintain a sustainable system. This stability
              mechanism should rarely be needed, but exists as a contingency
              plan and is using the multi-market design of Gyroscope which
              concentrates liquidity within the price quotes of the stablecoin
              mint/redeem bonding curves. The goal of decreasing redemption
              quotes is to disincentivize bank-runs and attacks on the currency
              peg and reward users who wait for a transitory downturn to pass in
              a sustainable way. While the ability of stablecoin holders to exit
              is retained, Gyroscope, importantly, provides reasons to bet on
              the stablecoin returning to its target price, as the redemption
              price autonomously recovers back toward peg as outflows
              equilibrate back toward zero or the reserve recovers (e.g.,
              through yield).
            </p>
            <p>
              The intuition of the currency peg coordination game is as follows:
              Users form beliefs about the fundamental value of the stablecoin.
              These are based on the value of the reserve and how widely
              accepted and used the stablecoin is. But users also form beliefs
              about the beliefs of other market-participants (and so on).
              Gyroscope coordinates these beliefs. Since the value of the
              reserve is observable on-chain, as well as the rules governing how
              it will be used, rational users then implicitly agree on whether
              to attack or defend the peg since they only win by being in the
              majority. This aims to preempt confidence crises.
            </p>

            <h2>Tertiary Lines of Defense</h2>
            <p>
              Tertiary lines of defense include mechanisms that allow the
              reserves to recover or asset-backing to expand. The reserve can,
              for example, be recapitalized through auctioning off governance
              tokens. In fact, Gyroscope governance is incentivized to do this
              at opportune times to build asset buffers against shocks, as
              opposed to solely acting as a last resort backstop during a
              crisis. The Gyroscope mechanism also works side-by-side with a
              leveraged loans mechanism (like Maker) to strengthen stability.
            </p>

            <h2>Complimentary Infrastructure</h2>
            <p>
              Additional products arise from the Gyroscope design. For instance,
              a highly liquid DEX that can withstand asset failures arises
              naturally from the Gyroscope design. This design can be
              conceptualized as a network of secondary-market automated market
              makers, Reserve Pools and Outside Pools that will allow efficient
              routing of trades. GYD Trading Pools are redundant, highly-liquid
              paths in and out of the Gyroscope stablecoin, while the Dynamic
              Stability Mechanism (DSM) is the mint/redeem market. For more
              detailed explanations read the descriptions of the DSM and the GYD
              Trading Pools.
            </p>
          </Fade>
        </Col>
        <Col span={4}></Col>
      </Row>
    </div>
  );
};

export default GyroscopePoolDescription;
