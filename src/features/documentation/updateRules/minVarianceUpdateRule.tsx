import { Col, Row, Radio, Divider, Form } from 'antd';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectAvailableUpdateRules } from '../../simulationRunConfiguration/simulationRunConfigurationSlice';
import { Eli5 } from '../../shared';
import styles from './updateRules.module.css';
import sharedStyles from '../documentation.module.css';

export function MinVarianceUpdateRule() {
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
                <h1>QuantAMM Update Rule: Minimum Variance</h1>
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
              <Col span={24}>
                <div hidden={eli5 !== 'ELI5'}>
                  <Row>
                    <Col span={8}>
                      <img
                        loading="lazy"
                        src={'/documentation/minimum_variance.svg'}
                        className={styles.imagePadRight5Top15}
                      />
                    </Col>
                    <Col span={16}>
                      <Eli5 strategy="MIN_VARIANCE" />
                    </Col>
                  </Row>
                </div>
                <div hidden={eli5 === 'ELI5'}>
                  <h3>Summary</h3>
                  <p>
                    This rule uses a simple form of Mean-Variance Portfolio
                    Theory to build the minimum variance portfolio over of
                    selection of tokens.
                  </p>
                  <h3>How it works</h3>
                  <p>
                    <span>
                      Mean-Variance Portfolio Theory (MVPT) can be used to
                      construct a broad array of different portfolios. Here we
                      demonstrate one of the simplest, the mimimum variance
                      portfolio. This update rule, and others one can write down
                      that come from MVPT, are a little different to the other
                      update rules considered here: it does not have the form
                    </span>
                    <MathJax inline>
                      {
                        ' \\(\\mathbf{w}(t) = \\mathbf{w}(t-1)+\\mathbf{f}(\\mathbf{p}(t))\\), '
                      }
                    </MathJax>
                    <span>for some function </span>
                    <MathJax inline>{' \\(\\mathbf{f}(\\cdot)\\). '}</MathJax>
                    <span>
                      Instead it is an example of an update rule of the more
                      general form
                    </span>
                    <MathJax inline>
                      {
                        ' \\(\\mathbf{w}(t) = \\mathbf{g}(\\mathbf{w}(t-1), \\mathbf{p}(t))\\) '
                      }
                    </MathJax>
                    <span>
                      . This is because MVPT does not give us a series of
                      changes to our portfolio weights, as, for example, a
                      momentum rule does, but gives us the portfolio weight
                      vector itself directly.
                    </span>
                  </p>
                  <p>
                    <span>
                      Before we get to the minimum-variance portfolio itself,
                      first we will describe how to handle update rules that
                      naturally produce whole portfolio weight vectors rather
                      than weight changes. We do not want change from one weight
                      vector to another too briskly, so we apply exponential
                      smoothing over the sequence of given weight vectors. Given
                      a series of calculated weight vectors
                    </span>
                    <MathJax inline>{' \\(\\hat{\\mathbf{w}}(t)\\), '}</MathJax>
                    <span>
                      given perhaps by MVPT calculation or some other set of
                      mathematical tools, we can use for the pool weights a
                      smoothed version of these, so
                    </span>
                    <MathJax>
                      {
                        ' \\[\\mathbf{w}(t) = \\Lambda \\mathbf{w}({t-1}) + (1 - \\Lambda) \\hat{\\mathbf{w}}(t). \\] '
                      }
                    </MathJax>
                    <span> where </span>
                    <MathJax inline>{' \\(\\Lambda\\) '}</MathJax>
                    <span>
                      is our exponential smoothing parameter, analogous to that
                      used in smoother oracle gradient calculations. This mixing
                      process, much like an exponentially smoothed oracle
                      gradient, has an associated memory length, which we use to
                      parameterise a pool using this update rule as it is easier
                      to reason about than the rather abstract
                    </span>
                    <MathJax inline>{' \\(\\Lambda\\). '}</MathJax>
                  </p>
                  <p>
                    <span>With that handled, now let us turn to</span>
                    <MathJax inline>
                      {' \\(\\hat{\\mathbf{w}}^{\\mathrm{min-var}}(t)\\), '}
                    </MathJax>
                    <span>
                      the sequence of weights that give us the minimum variance
                      portfolio within MVPT. For simplicity we assume that
                      assets are uncorrelated with each other and have zero
                      average return. (These assumptions can be relaxed, for a
                      full derivation and more background on MVPT see the
                      whitepaper.) Given these assumptions the minimum-variance
                      weights are
                    </span>
                    <MathJax>
                      {
                        ' \\[\\hat{w}(t)_i = \\frac{\\frac{1}{\\Sigma}_i}{\\sum_{j=1}^N \\frac{1}{\\Sigma}_j}\\] '
                      }
                    </MathJax>
                    <span>where</span>
                    <MathJax inline>{' \\(\\frac{1}{\\Sigma}_i\\) '}</MathJax>
                    <span> is the inverse variance of the returns of the</span>
                    <MathJax inline>{' \\(i^{\\mathrm{th}}\\) '}</MathJax>
                    <span>
                      token in the pool. This inverse-variance estimation
                      process has its own memory length, which is used to
                      parameterise the pool.
                    </span>
                  </p>
                  <Divider></Divider>
                  <h3>Parameter Guide {'&'} Return Profile Summary</h3>
                  <p>
                    {
                      rules.find((x) => x.updateRuleName === 'Min Variance')
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
