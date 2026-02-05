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
export function PowerChannelUpdateRule(props: DocProps) {
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
                  <h1>QuantAMM Update Rule: Power Channel</h1>
                </div>
              </Col>
              <Col span={24}>
                <Form.Item style={{ marginTop: '5px', marginBottom: '0px' }}>
                  <Radio.Group
                    size="small"
                    value={eli5}
                    onChange={(e) => setEli5(e.target.value)}
                  >
                    <Radio.Button disabled={true}>
                      User Knowledge Level:{' '}
                    </Radio.Button>
                    <Radio.Button value={'ELI5'}>ELI5</Radio.Button>
                    <Radio.Button value={'Quant'}>
                      Quant
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div hidden={eli5 !== 'ELI5' || props.hideImage}>
                  <Row>
                    <Col span={8}>
                      <img
                        loading="lazy"
                        src={'/documentation/power_channel.svg'}
                        style={{
                          width: '100%',
                          paddingRight: '5%',
                          paddingTop: '15%',
                        }}
                      />
                    </Col>
                    <Col span={16}>
                      <Eli5 strategy="POWER_CHANNEL" />
                    </Col>
                  </Row>
                </div>
                <div
                  hidden={
                    eli5 !== 'ELI5' || (eli5 === 'ELI5' && !props.hideImage)
                  }
                >
                  <Row>
                    <Col span={24}>
                      <Eli5 strategy="POWER_CHANNEL" />
                    </Col>
                  </Row>
                </div>
                <div hidden={eli5 === 'ELI5'}>
                  <h3>Summary</h3>
                  <p>
                    This update rule applies a soft form of
                    &apos;channeling&apos; within a momentum update rule, so the
                    pool only acts on large price movements and when it does act
                    it acts more aggresively than a &apos;vanilla&apos; momentum
                    strategy.
                  </p>
                  <h3>How it works</h3>
                  <p>
                    <span>At each step we update</span>
                    <MathJax inline>{' \\(\\mathbf{w}(t)\\) '}</MathJax>
                    <span>with the update rule</span>
                    <MathJax>
                      {
                        ' \\[\\mathbf{w}(t) = \\mathbf{w}({t-1}) + \\kappa \\cdot \\left(\\mathrm{sign}\\left(\\frac{1}{{\\mathbf{p}}(t)}\\frac{\\partial \\mathbf{p}(t)}{\\partial t}\\right)\\left|\\frac{1}{{\\mathbf{p}}(t)}\\frac{\\partial \\mathbf{p}(t)}{\\partial t}\\right|^{q} - \\ell_{\\mathbf{p}(t)}\\right)\\] '
                      }
                    </MathJax>
                    <span>
                      where κ is a chosen, fixed, parameter that tunes how
                      quickly, how aggressively, the pool will change its
                      weights in light of the signal it receives, and{' '}
                    </span>
                    <MathJax inline>{' \\(q\\) '}</MathJax>
                    <span>
                      is a chosen exponent. Division is performed elementwise,
                      and
                    </span>
                    <MathJax>
                      {
                        ' \\[\\ell_{\\mathbf{p}(t)} = \\sum_{i=1}^N \\left(\\mathrm{sign}\\left(\\frac{1}{{\\mathbf{p}}(t)}\\frac{\\partial \\mathbf{p}(t)}{\\partial t}\\right)\\left|\\frac{1}{{\\mathbf{p}}(t)}\\frac{\\partial \\mathbf{p}(t)}{\\partial t}\\right|^{q}\\right)_i\\] '
                      }
                    </MathJax>
                    <span>so that the vector change in portfolio weights,</span>
                    <MathJax inline>
                      {' \\(\\mathbf{w}(t) - \\mathbf{w}({t-1})\\), '}
                    </MathJax>
                    <span>
                      has entries that sum to 0. This is in keeping with the
                      requirements for weights, as discussed above: if the
                      weights summed to one before this update, they will also
                      sum to one after this update.
                    </span>
                  </p>
                  <p>
                    <span>Like momentum, dependence of performance on</span>
                    <MathJax inline>{' \\(\\kappa\\) '}</MathJax>
                    <span> is geometric-it is changes in the scale of </span>
                    <MathJax inline>{' \\(\\kappa\\) '}</MathJax>
                    <span>
                      {' '}
                      that leads to changes in behaviour. So when applying this
                      rule it is easier for the user to input
                    </span>
                    <MathJax inline>{' \\(\\log(\\kappa)\\). '}</MathJax>
                  </p>
                  <Divider></Divider>
                  <h3>Parameter Guide {'&'} Return Profile Summary</h3>
                  <p>
                    {
                      rules.find((x) => x.updateRuleName === 'Power Channel')
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
