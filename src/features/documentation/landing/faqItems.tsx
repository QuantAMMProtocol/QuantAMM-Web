import { Button } from "antd";
import { MathJax, MathJaxContext } from "better-react-mathjax";


export interface FAQItem {
    key: string;
    initialOpen: boolean;
    label: string;
    eli5Description: JSX.Element;
    cryptoNativeDescription: JSX.Element;
    quantDescription: JSX.Element;
}

export const FAQItems: FAQItem[] = [
    {
        key: '1',
        initialOpen: true,
        label: 'How do BTFs rebalance holdings?',
        eli5Description: (
            <>
                <p>
                    Bitcoin&apos;s price is tanking. The BTF&apos;s automatic strategy says sell Bitcoin. Usually you need a go to an exchange and sell at a price quoted by the exchange. If you are selling a large amount or the exchange is offering a bad price you may not get the price you want.
                </p>
                <p>
                    QuantAMM offers an attractive price to the global community for someone to buy the BTC off you.
                </p>
                <p>
                    If done right offering a price is more efficient as you don&apos;t pay fees fees or slippage to an exchange
                </p>
                <p>
                    It also removes considerable protocol complexity as you don&apos;t need a complex trade execution layer so the BTF can run fully on-chain. This means you don&apos;t have to trust an unknown manager to trade
                </p>
            </>
        ),
        cryptoNativeDescription: (
            <>
                <p>
                    BTFs are Balancer V3 DEX pools with weights that change from block to block. Using the standard G3M AMM pricing formula, by changing the weight you change the price. This offers a slightly off-market arbitrage opportunity to the market in the direction you want to rebalance. If that opportunity is large enough an external arbitrageur trades with you and rebalances your holdings.
                </p>
                <p>
                    The arbitrageur pays fees to you and you experience minor slippage if the arbitrageurs are aggressive - a good assumption to make. If the (slippage - fees) is less than the (fees + slippage) you pay to an external exchange, offering a price was more efficient than taking a price.
                </p>
                <p>
                    By offering tiny arbitrage opportunities per block you also avoid complex trade routing layers that require you to spread trades out across multiple venues and time to avoid MEV, sandwich attacks and slippage.
                </p>
            </>
        ),
        quantDescription: (
            <MathJaxContext>
                <p>
                    <span>
                        BTF architecture has weights based on block time{' '}
                        <MathJax inline>{' \\(w(t)\\) '}</MathJax>, given the dependancy on time we call this Temporal Function Market Making (TFMM) rather than Constant Function Market Making (CFMM):
                    </span>
                </p>
                <MathJax>
                    {
                        '\\[\\prod_{i=1}^{N} R_i^{w_i(t)}= k(t), \\quad\\mathrm{where\\,} \\sum_{i=1}^N w_i(t) = 1, \\,\\,\\mathrm{and\\,\\,} \\forall i\\,\\, 0\\leq w_i(t)<1.\\]'
                    }
                </MathJax>
                <p>
                    <span>Since any trade with a pool must not decrease</span>
                    <MathJax inline>{' \\(k(t)\\), '}</MathJax>
                    <span>
                        the change in weights is all that is required to cause the pool&apos;s reserves to be rebalanced: those trades which take place are those which bring the reserves into the target ratio, meaning that the DEX is not required to execute any trades of its own to enact the rebalancing.
                    </span>
                </p>
                <p>
                    As <MathJax inline>{' \\(w(t)\\) '}</MathJax> changes between blocks, in any one block BTFs are standard G3M pools like vanilla Balancer Weighted pools. This means DEX aggregators, arbitrageurs, depositors all face known standard pricing and practices making integrations easier.
                </p>
            </MathJaxContext>
        ),
    },
    {
        key: '5',
        initialOpen: false,
        label: 'Why would I just not run a fund on a CEX?',
        eli5Description: (
            <>
                <p>
                    Research has shown how running funds as BTFs can be considerably more efficient. Not only is it more efficient but BTFs also earn DEX swap fees and charge no streaming fees. This provides enhanced revenue on top of token appreciation and yield that CEXs do not provide.
                </p>
            </>
        ),
        cryptoNativeDescription: (
            <>
                <p>
                    LVR is the current state of the art metric to define AMM efficiency. We expand LVR to include CEX level realism and demonstrate how, under a broad range of strategies, CEX fees and spreads more often than not it is more efficient to run funds as dynamic weighted AMMs rather than running a fund on a CEX.
                </p>
            </>
        ),
        quantDescription: (
            <MathJaxContext>
                <p>
                    LVR is a idealistic metric to compare AMM efficiency compared to a CEX. We create a new metric called RVR with the following properties:
                </p>
                <table
                    style={{
                        width: '100%',
                        tableLayout: 'fixed',
                        borderCollapse: 'collapse',
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ width: '25%', textAlign: 'center', border: '1px solid white' }}>Model Features</th>
                            <th style={{ width: '25%', textAlign: 'center', border: '1px solid white' }}>LVR</th>
                            <th style={{ width: '25%', textAlign: 'center', border: '1px solid white' }}>ARB</th>
                            <th style={{ width: '25%', textAlign: 'center', border: '1px solid white' }}>RVR</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>CEX Spread</td>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>0</td>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>0</td>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>TradFi model</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>CEX Fees</td>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>0</td>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>0</td>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>Fee Present</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>AMM Fees</td>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>0</td>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>Fee Present</td>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>Fee Present</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>AMM Gas Cost</td>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>0</td>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>0</td>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>Fixed Costs</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>AMM tokens</td>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>2</td>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>2</td>
                            <td style={{ textAlign: 'center', border: '1px solid white' }}>N</td>
                        </tr>
                    </tbody>
                </table>
                <p>
                    In a paper we outline how, even with strategy variations, fee and gas variations, significant efficiencies over CEX run portfolios can be achieved.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        href="https://cdn.prod.website-files.com/6616670ddddc931f1dd3aa73/672283811331fc9bef39be23_RVR_30_10_24.pdf"
                        size="small"
                    >
                        View Full Paper
                    </Button>
                </div>
            </MathJaxContext>
        ),
    },
    {
        key: '2',
        initialOpen: false,
        label: 'Is it complex to LP?',
        eli5Description: (
            <>
                <p>
                    Deposit your tokens into the BTF and get BTF tokens in your wallet. Withdraw the BTF token and get underlying tokens back.
                </p>
                <p>Fire and forget. Simple.</p>
                <p>No complex layered deposits, no lock ins, no maintenance fees.</p>
                <p>No Custodian. No Fuss.</p>
                <p>
                    QuantAMM is built using Balancer V3. Your deposits have the safety of Balancer V3&apos;s state of the art vault.
                </p>
            </>
        ),
        cryptoNativeDescription: (
            <>
                <p>
                    You get pool ERC20 tokens proportional to your deposit. This may be a multitoken deposit proportional to the pool weights. Or it can be a single token unbalanced deposit that is slightly less efficient.
                </p>
                <p>
                    As with most AMMs the total supply depends on deposits and withdrawals of others. This means that you do not have to do any maintenance or rebalancing yourself. When you come to withdraw the proportion of the underlying that equates to your pool tokens will be transferred to you.
                </p>
                <p>
                    Balancer V3 is a non custodial AMM with a vault that is heavily audited.
                </p>
            </>
        ),
        quantDescription: (
            <MathJaxContext>
                <p>
                    Proportional asset deposits and withdrawals are standard G3M and given changes in weights are small per block the min slippage can be small. As a reminder single asset deposits are defined as:
                </p>
                <MathJax dynamic inline={false}>
                    {
                        '\\[A_t = B_t \\cdot \\frac{\\left(\\left(1 + \\frac{P_{\\text{issued}}}{P_{\\text{supply}}}\\right)^{\\frac{1}{W_t}} - 1\\right)}{(1 - W_t) \\cdot swapFee}\\]'
                    }
                </MathJax>
                <p>Single asset withdrawals are defined as:</p>
                <MathJax dynamic inline={false}>
                    {`\\[P_{\\text{redeemed}} = P_{\\text{supply}} \\cdot \\left[ 1 - \\left( 1 - \\frac{\\frac{A_t}{(1 - (1 - W_t) \\cdot swapFee)}}{B_t} \\right)^{W_t} \\right]\\]`}
                </MathJax>
            </MathJaxContext>
        ),
    },
    {
        key: '3',
        initialOpen: false,
        label: 'Do BTFs earn yield and swap fees?',
        eli5Description: (
            <>
                <p>
                    BTFs are Balancer AMM pools. Retail swappers can still swap on the pools earning you swap fees on top of your BTF capital performance. If a constituent is yield bearing then that value is captured inside the BTF. Incentives are also provided and can be seen on the pool exploration pages.
                </p>
            </>
        ),
        cryptoNativeDescription: (
            <>
                <p>
                    Given the BTF is an AMM pool itself it has all the benefits of a next gen AMM. Balancer V3 has different kinds of routers including batch routers and MEV resistant routers. The pools also recycle yield back into the pool. As QuantAMM is built using Balancer V3 DEX aggregation is also considerably easier increasing volumes.
                </p>
            </>
        ),
        quantDescription: (
            <MathJaxContext>
                <MathJax>{'\\[\\prod_{i=1}^{N} R_i^{w_i(t)}= k(t)\\]'}</MathJax>
                <span>
                    At any given block time BTFs becomes standard G3M pools and allow for any ratio of swaps.
                </span>
                <span>
                    This means, not only is arbitrage possible but retail swaps possible.
                </span>
                <p>
                    <span>
                        As the change in weights offer a slightly off market price this may be the best price for retail.
                    </span>
                    <span>
                        Given the change in weights arbitrage volume is also typically 2x larger given.
                    </span>
                </p>
                <p>The following gives a price for a swap:</p>
                <MathJax dynamic inline={false}>
                    {`\\[1 - \\frac{\\Delta_2}{R_2} = \\left( 1 + \\gamma \\frac{\\Delta_1}{R_1} \\right)^{-\\frac{w_1}{w_2}}.\\]`}
                </MathJax>
            </MathJaxContext>
        ),
    },
    {
        key: '4',
        initialOpen: false,
        label: "Isn't this vulnerable to MEV?",
        eli5Description: (
            <>
                <p>
                    Maximal extractable value or MEV has the ultimate effect of leaking value of your trade to bots. QuantAMM BTFs adhere to stringent guards to make sure you leak as little value as possible. Our novel approach can be up to 15% more efficient than even VIP exchanges.
                </p>
            </>
        ),
        cryptoNativeDescription: (
            <>
                <p>
                    A change in weights is a change in the price of a token. This exposes a price difference across blocks leading to a potential multiblock arbitrage opportunity.
                </p>
                <p>
                    Similarly, a large weight change is analogous to a large trade. In DeFi the larger the trade the greater the slippage and risk. By applying a speed limit to the weight changes based on substantial research this risk can be mitigated.
                </p>
            </>
        ),
        quantDescription: (
            <MathJaxContext>
                <p>
                    In this attack, the attacker first manipulates the pool&apos;s quoted price for the second token to be
                    <MathJax inline>
                        {' \\(m_{\\text{manip, AMM, 2}} = (1 + \\epsilon)m_p\\) '}
                    </MathJax>
                    , where{' '}
                    <MathJax inline>
                        {' \\(\\epsilon \\geq \\epsilon_0\\) '}
                    </MathJax>
                    .<MathJax inline>{' \\(\\epsilon_0\\) '}</MathJax> is the
                    &apos;do nothing&apos; or &apos;NULL&apos; value—equivalent to there being no attack carried out. When fees are present and we are in a worst-case scenario for the pool,{' '}
                    <MathJax inline>{' \\(\\epsilon_0 > 0\\) '}</MathJax>.
                    <MathJax inline>{' \\(C(\\epsilon)\\) '}</MathJax> denotes the cost to the attacker of performing the first,
                    price-manipulating, trade.
                    <MathJax inline>{' \\(X(\\epsilon)\\) '}</MathJax> denotes the return to the attacker from the post-weight-update arbitrage
                    trade. The overall benefit to the attacker over not carrying out the attack and just being an arbitrageur,
                    <MathJax inline>{' \\(Z(\\epsilon)\\) '}</MathJax>, is thus
                    <MathJax>
                        {
                            ' \\[Z(\\epsilon) = X(\\epsilon) - C(\\epsilon) - X(\\epsilon_0)\\] '
                        }
                    </MathJax>
                </p>
                <p>
                    When <MathJax inline>{' \\(Z(\\epsilon) > 0\\) '}</MathJax> the return from the attack,
                    <MathJax inline>
                        {' \\(X(\\epsilon) - C(\\epsilon)\\) '}
                    </MathJax>
                    , is greater than the vanilla, just-doing-arbitrage return
                    <MathJax inline>{' \\(X(\\epsilon_0)\\) '}</MathJax>. We can obtain bounds on{' '}
                    <MathJax inline>{' \\(X(\\epsilon)\\) '}</MathJax> and{' '}
                    <MathJax inline>{' \\(C(\\epsilon)\\) '}</MathJax>
                    when fees are present without having them in closed form.
                </p>
                <p>
                    Post-trade, the quoted prices are
                    <MathJax>
                        {
                            ' \\[m_{\\text{attacker}} = m_p(1 + \\epsilon) = \\frac{1}{\\gamma} \\frac{w_2}{R_2 - \\Delta_2} \\frac{w_1}{R_1 + \\Delta_1}.\\] '
                        }
                    </MathJax>
                </p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        href="https://arxiv.org/abs/2404.15489"
                        size="small"
                    >
                        View Full Paper
                    </Button>
                </div>
            </MathJaxContext>
        ),
    },
];
