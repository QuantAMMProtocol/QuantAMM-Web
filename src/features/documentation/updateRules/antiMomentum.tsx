import { Col, Row, Radio, Divider, Form } from 'antd';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectAvailableUpdateRules } from '../../simulationRunConfiguration/simulationRunConfigurationSlice';
import { Eli5 } from '../../shared';

export function AntiMomentumUpdateRule() {
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
                <h1>QuantAMM Update Rule: Anti Momentum</h1>
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
                    <Radio.Button value={'Quant'}>
                      Quant
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ padding: '15px' }}>
                <div hidden={eli5 != 'ELI5'}>
                  <Row>
                    <Col span={8}>
                      <img
                        loading="lazy"
                        src={'/documentation/mean_reversion.svg'}
                        style={{
                          width: '100%',
                          paddingRight: '5%',
                          paddingTop: '15%',
                        }}
                      />
                    </Col>
                    <Col span={16}>
                      <Eli5 strategy="ANTI_MOMENTUM" />
                    </Col>
                  </Row>
                </div>
                <div hidden={eli5 == 'ELI5'}>
                  <h3>Summary</h3>
                  <p>
                    Under anti-momentum updating, the weights change in negative
                    proportion to the gradient of prices, and in inverse
                    proportion to the prices themselves.
                  </p>
                  <h3>How it works</h3>
                  <p>
                    <span>
                      The rule works as the &apos;mirror image&apos; of the
                      momentum rule. At each step we update
                    </span>
                    <MathJax inline>{' \\(\\mathbf{w}(t)\\) '}</MathJax>
                    <span>with the update rule</span>
                    <MathJax>
                      {
                        ' \\[\\mathbf{w}(t) = \\mathbf{w}({t-1}) + \\kappa \\cdot \\left(\\sum_{i=1}^N \\left[\\left(\\frac{1}{{\\mathbf{p}}(t)}\\right)_i \\left(\\frac{\\partial \\mathbf{p}(t)}{\\partial t}\\right)_i\\right] - \\frac{1}{{\\mathbf{p}}(t)}\\frac{\\partial \\mathbf{p}(t)}{\\partial t}\\right).\\] '
                      }
                    </MathJax>
                    <span>
                      κ is a chosen, fixed, parameter that tunes how quickly,
                      how aggressively, the pool will change its weights in
                      light of the signal it receives. Division is performed
                      elementwise, and and by construction the vector change in
                      portfolio weights,
                    </span>
                    <MathJax inline>
                      {' \\(\\mathbf{w}(t) - \\mathbf{w}({t-1})\\), '}
                    </MathJax>
                    <span>
                      has entries that sum to 0. This is in keeping with the
                      requirements for weights, as discussed above: if the
                      weights summed to one before this update, they will also
                      sum to one after this update. The term
                    </span>
                    <MathJax inline>
                      {
                        ' \\(\\sum_{i=1}^N \\left[\\left(\\frac{1}{{\\mathbf{p}}(t)}\\right)_i \\left(\\frac{\\partial \\mathbf{p}(t)}{\\partial t}\\right)_i\\right]\\) '
                      }
                    </MathJax>
                    <span>
                      in the update rule, required to make the update sum to
                      zero, is reminiscent of mean-reversion strategies in
                      TradFi that make use of the &apos;winner-loser
                      effect&apos;.
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
                    <MathJax inline>{' \\(\\log(\\kappa)\\) '}</MathJax>
                    <span>.</span>
                  </p>
                  <Divider></Divider>
                  <h3>Parameter Guide {'&'} Return Profile Summary</h3>
                  <p>
                    {
                      rules.find((x) => x.updateRuleName == 'AntiMomentum')
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
