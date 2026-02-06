import { Col, Collapse, Form, Radio, Row } from 'antd';
import { ProductItemBackground } from '../../../productExplorer/productItem/productItemBackground';
import { useState } from 'react';
import { FAQItems } from '../faqItems';
import styles from './landingDesktop.module.css';

export function FAQ() {
  const [eli5, setEli5] = useState('ELI5');

  return (
    <ProductItemBackground
      wide={true}
      layers={20}
      backgroundColourOverride="#FFFEF2"
      borderColourOverride="#f6f4ef"
    >
      <Row className={styles.fullHeight}>
        <Row className={styles.faqLayout}>
          <Col span={1} className={styles.fullWidth}></Col>
          <Col span={8} className={styles.faqLayout}>
            <div className={styles.faqImageWrap}>
              <img
                src="/background/sandChart.png"
                className={styles.faqImage}
              />
            </div>
          </Col>
          <Col span={1}></Col>
          <Col span={13} className={styles.faqLayout}>
            <div className={styles.centeredColumn}>
              <Row>
                <Col span={24}>
                  <h1 className={styles.faqTitle}>FREQUENTLY ASKED QUESTIONS</h1>
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
                    className={styles.faqCollapse}
                    accordion
                    items={FAQItems.map((x) => {
                      return {
                        key: x.key,
                        label: x.label,
                        children: (
                          <>
                            <div hidden={eli5 !== 'ELI5'}>
                              {x.eli5Description}
                            </div>
                            <div hidden={eli5 !== 'Crypto Native'}>
                              {x.cryptoNativeDescription}
                            </div>
                            <div hidden={eli5 !== 'Quant'}>
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
