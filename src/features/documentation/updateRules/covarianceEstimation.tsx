import { Col, Row } from 'antd';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Fade } from 'react-awesome-reveal';
import styles from './updateRules.module.css';

export function CoVarianceEstimation() {
  return (
    <MathJaxContext>
      <Row>
        <Col span={4}></Col>
        <Col span={16}>
          <Row className={styles.rowPad20}>
            <Col span={24}>
              <span>
                <h2>Oracle Covariance, Variance and Precision Estimation</h2>
              </span>
            </Col>
            <Col span={24}>
              <Fade>
                <p>
                  <span>
                    Some update rules need access to the variance of an oracle
                    or the covariance between oracles. For example, any update
                    rule that wants to use Markovitz/Mean-Variance portfolio
                    management or related ideas will need them. Here we are
                    going to describe how QuantAMM can produce on-chain
                    estimates of the covariance matrix for a set of oracles
                    (likely, oracles that quote prices) and also separately the
                    inverse of the covariance matrix, the precision matrix.
                    (Calculating the precision matrix as its own quantity makes
                    sense for us, rather than obtaining it as the inverse of the
                    covariance matrix, as it is not appealing to have to invert
                    a matrix on-chain!) We can use a set of mathematical methods
                    very similar to those used to calculate our smoothed,
                    exponentially-decaying, estimator of the gradient of a
                    signal to calculate these quantities. Note that often one
                    wants not the covariance (nor precision) of raw prices, but
                    instead the covariance (and precision) of returns.
                  </span>
                </p>
                <h3>Covariance estimation</h3>
                <p>
                  Much as for the orcale gradient estimator, we want to pay more
                  attention to recent data points than old datapoints. As we
                  want to be able to run this estimator cheaply on-chain, we
                  also want to be an online estimator where we use new
                  information to update our running estimate of the
                  covariance/precision matrix. Following a substantially-similar
                  derivation to that for the oracle gradient estimator (see the
                  whitepaper for more detail), we get these update equations for
                  a covariance matrix for a set of oracles.
                </p>
                <MathJax>
                  {
                    ' \\[\\overline{\\mathbf{x}}({t}) =\\overline{\\mathbf{x}}_{t-1} + \\left(1-\\lambda\\right)\\left({\\mathbf{x}_t - \\overline{\\mathbf{x}}_{t-1}}\\right)\\]'
                  }
                </MathJax>
                <MathJax>
                  {
                    ' \\[\\mathbf{A}_{t} = \\lambda\\mathbf{A}_{t-1} + (\\mathbf{x}_t - \\overline{\\mathbf{x}}_{t-1})(\\mathbf{x}_t - \\overline{\\mathbf{x}}_{t})^top \\]'
                  }
                </MathJax>
                <MathJax>
                  {
                    ' \\[\\mathbf{\\Sigma}_t=\\left(1-\\lambda\\right)\\mathbf{A}_{t}\\]'
                  }
                </MathJax>
                <p>
                  <span>where division is performed elementwise, </span>
                  <MathJax inline>
                    {' \\(\\overline{\\mathbf{x}}_{t}\\) '}
                  </MathJax>
                  <span>
                    is a running exponentially-weighted moving average of the N
                    oracles we are calling and
                  </span>
                  <MathJax inline>{' \\(\\mathbf{A}_{t}\\) '}</MathJax>
                  <span>
                    is an intermediate state variable that is a constant ratio,
                  </span>
                  <MathJax inline>
                    {' \\(\\left(1-\\lambda\\right)\\) '}
                  </MathJax>
                  <span>
                    from the current estimate of the covariance matrix,
                  </span>
                  <MathJax inline>{' \\(\\mathbf{\\Sigma}_t\\) '}</MathJax>
                  <span> and </span>
                  <MathJax inline>{' \\(\\lambda\\) '}</MathJax>
                  <span>
                    {' '}
                    is the exponential weighting factor. We give our derivations
                    in the technical appendix of the whitepaper.
                  </span>
                </p>
                <h3>Precision estimation</h3>
                <p>
                  <span>
                    We can use the Sherman-Morrison formula to derive a similar
                    on-line estimator for the precision matrix, avoiding the
                    need to perform a matrix inversion. The update equations are
                  </span>
                  <MathJax>
                    {
                      ' \\[\\overline{\\mathbf{x}}({t}) =\\overline{\\mathbf{x}}_{t-1} + \\left(1-\\lambda\\right)\\left({\\mathbf{x}_t - \\overline{\\mathbf{x}}_{t-1}}\\right)\\]'
                    }
                  </MathJax>
                  <MathJax>
                    {
                      ' \\[\\mathbf{S}_{t} = \\frac{1}{\\lambda} \\mathbf{S}_{t-1} \\left(\\mathbf{I} - \\frac{\\left(\\mathbf{x}_t - \\overline{\\mathbf{x}}_{t-1}\\right)\\left(\\mathbf{x}_t - \\overline{\\mathbf{x}}_t\\right)^\\top\\mathbf{S}_{t-1}}{\\lambda + \\left(\\mathbf{x_t} - \\overline{\\mathbf{x}}_t\\right)^\\top \\mathbf{S}_{t-1}\\left(\\mathbf{x}_t - \\overline{\\mathbf{x}}_{t-1}\\right)}\\right)\\]'
                    }
                  </MathJax>
                  <MathJax>
                    {
                      ' \\[\\mathbf{\\Sigma}^{-1}_t=\\frac{\\mathbf{S}_{t}}{\\left(1-\\lambda\\right)}\\]'
                    }
                  </MathJax>
                  <p>
                    <span>where division is performed elementwise, </span>
                    <MathJax inline>
                      {' \\(\\overline{\\mathbf{x}}_{t}\\) '}
                    </MathJax>
                    <span>
                      is a running exponentially-weighted moving average of the
                      N oracles we are calling and
                    </span>
                    <MathJax inline>{' \\(\\mathbf{S}_{t}\\) '}</MathJax>
                    <span>
                      is an intermediate state variable that is a constant
                      ratio,
                    </span>
                    <MathJax inline>
                      {' \\(\\left(1-\\lambda\\right)\\) '}
                    </MathJax>
                    <span>
                      from the current estimate of the precision matrix,
                    </span>
                    <MathJax inline>{' \\(\\mathbf{\\Sigma}_t\\) '}</MathJax>
                    <span>
                      . We give our derivations in the technical appendix of the
                      whitepaper.
                    </span>
                  </p>
                  <p>
                    <span>
                      Similar to oracle gradients, we use the memory length{' '}
                    </span>
                    <MathJax inline>{' \\(t_{\\mathrm{mem}}\\) '}</MathJax>
                    <span>
                      of this method to parameterise update rules that use these
                      results, rather than{' '}
                    </span>
                    <MathJax inline>{' \\(\\lambda\\) '}</MathJax>
                    <span>
                      directly, as it is much easier to think in terms of time
                      durations than decay constants.
                    </span>
                  </p>
                </p>
              </Fade>
            </Col>
          </Row>
        </Col>
        <Col span={4}></Col>
      </Row>
    </MathJaxContext>
  );
}
