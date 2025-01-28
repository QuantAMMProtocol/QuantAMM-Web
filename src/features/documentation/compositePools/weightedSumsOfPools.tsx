import { Col, Row } from 'antd';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

export function WeightedSumsOfPools() {
  return (
    <Row>
      <MathJaxContext>
        <Col span={4}></Col>
        <Col style={{ padding: 10 }} span={16}>
          <h3>Sums and weighted sums of pools</h3>
          <p>
            <span>
              The next example of a metapool is obtained by forming the sum of
              two pools{' '}
            </span>
            <MathJax inline>{' \\(\\mathcal{P}^{(1)}\\) '}</MathJax>
            <span>and</span>
            <MathJax inline>{' \\(\\mathcal{P}^{(2)}\\) '}</MathJax>
            <span>
              , allowing an investor to distribute liquidity across the assets
              underlying the pools, without having to create a new pool, or
              perform the distribution manually. In combination with subpools,
              this allows investors to invest in complex portfolios while
              benefiting from the underlying trade volume.
            </span>
          </p>
          <p>
            <span>To construct the sum</span>
            <MathJax inline>
              {' \\(\\mathcal{P}^{(1)}+\\mathcal{P}^{(2)}\\) '}
            </MathJax>
            <span>, we form the disjoint union</span>
            <MathJax inline>
              {' \\(\\mathcal{T}^{(1)}+\\mathcal{T}^{(2)}\\) '}
            </MathJax>
            <span>of the sets of tokens.</span>
          </p>
          <p>
            <span>
              The reserves are just the reserves of the underlying pools, and
              the weights{' '}
            </span>
            <MathJax inline>{' \\(w^{(1+2)}_i\\) '}</MathJax>
            <span>are given by</span>
            <MathJax inline>{' \\(w_i/2\\) '}</MathJax>
            <span>, where</span>
            <MathJax inline>{' \\(w_i\\) '}</MathJax>
            <span>is the underlying weight.</span>
          </p>
          <p>
            <span>A simple calculation then shows the value</span>
            <MathJax inline>{' \\(k^{(1+2)}\\) '}</MathJax>
            <span>
              of the sum pool to be given by product of the square roots
            </span>
            <MathJax inline>{' \\(\\sqrt{k^{(1)}}\\sqrt{k^{(2)}}\\) '}</MathJax>
            <span>of the values of the underlying pools.</span>
          </p>
          <p>
            <span>
              The operation of summing pools naturally extends from this binary
              case to sums of arbitrary size. That is to say, given a collection
              of pools
            </span>
            <MathJax inline>
              {' \\(\\{\\mathcal{P}^{(i)}\\}_{i:I}\\), '}
            </MathJax>
            <span>one can form the corresponding sum metapool</span>
            <MathJax inline>{' \\(\\sum_{i:I} \\mathcal{P}^{(i)}\\) '}</MathJax>
            <span>
              by forming the disjoint union of the corresponding sets of tokens
            </span>
            <MathJax inline>
              {' \\(\\sum_{i:I} \\mathcal{T}^{(i)}\\), '}
            </MathJax>
            <span>and rescaling the weights</span>
            <MathJax inline>{' \\(w^{(i)}_j\\) '}</MathJax>
            <span>by</span>
            <MathJax inline>{' \\(1/|I|\\), '}</MathJax>
            <span>where</span>
            <MathJax inline>{' \\(|I|\\) '}</MathJax>
            <span>is the size of the index set</span>
            <MathJax inline>{' \\(I.\\) '}</MathJax>
          </p>
          <p>
            <span>
              The notion of sum metapool extends further to a weighted sum,
              whereby each constituent pool
            </span>
            <MathJax inline>{' \\(\\mathcal{P}^{(i)}\\) '}</MathJax>
            <span>
              of a metapool is associated with a &apos;meta&apos; weight
            </span>
            <MathJax inline>{' \\(\\omega_i.\\) '}</MathJax>
          </p>
          <p>
            <span>We write the corresponding pool as</span>
            <MathJax inline>
              {' \\(\\sum_{i:I} \\ \\mathcal{P}^{(i)}\\), '}
            </MathJax>
            <span>and the meta weights</span>
            <MathJax inline>{' \\(\\omega_i\\) '}</MathJax>
            <span>
              are themselves constrained to sum to 1. The only difference from
              the &apos;uniform&apos; case of the preceding paragraph is that
              now the underlying weights are rescaled by
            </span>
            <MathJax inline>{' \\(\\omega_i\\), '}</MathJax>
            <span>rather than</span>
            <MathJax inline>{' \\(1/|I|.\\) '}</MathJax>
          </p>
          <h3>Quotient composite pools</h3>
          <p>
            <span>
              The principal operation by which we construct composite pools is
              the (weighted) sum of pools. Since this operation involves a
              disjoint union of the underlying sets of tokens, tokens in pool
            </span>
            <MathJax inline>{' \\(\\mathcal{P}^{(1)}\\) '}</MathJax>
            <span>are treated as distinct from the tokens in pool</span>
            <MathJax inline>{' \\(\\mathcal{P}^{(2)}\\) '}</MathJax>
            <span>
              , even when those pools have tokens in common and together
              constitute a metapool. In order to combine the reserves of these
              shared tokens, we need to &apos;quotient&apos; the metapool by an
              equivalence relation identifying them . Mathematically, this means
              constructing a true colimit as a coequalizer of a coproduct.
              Since, before quotienting, the reserves of the shared tokens have
              disjoint weights, when we perform this quotienting, we must not
              only sum up the reserves, but also adjust the weights accordingly.
            </span>
          </p>
          <p>
            <span>
              In general, we can quotient any pool by any equivalence
              relation-not just composite pools by token identity-and since it
              simplifies the mathematics, this is the setting we work with here.
              Suppose therefore that
            </span>
            <MathJax inline>{' \\(\\sim\\) '}</MathJax>
            <span>is an equivalence relation on a pool</span>
            <MathJax inline>{' \\(\\mathcal{P}\\) '}</MathJax>
            <span>and we wish to form the quotient pool</span>
            <MathJax inline>{' \\(\\mathcal{P}/\\sim.\\) '}</MathJax>
            <span>The set of tokens of</span>
            <MathJax inline>{' \\(\\mathcal{P}/\\sim\\) '}</MathJax>
            <span>is given by the quotient</span>
            <MathJax inline>{' \\(\\mathcal{T}/\\sim\\) '}</MathJax>
            <span>of the set</span>
            <MathJax inline>{' \\(\\mathcal{T}\\) '}</MathJax>
            <span>of tokens of</span>
            <MathJax inline>{' \\(\\mathcal{P}\\) '}</MathJax>
            <span>, whose elements are equivalence classes</span>
            <MathJax inline>{' \\([i]\\) '}</MathJax>
            <span>, such that two tokens</span>
            <MathJax inline>{' \\(j,k\\in\\mathcal{T}\\) '}</MathJax>
            <span>are elements of the same equivalence class</span>
            <MathJax inline>{' \\([i]\\) '}</MathJax>
            <span>if and only if</span>
            <MathJax inline>{' \\(j\\sim k\\) '}</MathJax>
            <span>according to the equivalence relation</span>
            <MathJax inline>{' \\(\\sim.\\) '}</MathJax>
            <span>The reserves</span>
            <MathJax inline>{' \\(\\sim\\) '}</MathJax>
            <span>of &apos;token&apos;</span>
            <MathJax inline>{' \\([i]\\) '}</MathJax>
            <span> in </span>
            <MathJax inline>{' \\(\\mathcal{P}/\\sim\\) '}</MathJax>
            <span>are given by the sum of the underlying reserves:</span>
            <MathJax inline>
              {' \\(\\tilde{R}_{[i]} = \\sum_{j\\in[i]} R_j.\\) '}
            </MathJax>
            <span>We then want to define new weights such that</span>
            <MathJax>
              {
                ' \\[{\\tilde{R}_{[i]}}^{\\tilde{w}_i} = \\Big(\\sum_{j\\in[i]} R_j\\Big)^{\\tilde{w}_i} = \\prod_{j\\in[i]} R_j^{w_j}.\\] '
              }
            </MathJax>
          </p>
          <p>
            <span>The weights</span>
            <MathJax inline>{' \\(\\tilde{w}_i\\) '}</MathJax>
            <span>, making these equalities true, are given by</span>
            <MathJax inline>
              {
                ' \\[\\tilde{w}_i = \\frac{\\sum_{j\\in [i]} w_j \\log R_j}{\\log \\tilde{R}_i}\\] '
              }
            </MathJax>
          </p>
          <p>
            <span>Note however that, in general,</span>
            <MathJax inline>{' \\(\\sum_i \\tilde{w}_i \\neq 1\\) '}</MathJax>
            <span>, and so we must rescale the weights by</span>
            <MathJax inline>
              {
                ' \\(\\tilde{w}_i \\mapsto \\tilde{w}_i/\\sum_i\\tilde{w}_i.\\) '
              }
            </MathJax>
            <span>This in turn introduces a corresponding rescaling of</span>
            <MathJax inline>{' \\(k\\) '}</MathJax>
            <span>to</span>
            <MathJax inline>
              {' \\(\\tilde{k} = k^{(1/\\sum_i\\tilde{w}_i)}\\) '}
            </MathJax>
            <span>, but this is not a problem, since the underlying value</span>
            <MathJax inline>{' \\(k\\) '}</MathJax>
            <span>
              is unchanged by these operations, and the quotient weights and
              reserves are fully determined by the underlying weights and
              reserves. Moreover, this means that all such quotienting can be
              performed in the front end, and hence off-chain, thereby saving on
              gas costs.
            </span>
          </p>
        </Col>
        <Col span={4}></Col>
      </MathJaxContext>
    </Row>
  );
}
