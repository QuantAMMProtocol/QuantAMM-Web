import { Col, Collapse, Form, Radio, Row } from 'antd';
import { ProductItemBackground } from '../../../productExplorer/productItem/productItemBackground';
import { useState } from 'react';
import { FAQItems } from '../faqItems';

export function FAQ() {
  const [eli5, setEli5] = useState('ELI5');

  return (
    <ProductItemBackground
      wide={true}
      layers={20}
      backgroundColourOverride="#FFFEF2"
      borderColourOverride="#f6f4ef"
    >
      <Row style={{ height: '100%' }}>
        <Row style={{ height: '100%', width: '100%' }}>
          <Col span={1} style={{ width: '100%' }}></Col>
          <Col span={8} style={{ width: '100%', height: '100%' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <img
                src="/background/sandChart.png"
                style={{ width: '100%', borderRadius: '20px' }}
              />
            </div>
          </Col>
          <Col span={1}></Col>
          <Col span={13} style={{ width: '100%', height: '100%' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Row>
                <Col span={24}>
                  <h1
                    style={{
                      color: '#162536',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    FREQUENTLY ASKED QUESTIONS
                  </h1>
                </Col>
                <Col
                  span={24}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Form.Item style={{ marginTop: '5px' }}>
                    <label style={{ marginRight: '5px', color: '#162536' }}>
                      Choose Knowledge Level:
                    </label>
                    <Radio.Group
                      size="small"
                      value={eli5}
                      onChange={(e) => setEli5(e.target.value)}
                    >
                      <Radio.Button value={'ELI5'}>ELI5</Radio.Button>
                      <Radio.Button value={'Crypto Native'}>
                        Crypto Native
                      </Radio.Button>
                      <Radio.Button value={'Quant'}>Quant</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Collapse
                    defaultActiveKey={['1']}
                    style={{ width: '100%', backgroundColor: '#2c496b' }}
                    accordion
                    items={FAQItems.map((x) => {
                      return {
                        key: x.key,
                        label: x.label,
                        children: (
                          <>
                            <div hidden={eli5 != 'ELI5'}>
                              {x.eli5Description}
                            </div>
                            <div hidden={eli5 != 'Crypto Native'}>
                              {x.cryptoNativeDescription}
                            </div>
                            <div hidden={eli5 != 'Quant'}>
                              {x.quantDescription}
                            </div>
                          </>
                        ),
                      };
                    })}
                    size="small"
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={1}></Col>
        </Row>
      </Row>
    </ProductItemBackground>
  );
}
