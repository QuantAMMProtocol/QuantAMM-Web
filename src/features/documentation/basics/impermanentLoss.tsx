import { Col, Row } from 'antd';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Fade } from 'react-awesome-reveal';
import sharedStyles from '../documentation.module.css';

export function ImpermanentLoss() {
  return (
    <MathJaxContext>
      <Row>
        <Col span={4}></Col>
        <Col span={16}>
          <Row className={sharedStyles.pad20}>
            <Col span={24}>
              <span>
                <h2>Fixed Weight DEXes must suffer Impermanent Loss</h2>
              </span>
            </Col>
            <Col span={24}>
              <Fade>
                <p>
                  <span>
                    On existing DEXes, including Uniswap and Balancer, liquidity
                    providers suffer from impermanent (a.k.a. divergence) loss:
                    any change in the ratios of the market prices of tokens in a
                    basket leads to that pool holding less value than when the
                    pool was capitalised. In other words, if the market prices
                    change in ratio the liquidity providers (in the absence of
                    fees) are guaranteed to be outperformed by those who simply
                    held their initial capital.
                  </span>
                </p>
                <p>
                  <span>
                    Intuitively, we can consider impermanent loss as simply the
                    cost paid by LPs for their holdings to be in proportion to
                    the desired weights of their portfolio, combined with the
                    fact that their desired portfolio has a constant allocation
                    over time (that is,
                  </span>
                  <MathJax inline>{'\\(\\mathbf{w}\\) '}</MathJax>
                  <span>
                    is a constant). When we derive this mathematically, as we
                    will do momentarily, what we are really saying is that for
                    the combination of the costs paid to hold a desired
                    portfolio and that portfolio is fixed is guaranteed to give
                    a loss when implemented as a DEX. As we shall see when we
                    handle QuantAMM further down this page, when
                  </span>
                  <MathJax inline>{'\\(\\mathbf{w}\\) '}</MathJax>
                  <span>
                    can vary with time, no longer is a loss guaranteed. Indeed
                    it is possible to make a positive return by judicious choice
                    of the sequence of values
                  </span>
                  <MathJax inline>{' \\(\\mathbf{w}\\) '}</MathJax>
                  <span>takes.</span>
                </p>
                <span>
                  <h3>Mathematical Derivation of Impermanent Loss</h3>
                </span>
                <p>
                  <span>
                    We will assume that, at the initial moment, the quoted
                    prices of the pool match the market prices—the pool is, at
                    that moment, in equilibrium. Then, given a change in market
                    prices, arbitrageurs will trade with the pool until, again,
                    the quoted prices of the pool match the new market prices.
                    Performing this analysis gives us that the pool’s reserves
                    at a later time
                  </span>
                  <MathJax inline>{" \\(t'\\) "}</MathJax>
                  <span>are:</span>
                </p>
                <MathJax>
                  {
                    " \\[R(t') = R(t_0) \\frac{p(t_0)}{p(t')}\\prod_{i=1}^N \\left(\\frac{p_i(t')}{p_i(t_0)}\\right)^{w_i}\\] "
                  }
                </MathJax>
                <p>
                  <span>
                    where multiplication and division between vectors is
                    performed elementwise. See the technical appendix of the
                    whitepaper for the derivation. The value in a portfolio at a
                    given time
                  </span>
                  <MathJax inline>{' \\(t\\) '}</MathJax>
                  <span> is</span>
                  <MathJax inline>
                    {' \\(V(t) = p(t)\\cdot R(t)=\\sum_i^N p_i(t) R_i(t)\\) '}
                  </MathJax>
                  <span>. Thus we have that:</span>
                </p>
                <MathJax>
                  {
                    " \\[V(t') = \\sum_{i=1}^N p_i(t') R_i(t') = \\sum_{i=1}^N p_i(t') R_i(t_0) \\frac{p_i(t_0)}{ p_i(t')}\\prod_{k=1}^N \\left(\\frac{p_k(t')}{p_k(t_0)}\\right)^{w_k}=V(t_0)\\prod_{k=1}^N \\left(\\frac{p_k(t')}{p_k(t_0)}\\right)^{w_k}\\] "
                  }
                </MathJax>
                <p>
                  <span>for DEXes with fixed weights. If prices go from </span>
                  <MathJax inline>
                    {" \\(p(t_0) \\rightarrow p(t') \\rightarrow p(t'')\\) "}
                  </MathJax>
                  <span> we find that we can write </span>
                  <MathJax inline>{" \\(R(t'')\\) "}</MathJax>
                  <span> purely using the variables </span>
                  <MathJax inline>{" \\(p(t''),\\) "}</MathJax>
                  <MathJax inline>{' \\(p(t_0),\\) '}</MathJax>
                  <MathJax inline>{' \\(R(t_0)\\) '}</MathJax>
                  <span>. The terms involving </span>
                  <MathJax inline>{" \\(p(t'),\\) "}</MathJax>
                  <MathJax inline>{" \\(R(t')\\) "}</MathJax>
                  <span> end up cancelling out:</span>
                </p>
                <MathJax>
                  {
                    " \\[R(t'') = R(t_0) \\frac{p(t_0)}{p(t'')}\\prod_{i=1}^N \\left(\\frac{p_i(t'')}{p_i(t_0)}\\right)^{w_i}\\] "
                  }
                </MathJax>
                <p>
                  <span>
                    To get the impermanent loss equations, we now simply compare
                    the changes in the pool&apos;s value from
                  </span>
                  <MathJax inline>{" \\(t_0\\rightarrow t'\\) "}</MathJax>
                  <span>to the change in value in the initial reserves</span>
                  <MathJax inline>{' \\(R(t_0)\\). '}</MathJax>
                  <span>The value of a hold strategy is</span>
                  <MathJax inline>
                    {
                      ' \\(V_\\mathrm{hold}(t)=\\sum_{i=1}^N R_i(t_0) p_i(t)\\) '
                    }
                  </MathJax>
                  <span>so</span>
                </p>
                <MathJax>
                  {
                    " \\[V_\\mathrm{hold}(t') = \\sum_{i=1}^N R_i(t_0) p_i(t') = \\sum_{i=1}^N R_i(t_0) p_i(t') \\frac{p_i(t_0)}{p_i(t_0)} = V_\\mathrm{hold}(t_0) \\sum_{i=1}^N w_i \\frac{p_i(t')}{p_i(t_0)}\\] "
                  }
                </MathJax>
                <p>
                  <span>where we have used that</span>
                  <MathJax inline>
                    {' \\(w_i V(t_0) = R_i(t_0) p_i(t_0).\\) '}
                  </MathJax>
                  <span>Thus we have that </span>
                  <MathJax inline>{' \\(\\Delta V\\), '}</MathJax>
                  <span>
                    the proportional change in the value of the pool compared to
                    holding, is
                  </span>
                  <MathJax>
                    {
                      " \\[\\Delta V = \\frac{\\frac{V(t')}{V(t_0)}}{\\frac{V_\\mathrm{hold}(t')}{V_\\mathrm{hold}(t_0)}} -1 = \\frac{\\prod_{k=1}^N \\left(\\frac{p_k(t')}{p_k(t_0)}\\right)^{w_k}}{\\sum_{i=1}^N w_i \\frac{p_i(t')}{p_i(t_0)}} - 1\\]. "
                    }
                  </MathJax>
                </p>
                <p>
                  <span>This function&apos;s range is</span>
                  <MathJax inline>{' \\(\\leq 0\\), '}</MathJax>
                  <span>
                    due to the Weighted AM–GM inequality; in other words, for
                    any
                  </span>
                  <MathJax inline>
                    {" \\(p(t') \\neq p(t_0), \\Delta V < 0\\) "}
                  </MathJax>
                </p>
                <p>
                  <b>
                    This means liquidity providers on fixed-weight DEXes have
                    lost value compared to holding.
                  </b>
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
