import { Col, Form, Radio, Row } from 'antd';
import { ProductItemBackground } from '../../../productExplorer/productItem/productItemBackground';
import { useState } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

export function FAQ() {
  const [eli5, setEli5] = useState('ELI5');
  return (
    <ProductItemBackground
      wide={true}
      layers={20}
      backgroundColourOverride="#FFFEF2"
      borderColourOverride="#f6f4ef"
    >
      <Row style={{ marginTop: '10vh' }}>
        <Col span={24}>
          <h1 style={{ color: 'black', textAlign: 'center', width: '100%' }}>
            FAQ
          </h1>
        </Col>
        <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
          <Form.Item style={{ marginTop: '5px' }}>
            <Radio.Group
              size="small"
              value={eli5}
              onChange={(e) => setEli5(e.target.value)}
            >
              <Radio.Button
                disabled={true}
                style={{ backgroundColor: 'black', color: 'white' }}
              >
                Choose User Knowledge Level:{' '}
              </Radio.Button>
              <Radio.Button value={'ELI5'}>ELI5</Radio.Button>
              <Radio.Button value={'Crypto native user'}>
                Crypto native user
              </Radio.Button>
              <Radio.Button value={'Quant'}>Quant Mathematical</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Row>
          <Col span={2}></Col>
          <Col span={20}>
            <Row style={{ color: 'black', textAlign: 'center' }}>
              <Col span={4}>
                <h4>How do BTFs rebalance holdings?</h4>
              </Col>
              <Col span={1}></Col>
              <Col span={4}>
                <h4>Is it complex to LP?</h4>
              </Col>
              <Col span={1}></Col>
              <Col span={4}>
                <h4>Do BTFs earn yield and swap fees?</h4>
              </Col>
              <Col span={1}></Col>
              <Col span={4}>
                <h4>Isn&apos;t this vulnerable to MEV?</h4>
              </Col>
              <Col span={1}></Col>
              <Col span={4}>
                <h4>Why would I just not run a fund on a CEX?</h4>
              </Col>
            </Row>
            <Row style={{ color: 'black', padding: '1vh' }}>
              <Col span={4}>
                <div hidden={eli5 != 'ELI5'}>
                  <p>
                    The BTF automatic, transparent strategy says it must sell
                    BTC as BTCs price is tanking.
                  </p>
                  <p>
                    Usually I need a go to an exchange and sell at a price
                    quoted by the exchange.
                  </p>
                  <p>
                    QuantAMM offers a price to all external traders for someone
                    to buy the BTC off the BTC.
                  </p>
                  <p>
                    Why offer a price instead of selling on an exchange at a
                    quoted price?
                  </p>
                  <p>It saves you considerable money and complexity</p>
                </div>
                <div hidden={eli5 != 'Crypto native user'}>
                  <p>
                    BTFs are Balancer V3 G3M pools with weights that change from
                    block to block
                  </p>
                  <p>
                    Using the standard G3M AMM pricing formula, by changing the
                    weight you change the price
                  </p>
                  <p>
                    This offers a slightly off-market arbitrage opportunity to
                    the market in the direction you want to rebalance
                  </p>
                  <p>
                    If that opportunity is large enough an external arbitrageur
                    trades with you and rebalances your holdings
                  </p>
                </div>
                <div hidden={eli5 != 'Quant'}>
                  <MathJaxContext>
                    <p>
                      <span>TFMM architecture has weights based on time:</span>
                    </p>
                    <MathJax>
                      {'\\[\\prod_{i=1}^{N} R_i^{w_i(t)}= k(t)\\]'}
                    </MathJax>

                    <p>
                      <span>Since any trade with a pool must not decrease</span>
                      <MathJax inline>{' \\(k(t)\\), '}</MathJax>
                      <span>
                        the change in weights is all that is required to cause
                        the pool&apos;s reserves to be rebalanced: those trades
                        which take place are those which bring the reserves into
                        the target ratio, meaning that the DEX is not required
                        to execute any trades of its own to enact the
                        rebalancing.
                      </span>
                    </p>
                  </MathJaxContext>
                </div>
              </Col>
              <Col span={1}></Col>
              <Col span={4}>
                <div hidden={eli5 != 'ELI5'}>
                  <p>Deposit your tokens and get a pool token</p>
                  <p>Withdraw the pool token and get tokens back</p>
                  <p>Simple.</p>
                  <p>
                    No complex layered deposits, no lock ins, no streaming fees.
                  </p>
                  <p>No Custodian. No Fuss.</p>
                  <p>
                    QuantAMM is built using Balancer V3. Your deposits are safe
                    in Balancer V3s state of the art vault
                  </p>
                </div>
                <div hidden={eli5 != 'Crypto native user'}>
                  You get pool ERC20 tokens proportional to your deposit. This
                  may be a multitoken deposit proportional to the pool weights.
                  Or it can be a single token unbalanced deposit that is
                  slightly less efficient.
                </div>
                <div hidden={eli5 != 'Quant'}></div>
              </Col>

              <Col span={1}></Col>
              <Col span={4}>
                <div hidden={eli5 != 'ELI5'}>
                  <p>
                    BTFs are Balancer AMM pools. Retail swappers can still swap
                    on the pools earning you swap fees ontop of your BTF capital
                    appreciation.
                  </p>
                  <p>
                    If a constituent is yield bearing then that value is
                    captured inside the BTF
                  </p>
                  <p>
                    Incentives are also provided and can be seen on the pool
                    exploration pages
                  </p>
                </div>
                <div hidden={eli5 != 'Crypto native user'}>
                  <p>
                    Given the BTF is an AMM pool itself it has all the benefits
                    of a next gen AMM. Balancer V3 has different kinds of
                    routers including batch routers and MEV resistant routers.
                    The pools also recycle yield back into the pool. As QuantAMM
                    is built using Balancer V3 DEX aggregation is also
                    considerably easier increasing volumes.
                  </p>
                </div>
                <div hidden={eli5 != 'Quant'}>
                  <MathJaxContext>
                    <MathJax>
                      {'\\[\\prod_{i=1}^{N} R_i^{w_i(t)}= k(t)\\]'}
                    </MathJax>
                    <span>
                      At any given block time BTFs becomes standard G3M pools
                      and allow for any ratio of swaps.
                    </span>
                    <span>
                      This means, not only is arbitrage possible but retail
                      swaps possible.
                    </span>
                    <span>
                      As the change in weights offer a slightly off market price
                      this may be the best price for retail
                    </span>
                    <span>
                      Given the change in weights arbitrage volume is also
                      typically 2x larger given
                    </span>
                  </MathJaxContext>
                </div>
              </Col>
              <Col span={1}></Col>
              <Col span={4}>
                <div hidden={eli5 != 'ELI5'}>
                  <p>
                    Maximal extractable value or MEV has the ultimate effect of
                    leaking value of your trade to bots. QuantAMM BTFs adhere to
                    stringent guards to make sure you leak as little value as
                    possible.
                  </p>
                  <p>
                    Our novel approach can be up to 15% more efficient than even
                    VIP exchanges
                  </p>
                </div>
                <div hidden={eli5 != 'Crypto native user'}>
                  <p>
                    A change in weights is a change in the price of a token.
                    This exposes a price difference across blocks leading to a
                    potential multiblock arbitrage opportunity. QuantAMM has a
                    MEV resistant router that can be used to protect against
                    this. Similarly, a large weight change is analagous to a
                    large trade. In DeFi the larger the trade the greater the
                    splippage and risk. By applying a speed limit to the weight
                    changes based on substatial research this risk can be
                    mitigated.
                  </p>
                </div>
                <div hidden={eli5 != 'Quant'}></div>
              </Col>
              <Col span={1}></Col>
              <Col span={4}>
                <div hidden={eli5 != 'ELI5'}>
                  <p>
                    Research has shown how running funds as BTFs can be
                    considerably more efficient
                  </p>
                  <p>
                    Not only is it more efficient but BTFs also earn DEX swap
                    fees and charge no streaming fees
                  </p>
                  <p>
                    This provides enhanced revenue on top of token appreciation
                    and yield that CEXs do not provide
                  </p>
                </div>
                <div hidden={eli5 != 'Crypto native user'}>
                  <p>
                    LVR is the current state of the art metric to define AMM
                    efficiency. We expand LVR to include CEX level realism and
                    demonstrate how, under a broad range of strategies, CEX fees
                    and spreads more often than not it is more efficient to run
                    funds as dynamic weighted AMMs rather than running a fund on
                    a CEX.
                  </p>
                </div>
                <div hidden={eli5 != 'Quant'}></div>
              </Col>
            </Row>
          </Col>
          <Col span={2}></Col>
        </Row>
      </Row>
    </ProductItemBackground>
  );
}
