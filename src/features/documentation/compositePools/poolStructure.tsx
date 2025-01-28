import { Col, Row } from 'antd';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

export function PoolStructure() {
  return (
    <Row>
      <MathJaxContext>
        <Col span={4}></Col>
        <Col style={{ padding: 10 }} span={16}>
          <h3>Basic metapool structure</h3>
          <p>
            <span>
              Recall that a QuantAMM pool is determined by a finite set
            </span>
            <MathJax inline>
              {' \\(\\mathcal{T} = \\{i,j,\\dots\\}\\) '}
            </MathJax>
            <span> of tokens, a T-indexed vector</span>
            <MathJax inline>
              {' \\(w(t) = \\{w_i\\}_{i:\\mathcal{T}}\\) '}
            </MathJax>
            <span>representing the weights, and a T-indexed vector</span>
            <MathJax inline>
              {' \\(R(t) = \\{R_i\\}_{i:\\mathcal{T}}\\) '}
            </MathJax>
            <span>representing the reserves, such that</span>
            <MathJax inline>{' \\(\\sum_{i:\\mathcal{T}} w_i = 1\\).'}</MathJax>
          </p>
          <p>
            <span>
              This information is sufficient to determine the pool value
            </span>
            <MathJax inline>{' \\(k(t)\\) '}</MathJax>
            <span>according to the trading function </span>
            <MathJax>
              {
                '\\[\\prod_{i=1}^N R_i^{w_i(t)}= k(t), \\quad\\mathrm{where\\,} \\sum_{i=1}^N w_i(t) = 1, \\,\\,\\mathrm{and\\,\\,} \\forall i\\,\\, 0\\leq w_i(t)<1.\\]'
              }
            </MathJax>
            <span> Throughout the metapool section, we will write</span>
            <MathJax inline>{' \\(\\mathcal{P}\\) '}</MathJax>
            <span>to indicate the tuple</span>
            <MathJax inline>{' \\((\\mathcal{T}, w, R)\\) '}</MathJax>
            <span>defining a pool.</span>
          </p>
          <h3>Subpools</h3>
          <p>
            <span>Given a pool</span>
            <MathJax inline>{' \\(\\mathcal{P}\\)'}</MathJax>
            <span>, an investor may wish to invest only in a subset</span>
            <MathJax inline>{' \\(U\\subset \\mathcal{T}\\) '}</MathJax>
            <span>
              of its tokens, while otherwise benefiting from its trading volume
              and weights. In order to do so, the investor can invest in the
              subpool
            </span>
            <MathJax inline>{' \\(\\mathcal{P}^{(U)}\\) '}</MathJax>
            <span>defined as follows. Its set of tokens is of course</span>
            <MathJax inline>{' \\(U\\)'}</MathJax>
            <span>, and the reserves</span>
            <MathJax inline>{' \\(R^{(U)}_i\\) '}</MathJax>
            <span>are just the corresponding reserves</span>
            <MathJax inline>
              {' \\(R_i\\ \\mathrm{in}\\ \\mathcal{P}\\) '}
            </MathJax>
            <span>, for </span>
            <MathJax inline>{' \\(i\\ \\mathrm{in}\\ U\\) '}</MathJax>
            <span>. Then the subpool weights</span>
            <MathJax inline>{' \\(w^U_i\\) '}</MathJax>
            <span>are given by </span>
            <MathJax inline>{' \\(w^U_i = w_i/\\sum_{i:U}w_i\\) '}</MathJax>
            <span>, and the pool value is</span>
            <MathJax>
              {
                '\\[k^{(U)} = \\frac{\\sum_{i:U} w_i}{\\prod_{j:\\mathcal{T}\\setminus U} R_j^{w_j}}\\]'
              }
            </MathJax>
            <span>where</span>
            <MathJax inline>{' \\(j\\) '}</MathJax>
            <span>ranges over the set </span>
            <MathJax inline>{' \\(\\mathcal{T}\\setminus U\\) '}</MathJax>
            <span>of tokens not in </span>
            <MathJax inline>{' \\(U\\)'}</MathJax>
          </p>
        </Col>
        <Col span={4}></Col>
      </MathJaxContext>
    </Row>
  );
}
