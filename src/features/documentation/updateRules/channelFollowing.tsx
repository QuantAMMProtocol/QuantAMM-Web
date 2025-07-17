import { Col, Row, Radio, Divider, Form } from 'antd';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectAvailableUpdateRules } from '../../simulationRunConfiguration/simulationRunConfigurationSlice';
import { Eli5 } from '../../shared';

interface DocProps {
  hideTitle?: boolean;
  hideImage?: boolean;
}

export function ChannelFollowingUpdateRule(props: DocProps) {
  const [eli5, setEli5] = useState('ELI5');
  const rules = useAppSelector(selectAvailableUpdateRules);

  return (
    <div>
      <MathJaxContext>
        <Row>
          <Col span={1}></Col>
          <Col style={{ padding: 10 }} span={23}>
            <Row>
              <Col span={24}>
                <div hidden={props.hideTitle}>
                  <h1>QuantAMM Update Rule: Channel Following</h1>
                </div>
              </Col>
              <Col span={24}>
                <Form.Item style={{ marginTop: '5px' }}>
                  <Radio.Group
                    size="small"
                    value={eli5}
                    onChange={(e) => setEli5(e.target.value)}
                  >
                    <Radio.Button disabled={true}>
                      User Knowledge Level:{' '}
                    </Radio.Button>
                    <Radio.Button value={'ELI5'}>ELI5</Radio.Button>
                    <Radio.Button value={'Quant'}>Quant</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ padding: 10 }}>
                <div hidden={eli5 != 'ELI5'|| props.hideImage}>
                  <Row>
                    <Col span={8}>
                      <img
                        loading="lazy"
                        src={'/documentation/channel_following.svg'}
                        style={{
                          width: '100%',
                          paddingLeft: '10%',
                          paddingRight: '10%',
                          paddingBottom: '10%',
                        }}
                      />
                    </Col>
                    <Col span={16}>
                      <div style={{ marginTop: '20px' }}>
                        <Eli5 strategy="CHANNEL_FOLLOWING" />
                      </div>
                    </Col>
                  </Row>
                </div>
                <div hidden={eli5 == 'ELI5' || (eli5 == 'ELI5' && !props.hideImage)}>
                  <h3>Summary</h3>
                  <p>
                    Often associated with weighted moving averages, this
                    strategy expects a stable channel where prices can vary -
                    allowing to buy low and sell high within the accepted range.
                    However professional traders understand that a price
                    trajectory can become stale and if the price exits the
                    projected channel you need to act fast to exit a freefall
                    position or increase weight of a now mooning token.
                  </p>
                  <h3>How it works</h3>
                  <p>
                    <span>
                      Channel following can be seen as a combination of mean
                      reversion and power channel. During small price
                      fluctuations it expects reversion back to a mean, during
                      large price movements it expects that this a change in
                      signal and to act accordingly. At each step we update
                    </span>
                    <MathJax inline>{' \\(\\mathbf{w}(t)\\) '}</MathJax>
                    <span>with the update rule</span>
                    <MathJax>
                      {
                        ' \\[\\mathbf{w}(t) = \\mathbf{w}({t-1}) + \\kappa \\left(\\mathbf c(t) + \\mathbf m(t) - \\ell_{\\mathbf{p}(t)}\\right).\\] '
                      }
                    </MathJax>
                    <span>where</span>
                    <MathJax inline>{' \\(\\mathbf{m}(t)\\) '}</MathJax>
                    <span>
                      {' '}
                      is the definition of how the power channel subrule should
                      behaves if the price changes are large enough.
                    </span>
                    <MathJax inline>{' \\(\\mathbf{c}(t)\\) '}</MathJax>
                    <span>
                      {' '}
                      is the definition of the mean reversion subrule should
                      behaves if the price changes are small enough.
                    </span>
                  </p>
                  <h3>
                    How the rule switches between power channel and mean
                    reversion
                  </h3>
                  <p>
                    <span>
                      How does the rule determine if to act like a power channel
                      rule or a mean reversion channel?
                    </span>
                    <span>
                      {' '}
                      We can do this by having some kind of ‘envelope’ function
                      that is ≈ 1 near{' '}
                    </span>
                    <MathJax inline>
                      {
                        ' \\(\\left(\\frac{1}{\\overline{\\mathbf{p}}({t})}\\frac{\\partial \\mathbf{p}(t)}{\\partial t}\\right)=0\\) '
                      }
                    </MathJax>
                    <span> and ≈ 0 when </span>
                    <MathJax inline>
                      {
                        ' \\(\\left(\\frac{1}{\\overline{\\mathbf{p}}({t})}\\frac{\\partial \\mathbf{p}(t)}{\\partial t}\\right)\\) '
                      }
                    </MathJax>
                    <span> is far from zero. </span>
                  </p>
                  <p>
                    <span> The gaussian function:</span>
                    <MathJax inline>
                      {' \\(\\mathbf{f}(x)=\\exp(-x^2)\\) '}
                    </MathJax>
                    <span>
                      and scalings/shifts thereof is an excellent function for
                      our purposes here.
                    </span>
                    <span>
                      Extremely informally, our rule would then be something
                      like:
                    </span>
                  </p>
                  <p>
                    {' '}
                    <b>
                      rule = envelope · &apos;anti−momentum subrule&apos; + (1 −
                      envelope) · &apos;momentum subrule&apos;.
                    </b>
                  </p>

                  <p>
                    <MathJax inline>
                      {
                        '\\[\\mathbf v(t) = \\exp{\\left(-\\frac{\\frac{1}{\\overline{\\mathbf{p}}({t})}\\frac{\\partial \\mathbf{p}(t)}{\\partial t}}{2 w^2}\\right)}\\]'
                      }
                    </MathJax>
                    <span>
                      with ‘v’ standing for envelope. w tunes the width of the
                      envelope. We plot v(·) and 1 − v(·) in the below figure:
                    </span>
                    <span>[diagram]</span>
                    <span>
                      This diagram shows how one rule takes over closer to 0
                      while the other takes over further away from 0.
                    </span>
                  </p>
                  <Divider></Divider>
                  <h3>Parameter Guide {'&'} Return Profile Summary</h3>
                  <p>
                    {
                      rules.find((x) => x.updateRuleName == 'Channel Following')
                        ?.updateRuleResultProfileSummary
                    }
                  </p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </MathJaxContext>
    </div>
  );
}
