import { Col, Row } from 'antd';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Fade } from 'react-awesome-reveal';
import sharedStyles from '../documentation.module.css';

export function PriceGradientEstimation() {
  return (
    <MathJaxContext>
      <Row>
        <Col span={4}></Col>
        <Col span={16}>
          <Row className={sharedStyles.pad20}>
            <Col span={24}>
              <span>
                <h2>
                  Oracle Gradient Estimation: it&apos;s the change in the signal
                  that matters!
                </h2>
              </span>
            </Col>
            <Col span={24}>
              <Fade>
                <p>
                  <span>
                    Knowing, in isolation, that a signal takes a particular
                    value at the present moment is not necessarily useful for
                    making a decision based on that signal. It is often by
                    knowing how the current signal compares to previous values,
                    on some chosen timescale, that enables us to make use of a
                    signal. This naturally means that in building update rules
                    (the mathematical rules for how a pool&apos;s allocation
                    between assets changes over time) we need a gradient
                    operator, to tell us by how much a market signal has
                    changed. The signals available to us are those provided by
                    oracles, so a key part of QuantAMM is finding a workable
                    method for finding the gradients of oracles. As well as
                    giving us useful, usable, results, we want a method that is
                    sufficiently computationally cheap that it can be done
                    on-chain.
                  </span>
                </p>
                <p>
                  <span>
                    One could do the simplest possible thing and calculate the
                    gradient as ‘rise-over-run‘, taking the difference between
                    the value of an oracle now and that some short time ago.
                    There is too much (highly structured) noise in financial
                    time series for this to work. (In fact, in many mathematical
                    models of finanical time series they do not even have a
                    well-defined gradient that can be found as an infinitesitmal
                    rise-over-run calculation: in other words these signals are
                    not viewed as being differentiable.) In crude terms, there
                    are often individual ‘spiky’ movements in the market data
                    and we do not want to over-fit our changes in our portfolio
                    to these transitory movements.
                  </span>
                </p>
                <p>
                  <span>
                    We want a smooth estimator of the oracle gradient, less
                    impacted by very short term deviations. We are now viewing
                    the problem as one of statistical estimation, which we will
                    see will end up giving us tools to to tune the effective
                    temporal ‘memory‘ of estimated the gradient.
                  </span>
                </p>
                <p>
                  <span>
                    The most popular (and important) oracles provide the prices
                    of tokens (in some chosen numeraire). This fits with the
                    prime importance of prices as information. Thus, to ground
                    our discussion, we will focus mostly here on price oracles,
                    and we denote these provided prices
                  </span>
                  <MathJax inline>{'\\(\\,\\mathbf{p}(t)\\)'}</MathJax>
                  <span>
                    , though all of these ideas apply immediately to any oracle
                    that provides a signal (of volume, say, or volatility).
                  </span>
                </p>
                <p>
                  <span>So here we are interested in obtaining</span>
                  <MathJax inline>
                    {' \\(\\frac{\\partial \\mathbf{p}(t)}{\\partial t}\\) '}
                  </MathJax>
                  <span>
                    (with an appropriate amount of temporal smoothing for our
                    purposes). We are interested in market movements unfolding
                    over the order of hours, days and weeks, not over fractions
                    of a second. These sorts of timescale are more natural for
                    QuantAMM to operate on, given the two-sided nature it has as
                    a DEX, being both a token exchange and a portfolio manager.
                  </span>
                </p>
                <span>
                  <h3>How to perform the estimation</h3>
                </span>
                <p>
                  <span>
                    We thus seek a way to compute an appropriate estimate of the
                    gradient
                  </span>
                  <MathJax inline>
                    {' \\(\\frac{\\partial \\mathbf{p}(t)}{\\partial t}\\)'}
                  </MathJax>
                  <span>
                    , cheaply (in terms of gas) and on-chain, given that we have
                    access to
                  </span>
                  <MathJax inline>{' \\(\\mathbf{p}(t)\\,\\)'}</MathJax>
                  <span>itself at some temporal resolution.</span>
                </p>
                <p>
                  Viewing this as an estimation problem, we could take a window
                  of recent data points and perform linear regression on them;
                  that is, draw a line-of-best-fit through them. This is better,
                  as now we are trying to determine trends, but still we have
                  problems. Firstly, this approach pays undue attention to old
                  prices: when estimating the current price gradient we care
                  much more about very recent prices than we care about prices
                  further back in time. Secondly, re-calculating the gradient of
                  the line-of-best-fit is expensive. Better, therefore, is to
                  use each new value of price data to update our previous
                  estimate of the gradient of the line-of-best-fit, performing
                  an ‘online update’ where old data slowly gets washed-out from
                  having any effect on the current estimate.
                </p>
                <p>
                  <span>
                    To solve these problems, we propose a form of
                    exponentially-weighted online least-squares regression to
                    learn and update an estimate of
                  </span>
                  <MathJax inline>
                    {' \\(\\frac{\\partial \\mathbf{p}(t)}{\\partial t}\\)'}
                  </MathJax>
                  <span>, which we denote</span>
                  <MathJax inline>{' \\(\\beta(t)\\)'}</MathJax>
                  <span>
                    . That this is an exponentially-decaying estimator means
                    that we have a particular time-scale for our memory of price
                    movements, allowing us to more easily adapt to changes in
                    market dynamics. With a decay parameter λ, the resulting
                    update equations are
                  </span>
                </p>
                <MathJax>
                  {
                    ' \\[\\overline{\\mathbf{p}}({t}) =\\overline{\\mathbf{p}}({t-1}) + \\left(1-\\lambda\\right)\\left({\\mathbf{p}(t) - \\overline{\\mathbf{p}}({t-1})}\\right)\\]'
                  }
                </MathJax>
                <MathJax>
                  {
                    ' \\[\\mathbf{a}(t) =\\lambda \\mathbf{a}({t-1}) + \\frac{\\mathbf{p}(t) - \\overline{\\mathbf{p}}({t})}{1-\\lambda}\\]'
                  }
                </MathJax>
                <MathJax>
                  {
                    ' \\[\\mathbf{\\beta}(t) =\\frac{\\left(1-\\lambda\\right)^3}{\\lambda} \\mathbf{a}(t)\\]'
                  }
                </MathJax>
                <p>
                  <span>where</span>
                  <MathJax inline>
                    {' \\(\\overline{\\mathbf{p}}({t})\\) '}
                  </MathJax>
                  <span>
                    is a running exponentially-weighted moving average of the N
                    tokens&apos; prices and
                  </span>
                  <MathJax inline>{' \\(\\mathbf{a}(t)\\) '}</MathJax>
                  <span>
                    is an intermediate state variable that is a constant ratio{' '}
                  </span>
                  <MathJax inline>
                    {' \\(\\frac{\\left(1-\\lambda\\right)^3}{\\lambda}\\) '}
                  </MathJax>
                  <span>from the current estimate of the price gradient </span>
                  <MathJax inline>{' \\(\\mathbf{\\beta}(t)\\). '}</MathJax>
                  <span>
                    We give our derivations in the technical appendix of the
                    whitepaper. The effective memory of this procedure is
                  </span>
                  <MathJax inline>
                    {
                      ' \\(t_{\\mathrm{mem}}\\approx\\frac{(1+\\lambda)^3}{1-\\lambda^2}\\) '
                    }
                  </MathJax>
                  <span>
                    . In this simulator we model the system as getting new price
                    information every hour. In this case one could set
                  </span>
                  <MathJax inline>{' \\(\\lambda=0.95\\) '}</MathJax>
                  <span>so that</span>
                  <MathJax inline>
                    {' \\(t_{\\mathrm{mem}}\\approx1.5\\,\\mathrm{days}.\\) '}
                  </MathJax>
                </p>
                <p>
                  <span>Often we use </span>
                  <MathJax inline>{' \\(t_{\\mathrm{mem}}\\) '}</MathJax>
                  <span>to parameterise update rules, rather than </span>
                  <MathJax inline>{' \\(\\lambda\\). '}</MathJax>
                  <span>
                    {' '}
                    directly, as it is much easier to think in terms of time
                    durations than decay constants. See the whitepaper for a
                    detailed derivation of the above. Finally, often it makes
                    sense for the time-gradient of an oracle to be scaled by the
                    value of that oracle; knowing that prices have doubled or
                    halved is more important than knowing they have changed by
                    some absolute quantity. We care about ratios of changes, not
                    absolute changes. As
                  </span>
                  <MathJax inline>
                    {
                      ' \\(\\frac{1}{p(t)}\\frac{\\partial p(t)}{\\partial t} = \\frac{\\partial \\log p(t)}{\\partial t}\\) '
                    }
                  </MathJax>
                  <span>
                    we can see that by doing this scaling we get the
                    time-gradient of the logarithm of the prices.
                  </span>
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
