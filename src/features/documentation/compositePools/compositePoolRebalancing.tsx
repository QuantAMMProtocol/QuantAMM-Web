import { Col, Row } from 'antd';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

export function CompositePoolRebalancing() {
  return (
    <Row>
      <MathJaxContext>
        <Col span={4}></Col>
        <Col style={{ padding: 10 }} span={16}>
          <h3>Composite Pool Rebalancing</h3>
          <p>
            <span>
              A general weighted sum metapool can equivalently be thought of as
              a ‘pool of pools’: a pool constructed from the liquidity tokens of
              the underlying pools
            </span>
            <MathJax inline>{' \\(\\mathcal{P}^{(i)}\\) '}</MathJax>
            <span>. That is, given a collection of pools</span>
            <MathJax inline>{' \\(\\{\\mathcal{P}^{(i)}\\}_{i:I}\\) '}</MathJax>
            <span>and corresponding weights</span>
            <MathJax inline>{' \\(\\omega_i\\) '}</MathJax>
            <span>
              , we can form a new pool given by a weighted (geometric) sum of
              their underlying assets:
            </span>
          </p>
          <MathJax>
            {
              ' \\[\\prod_{i:I} R_{\\mathcal{P}^{(j)}}^{\\omega_j} = \\prod_{i:I} \\prod_{j:\\mathcal{T}^{(i)}} R_{ij}^{\\omega_i w_{ij}} = \\prod_{i:I} {k^{(i)}}^{\\omega_i} = k\\] '
            }
          </MathJax>
          <p>
            <span>where the metapool weights </span>
            <MathJax inline>{' \\(\\omega_i\\) '}</MathJax>
            <span>satisfy the normalization rule that</span>
            <MathJax inline>{' \\(\\sum_{i:I} \\omega_i = 1\\). '}</MathJax>
            <span>
              This invariant is clearly equal to the invariant of the weighted
              sum metapool
            </span>
            <MathJax inline>
              {' \\(\\sum_{i:I} \\omega_i \\mathcal{P}^{(i)}\\). '}
            </MathJax>
            <span>Next, observe that we can think of the pool value</span>
            <MathJax inline>{' \\(k^{(i)}\\) '}</MathJax>
            <span>as an unscaled ‘price’ for the pool</span>
            <MathJax inline>{' \\(\\mathcal{P}^{(i)}\\) '}</MathJax>
            <span>
              , by asking “how much would it cost to buy one unit of each of the
              pool’s reserves?”. The answer to this question is given by the sum
            </span>
            <MathJax inline>
              {
                ' \\(\\sum_{j:\\mathcal{T}^{(i)}} R_{j}\\, p^{\\mathrm{quantAMM}}_j\\) '
              }
            </MathJax>
            <span>, which is easily seen to be equal to the value</span>
            <MathJax inline>{' \\(k^{(i)}\\). '}</MathJax>
            <span>
              This means that we can use the values of the underlying pools in a
              metapool as price signals, and update the meta-weights
            </span>
            <MathJax inline>{' \\(w(i)\\) '}</MathJax>
            <span>
              {' '}
              accordingly, using the same algorithm as for the assets in the
              underlying pools.{' '}
            </span>
            <span>
              In practice, to ensure that pools values are comparable on a
              common scale, we require each pool to contain ROBO.{' '}
            </span>
          </p>
          <p>
            This is the source of the automated portfolio management abilities
            of QuantAMM.
          </p>
        </Col>
        <Col span={4}></Col>
      </MathJaxContext>
    </Row>
  );
}
