import { Col, Row, Radio, Divider, Form } from 'antd';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectAvailableUpdateRules } from '../../simulationRunConfiguration/simulationRunConfigurationSlice';
import { TrainingResult } from '../docModel';
import { Eli5 } from '../../shared';
import styles from './updateRules.module.css';
import sharedStyles from '../documentation.module.css';

export interface Marker {
  enabled: boolean;
}

export interface SeriesConfig {
  xKey: string;
  yKey: string;
  yName: string;
  data: TrainingStepResult[];
  marker: Marker;
}

export interface TrainingStepResult {
  step: number;
  objective: number;
}

export interface Success {
  data: TrainingResult;
}
export function MomentumUpdateRule() {
  const [eli5, setEli5] = useState('ELI5');
  const rules = useAppSelector(selectAvailableUpdateRules);

  return (
    <div>
      <MathJaxContext>
        <Row>
          <Col span={1}></Col>
          <Col className={styles.containerPad10} span={23}>
            <Row>
              <Col span={24}>
                <h1>QuantAMM Update Rule: Momentum</h1>
              </Col>
              <Col span={24}>
                <Form.Item className={sharedStyles.formItemTop5}>
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
              <div hidden={eli5 !== 'ELI5'}>
                <Row>
                  <Col span={8}>
                      <img
                        loading="lazy"
                        src={'/documentation/vanilla_momentum.svg'}
                        className={styles.imagePadRight5Top15}
                      />
                  </Col>
                  <Col span={16}>
                    <Eli5 strategy="MOMENTUM" />
                  </Col>
                </Row>
              </div>
              <div hidden={eli5 === 'ELI5'}>
                <Col span={24}>
                  <h3>Summary</h3>
                  <p>
                    Under momentum updating, the weights change in proportion to
                    the gradient of prices, and in inverse proportional to the
                    prices themselves.
                  </p>
                  <h3>How it works</h3>
                  <p>
                    <span>At each step we update</span>
                    <MathJax inline>{' \\(\\mathbf{w}(t)\\) '}</MathJax>
                    <span>with the update rule</span>
                    <MathJax>
                      {
                        ' \\[\\mathbf{w}(t) = \\mathbf{w}({t-1}) + \\kappa \\cdot \\left(\\frac{1}{{\\mathbf{p}}(t)}\\frac{\\partial \\mathbf{p}(t)}{\\partial t} - \\ell_{\\mathbf{p}(t)}\\right).\\] '
                      }
                    </MathJax>
                    <span>
                      κ is a chosen, fixed, parameter that tunes how quickly,
                      how aggressively, the pool will change its weights in
                      light of the signal it receives. Division is performed
                      elementwise, and
                    </span>
                    <MathJax>
                      {
                        ' \\[\\ell_{\\mathbf{p}(t)} = \\sum_{i=1}^N \\left(\\frac{1}{{\\mathbf{p}}(t)}\\right)_i \\left(\\frac{\\partial \\mathbf{p}(t)}{\\partial t}\\right)_i\\] '
                      }
                    </MathJax>
                    <span>so that the vector change in portfolio weights,</span>
                    <MathJax inline>
                      {' \\(\\mathbf{w}(t) - \\mathbf{w}({t-1})\\), '}
                    </MathJax>
                    <span>
                      has entries that sum to 0. This is in-keeping with the
                      requirements for weights, as discussed above: if the
                      weights summed to one before this update, they will also
                      sum to one after this update.
                    </span>
                  </p>
                  <p>
                    <span>The dependence of performance on</span>
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
                      rules.find((x) => x.updateRuleName === 'Momentum')
                        ?.updateRuleResultProfileSummary
                    }
                  </p>
                </Col>
              </div>
            </Row>
          </Col>
        </Row>
      </MathJaxContext>
    </div>
  );
}
