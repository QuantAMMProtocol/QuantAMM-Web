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
];
