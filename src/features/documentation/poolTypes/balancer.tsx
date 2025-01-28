import { Col, Row } from 'antd';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Fade } from 'react-awesome-reveal';

export function BalancerPoolDescription() {
  return (
    <Row>
      <Col span={4}></Col>
      <Col span={16}>
        <Row>
          <MathJaxContext>
            <Col span={24}>
              <h2>Balancer&apos;s fixed trading function</h2>
            </Col>
            <Col span={24}>
              <Fade>
                <p>
                  Balancer extends Uniswap by having an arbitrary number of
                  tokens in a given basket, and by weighting these tokens in the
                  trading function. The Balancer trading function is
                </p>
                <MathJax>
                  {
                    '\\[\\prod_{i=1}^{N} R_i^{w_i}=k, \\quad\\mathrm{where\\,} \\sum_{i=1}^N w_i = 1 \\,\\,\\mathrm{and\\,\\,} \\forall i\\,\\, 0\\leq w_i<1.\\]'
                  }
                </MathJax>
                <p>
                  <span>Here we have a set of tokens </span>
                  <MathJax inline>
                    {'\\(\\mathcal{T}, |\\mathcal{T}|=N,\\)'}
                  </MathJax>
                  <span> present in the pool and</span>
                  <MathJax inline>{' \\(w_i\\) '}</MathJax>
                  <span>is the weighting given to each token. </span>
                  <MathJax inline>{' \\( R =\\{R_i\\}\\) '}</MathJax>{' '}
                  <span>
                    {' '}
                    is the vector of currently-held reserves of each token. The
                    motivation here is that the weights
                  </span>
                  <MathJax inline>{' \\( \\mathbf{w} =\\{w_i\\}\\) '}</MathJax>
                  <span>
                    control how much value is stored in each token. For example,
                    if the weighting is uniform,{' '}
                  </span>
                  <MathJax inline>{' \\(w_i=\\frac{1}{N}\\) '}</MathJax>
                  <span>
                    {' '}
                    , an equal amount of value will be stored in each token. (We
                    sometimes write{' '}
                  </span>
                  <MathJax inline>{' \\(\\mathcal{P}\\) '}</MathJax>
                  <span> to denote the tuple </span>
                  <MathJax inline>
                    {' \\((\\mathcal{T}, \\mathbf{w}, R)\\) '}
                  </MathJax>
                  <span> defining a pool.) </span>
                </p>
                <p>
                  There are a variety of reasons one might wish to have, for a
                  given set of tokens, particular
                  <MathJax inline>{' \\(w_i\\) '}</MathJax>
                  values be larger or smaller than an agnostic
                  <MathJax inline>{' \\(\\frac{1}{N}\\) '}</MathJax>. One key
                  reason is impermanent loss (also known as divergence loss)
                  where price movements away from those when a pool was started
                  lead to a loss of value for liquidity providers. Having a
                  smaller weight on a given token makes it cause relatively less
                  impermanent loss, as less of the liquidity in the pool is
                  allocated to that token. However, since the portfolio weights
                  must sum to <MathJax inline>{' \\(1\\) '}</MathJax>, this
                  makes for a relatively greater risk of impermanent loss on at
                  least one other token in the portfolio. This points to the
                  downsides of the hard-coded portfolio weights.
                </p>
              </Fade>
            </Col>
          </MathJaxContext>
        </Row>
      </Col>
      <Col span={4}></Col>
    </Row>
  );
}
