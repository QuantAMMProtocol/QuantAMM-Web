import { Col, Row, Radio, Divider, Form } from 'antd';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectAvailableUpdateRules } from '../../simulationRunConfiguration/simulationRunConfigurationSlice';
import { Eli5 } from '../../shared';

interface DocProps {
  hideTitle?: boolean;
  hideImage?: boolean;
}

export function TruflationRegimeUpdateRule(props: DocProps) {
  const [eli5, setEli5] = useState('ELI5');
  const rules = useAppSelector(selectAvailableUpdateRules);

  const updateRuleProfileSummary =
    rules.find((x) => x.updateRuleName == 'Truflation Inflation Regime')
      ?.updateRuleResultProfileSummary ??
    rules.find((x) => x.updateRuleName == 'Truflation Regime Update Rule')
      ?.updateRuleResultProfileSummary;

  return (
    <div>
      <MathJaxContext>
        <Row>
          <Col span={1}></Col>
          <Col style={{ padding: 10 }} span={23}>
            <Row>
              <Col span={24}>
                <div hidden={props.hideTitle}>
                  <h1>QuantAMM Update Rule: Truflation Inflation Regime</h1>
                </div>
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
                    <Radio.Button value={'Quant'}>Quant</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ padding: 10 }}>
                <div hidden={eli5 != 'ELI5' || props.hideImage}>
                  <Row>
                    <Col span={8}>
                      <img
                        loading="lazy"
                        src={'/assets/truflation_bitcoin_mono.png'}
                        style={{
                          width: '100%',
                          paddingLeft: '10%',
                          paddingRight: '10%',
                          paddingBottom: '10%',
                        }}
                      />
                    </Col>
                    <Col span={16}>
                      <div style={{ marginTop: '20px' }}>
                        <Eli5 strategy="TRUFLATION_INFLATION_REGIME" />
                      </div>
                    </Col>
                  </Row>
                </div>
                <div
                  hidden={
                    eli5 != 'ELI5' || (eli5 == 'ELI5' && !props.hideImage)
                  }
                >
                  <Row>
                    <Col span={24}>
                      <Eli5 strategy="TRUFLATION_INFLATION_REGIME" />
                    </Col>
                  </Row>
                </div>
                <div
                  hidden={eli5 == 'ELI5' || (eli5 == 'ELI5' && !props.hideImage)}
                >
                  <h3>Summary</h3>
                  <p>
                    This update rule detects inflation “regimes” from a Truflation
                    oracle time series (or, if unavailable, a fallback price
                    series), and directly outputs a regime-specific target weight
                    vector at each step. Regimes are determined by the{' '}
                    <i>n</i>-period slope of the oracle series and a confirmation
                    mechanism that avoids rapid regime flipping (“whipsaws”).
                  </p>

                  <h3>Inputs and slope construction</h3>
                  <p>
                    <span>
                      Let{' '}
                      <MathJax inline>{'\\(x_k\\)'}</MathJax> denote the
                      chunk-sampled oracle value (Truflation CPI series) at
                      chunk index{' '}
                      <MathJax inline>{'\\(k\\)'}</MathJax>. Using a slope lookback{' '}
                      <MathJax inline>{'\\(n\\)'}</MathJax> (the parameter{' '}
                      <MathJax inline>{'\\(\\texttt{slope\\_length}\\)'}</MathJax>),
                      the strategy computes an{' '}
                      <i>n</i>-period difference (matching{' '}
                      <MathJax inline>{'\\(\\texttt{diff}(n)\\)'}</MathJax> semantics)
                      and normalizes by{' '}
                      <MathJax inline>{'\\(n\\)'}</MathJax>:
                    </span>
                    <MathJax>
                      {
                        '\\[s_k = \\frac{x_k - x_{k-n}}{n}.\\]'
                      }
                    </MathJax>
                    <span>
                      If the oracle is not used/available, the same computation is
                      applied to a fallback 1D price series{' '}
                      <MathJax inline>{'\\(p_k\\)'}</MathJax> (typically the first
                      asset’s chunk-sampled price).
                    </span>
                  </p>

                  <h3>Zone classification with hysteresis</h3>
                  <p>
                    <span>
                      Each slope{' '}
                      <MathJax inline>{'\\(s_k\\)'}</MathJax> is mapped into a
                      discrete “zone”{' '}
                      <MathJax inline>{'\\(z_k \\in \\{-1,0,1\\}\\)'}</MathJax>,
                      representing down / flat / up. The mapping depends on the last
                      confirmed regime{' '}
                      <MathJax inline>{'\\(r^{\\mathrm{conf}}_{k-1}\\)'}</MathJax>
                      to introduce hysteresis via asymmetric flat buffers:
                    </span>
                  </p>
                  <p>
                    <MathJax>
                      {
                        '\\[z_k = \\mathrm{zone}(s_k, r^{\\mathrm{conf}}_{k-1}) = \\begin{cases}\n' +
                        '-1, & r^{\\mathrm{conf}}_{k-1}=-1 \\ \\wedge\\ s_k < b_{\\downarrow} \\\\\n' +
                        '0,  & r^{\\mathrm{conf}}_{k-1}=-1 \\ \\wedge\\ b_{\\downarrow} \\le s_k \\le \\theta_{\\uparrow} \\\\\n' +
                        '1,  & r^{\\mathrm{conf}}_{k-1}=-1 \\ \\wedge\\ s_k > \\theta_{\\uparrow} \\\\\n' +
                        '1,  & r^{\\mathrm{conf}}_{k-1}=1 \\ \\wedge\\ s_k > b_{\\uparrow} \\\\\n' +
                        '0,  & r^{\\mathrm{conf}}_{k-1}=1 \\ \\wedge\\ \\theta_{\\downarrow} \\le s_k \\le b_{\\uparrow} \\\\\n' +
                        '-1, & r^{\\mathrm{conf}}_{k-1}=1 \\ \\wedge\\ s_k < \\theta_{\\downarrow} \\\\\n' +
                        '1,  & r^{\\mathrm{conf}}_{k-1}=0 \\ \\wedge\\ s_k > \\theta_{\\uparrow} \\\\\n' +
                        '-1, & r^{\\mathrm{conf}}_{k-1}=0 \\ \\wedge\\ s_k < \\theta_{\\downarrow} \\\\\n' +
                        '0,  & r^{\\mathrm{conf}}_{k-1}=0 \\ \\wedge\\ \\theta_{\\downarrow} \\le s_k \\le \\theta_{\\uparrow}\n' +
                        '\\end{cases}\\]'
                      }
                    </MathJax>
                    <span>
                      where{' '}
                      <MathJax inline>{'\\(\\theta_{\\uparrow}\\)'}</MathJax> is{' '}
                      <MathJax inline>{'\\(\\texttt{threshold\\_up}\\)'}</MathJax>,{' '}
                      <MathJax inline>{'\\(\\theta_{\\downarrow}\\)'}</MathJax> is{' '}
                      <MathJax inline>
                        {'\\(\\texttt{threshold\\_down}\\)'}
                      </MathJax>,{' '}
                      <MathJax inline>{'\\(b_{\\uparrow}\\)'}</MathJax> is{' '}
                      <MathJax inline>
                        {'\\(\\texttt{flat\\_buffer\\_up}\\)'}
                      </MathJax>, and{' '}
                      <MathJax inline>{'\\(b_{\\downarrow}\\)'}</MathJax> is{' '}
                      <MathJax inline>
                        {'\\(\\texttt{flat\\_buffer\\_down}\\)'}
                      </MathJax>.
                    </span>
                  </p>

                  <h3>Confirmation logic (debouncing regime changes)</h3>
                  <p>
                    <span>
                      The zone signal{' '}
                      <MathJax inline>{'\\(z_k\\)'}</MathJax> is not immediately
                      treated as the regime. Instead, the pool tracks a candidate{' '}
                      <MathJax inline>{'\\(c_k\\)'}</MathJax> and a counter{' '}
                      <MathJax inline>{'\\(u_k\\)'}</MathJax> of consecutive
                      observations in the same candidate zone. If the zone changes,
                      the candidate resets; otherwise the counter increments:
                    </span>
                    <MathJax>
                      {
                        '\\[\\begin{aligned}\n' +
                        'c_k &= \\begin{cases} z_k, & (c_{k-1} \\ne z_k) \\\\\n' +
                        'c_{k-1}, & (c_{k-1} = z_k)\\end{cases} \\\\\n' +
                        'u_k &= \\begin{cases} 1, & (c_{k-1} \\ne z_k) \\\\\n' +
                        'u_{k-1}+1, & (c_{k-1} = z_k)\\end{cases}\n' +
                        '\\end{aligned}\\]'
                      }
                    </MathJax>
                    <span>
                      A regime change is confirmed only when the candidate persists
                      for a regime-specific number of days:
                    </span>
                    <MathJax>
                      {
                        '\\[d(z_k)=\\begin{cases}\n' +
                        'D_{\\uparrow}, & z_k=1 \\\\\n' +
                        'D_{\\downarrow}, & z_k=-1 \\\\\n' +
                        'D_{0}, & z_k=0\n' +
                        '\\end{cases}\\]'
                      }
                    </MathJax>
                    <span>
                      with{' '}
                      <MathJax inline>{'\\(D_{\\uparrow}\\)'}</MathJax> =
                      <MathJax inline>
                        {'\\(\\texttt{confirm\\_up\\_days}\\)'}
                      </MathJax>,{' '}
                      <MathJax inline>{'\\(D_{\\downarrow}\\)'}</MathJax> =
                      <MathJax inline>
                        {'\\(\\texttt{confirm\\_down\\_days}\\)'}
                      </MathJax>, and{' '}
                      <MathJax inline>{'\\(D_{0}\\)'}</MathJax> =
                      <MathJax inline>
                        {'\\(\\texttt{confirm\\_flat\\_days}\\)'}
                      </MathJax>.
                    </span>
                  </p>
                  <p>
                    <span>
                      The confirmation event occurs when{' '}
                      <MathJax inline>{'\\(u_k \\ge d(z_k)\\)'}</MathJax> and{' '}
                      <MathJax inline>
                        {'\\(z_k \\ne r^{\\mathrm{conf}}_{k-1}\\)'}
                      </MathJax>. When confirmed, the “last confirmed” regime
                      updates to the zone and the candidate/counter reset:
                    </span>
                    <MathJax>
                      {
                        '\\[r^{\\mathrm{conf}}_{k} = \\begin{cases}\n' +
                        'z_k, & \\text{if confirmed at } k \\\\\n' +
                        'r^{\\mathrm{conf}}_{k-1}, & \\text{otherwise}\n' +
                        '\\end{cases}\\]'
                      }
                    </MathJax>
                  </p>

                  <h3>Regime time series and alignment</h3>
                  <p>
                    <span>
                      The strategy maintains the current regime{' '}
                      <MathJax inline>{'\\(r_k\\)'}</MathJax> as “the most recently
                      confirmed state” (updating only on a confirmation event).
                      The initial regime is flat, and the first{' '}
                      <MathJax inline>{'\\(n\\)'}</MathJax> steps are padded with
                      flat regime values to align the slope calculation window.
                    </span>
                  </p>

                  <h3>Regime-to-weights mapping</h3>
                  <p>
                    <span>
                      For each regime, the pool holds a learnable weight vector:
                      </span>{' '}
                    <MathJax inline>
                      {'\\(\\mathbf{w}^{\\uparrow},\\mathbf{w}^{0},\\mathbf{w}^{\\downarrow}\\)'}
                    </MathJax>
                    <span>
                      (implemented as a{' '}
                      <MathJax inline>{'\\(3 \\times N\\)'}</MathJax> matrix over{' '}
                      <MathJax inline>{'\\(N\\)'}</MathJax> assets, typically
                      parameterized via logits and a softmax across assets). The
                      raw output at time{' '}
                      <MathJax inline>{'\\(k\\)'}</MathJax> is the selected regime
                      weights:
                    </span>
                    <MathJax>
                      {
                        '\\[\\mathbf{w}(k) = \\begin{cases}\n' +
                        '\\mathbf{w}^{\\uparrow}, & r_k=1 \\\\\n' +
                        '\\mathbf{w}^{0}, & r_k=0 \\\\\n' +
                        '\\mathbf{w}^{\\downarrow}, & r_k=-1\n' +
                        '\\end{cases}\\]'
                      }
                    </MathJax>
                    <span>
                      Finally, outputs are normalized to ensure the portfolio
                      weights sum to 1.
                    </span>
                  </p>

                  <h3>Straight-Through Estimators (STE) during optimization</h3>
                  <p>
                    <span>
                      When STE gradients are enabled, the forward pass preserves
                      the exact discrete regime logic (hard thresholds, hard
                      confirmations, and hard regime selection). In the backward
                      pass, smooth sigmoid-based approximations are used for
                      threshold comparisons and confirmation gating so gradients
                      can flow to regime parameters (e.g., thresholds/buffers and
                      confirmation-day settings). Temperature controls the
                      sharpness of the approximation.
                    </span>
                  </p>

                  <Divider></Divider>
                  <h3>Parameter Guide {'&'} Return Profile Summary</h3>
                  <p>{updateRuleProfileSummary}</p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </MathJaxContext>
    </div>
  );
}
