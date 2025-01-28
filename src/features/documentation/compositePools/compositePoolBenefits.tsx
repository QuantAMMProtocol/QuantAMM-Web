import { Col, Row } from 'antd';
import { MathJaxContext } from 'better-react-mathjax';

export function CompositePoolBenefits() {
  return (
    <Row>
      <MathJaxContext>
        <Col span={4}></Col>
        <Col style={{ padding: 10 }} span={16}>
          <h3>Factors limiting numbers of constituents in pools</h3>
          <p>
            A problem with existing AMMs which aspire to be portfolio managers
            is that most trades are executed against pools containing only two
            or three assets: such small baskets of tokens are undeserving of the
            name “portfolio”. Investors who seek to distribute their liquidity
            across a number of assets—that is, investors who seek to invest in
            funds covering a true portfolio—are therefore faced with a dilemma:
            they can invest in a low-volume pool covering the assets of interest
            with their desired weighting; or they can invest across a number of
            such small pools, therefore benefiting from the better trade volume,
            at the cost of manual portfolio management.
          </p>
          <h3>How composite pools can provide large numbers of consituents</h3>
          <p>
            The architecture of QuantAMM enables investors to circumvent this
            dilemma, by investing in composite pools constructed by “pooling
            pools”: the liquidity invested in a metapool is distributed across
            its underlying pools, enabling an investor to benefit from the
            volume in these underlying pools while covering their assets of
            interest. Moreover, composite pools can inherit QuantAMM’s automatic
            rebalancing, meaning that liquidity can be shifted between, not just
            within, the underlying pools, allowing QuantAMM to be more
            successful as an automated portfolio manager. The metapool system
            has the further benefit of improving liquidity for traders, as
            liquidity need not be removed from small-basket high-volume pools in
            order to capitalize broader-based portfolio funds.
          </p>
          <h3>Dynamically reallocating between strategies</h3>
          <p>
            Despite already adding value by allowing a metapool with many
            constituents across subpools, QuantAMM composite pools can also be
            used to dynamically shift weight between subpools that have
            different update rules depending on which update rule is performing
            well in the current market condition. This allows the liquidity pool
            portfolio manager to set up a metapool with different subpools tuned
            for different market conditions and letting the automated
            rebalancing process do the reallocation process. This should greatly
            increase metapool reaction time to changing market conditions as
            well as reduce overhead.
          </p>
          <h3>Improving metapool and trade liquidity</h3>
          <p>
            Because composite pools are equivalent to pools containing liquidity
            tokens (or subpools or quotients thereof), and we wish to reduce the
            fragmentation of liquidity and trading activity, QuantAMM ensures
            that any pool including a liquidity token is considered as a
            metapool containing the pool associated to the liquidity token; note
            that any individual token is also equivalent to a trivial pool
            containing assets only of that token type.
          </p>
          <p>
            As a further step to improve trade liquidity, QuantAMM holds all
            pool liquidity in a centralized smart contract, and performs only
            the computation on-chain necessary to validate trades: the central
            QuantAMM smart contract executes trades, dispatching the checks that
            relevant invariants are satisfied to the underlying pools, but only
            requiring that the invariants must be satisfied at the end of a
            transaction. This means that QuantAMM supports inexpensive
            multi-step trades within a single transaction, and allows for pool
            invariants to be transiently broken within each transaction, as long
            as the invariants are finally satisfied.
          </p>
          <p>
            This flexibility is important for metapool trading: for example, in
            order to trade across the pools constituting a metapool, it may be
            necessary to move liquidity between pools, and the optimal sequence
            of trades (and joins and exits) may transiently break the invariants
            of the underlying pools. In principle, this extra flexibility allows
            traders to draw on the combined reserves of the entire QuantAMM
            platform in order to minimize slippage, and enables sophisticated
            manoeuvres such as using flash loans mid-trade in order to resolve
            broken invariants.
          </p>
          <p>
            Since all that is required of a QuantAMM trade is that the relevant
            invariants are finally satisfied, computing the optimal sequence of
            operations can be performed entirely in the front end using
            sophisticated optimization routines. The QuantAMM smart contract
            then acts like an interpreter for a domain-specific trade language,
            and only needs to check the final satisfaction of the invariants,
            which is a low-cost operation requiring no complex on-chain
            optimization.
          </p>
        </Col>
        <Col span={4}></Col>
      </MathJaxContext>
    </Row>
  );
}
