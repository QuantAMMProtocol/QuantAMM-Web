import { Button, Col, Row, Tag, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ProductBannerProp {
  title: string;
  imgSrc: string;
  description: string[];
  status: string;
  opacity: number;
  imgWidth: string;
  focus: boolean;
  factsheetRoute: string;
  productExplorerRoute: string;
}

export interface ProductBannerProps {
  productData: ProductBannerProp[];
}

export function BannerProductSection(props: ProductBannerProps) {
  const navigate = useNavigate();

  const handleNavigation = (route: string | undefined) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Row style={{ marginBottom: 24 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <h3
            style={{
              color: '#fff',
              fontWeight: 500,
              letterSpacing: '0.5px',
              marginBottom: 4,
            }}
          >
            Featured Blockchain Traded Funds
          </h3>
          <div
            style={{
              width: 80,
              height: 2,
              background: 'linear-gradient(90deg, #f59e0b, #fde047)',
              margin: '0 auto',
              borderRadius: 2,
            }}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} justify="center">
        {props.productData.map((tag, index) => (
          <Col
            key={index}
            xs={24}
            sm={24}
            md={24}
            lg={6}
            xl={6}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Tag
              style={{
                width: '100%',
                maxWidth: 280,
                margin: 0,
                padding: 0,
                textAlign: 'center',
                border: 'transparent',
                background: 'transparent',
                opacity: tag.opacity,
                transition: 'box-shadow .2s ease, transform .15s ease',
              }}
            >
              <Row gutter={[0, 8]} justify="center">
                <Col span={24}>
                  <Row justify="center">
                    <img
                      src={tag.imgSrc}
                      alt={tag.title}
                      style={{ width: '30%', maxWidth: 60, height: 'auto' }}
                    />
                  </Row>
                </Col>
                <Col span={24}>
                  <Tooltip
                    placement="right"
                    title={
                      <div>
                        {tag.description.map((d, i) => (
                          <p key={i} style={{ margin: 0 }}>
                            {d}
                          </p>
                        ))}
                      </div>
                    }
                  >
                    <h5 style={{ margin: 0 }}>{tag.title.toUpperCase()}</h5>
                  </Tooltip>
                </Col>
                <Col span={24}>
                  <Row
                    justify="space-around"
                    align="middle"
                    style={{
                      padding: '8px 14px',
                      borderRadius: 12,
                      background:
                        'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.10))',
                      backdropFilter: 'blur(5px)',
                    }}
                  >
                    <Col flex="1" style={{ textAlign: 'center' }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.62rem',
                          color: '#aaa',
                          letterSpacing: 0.4,
                        }}
                      >
                        TVL
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.8rem',
                          color: '#fff',
                          fontWeight: 500,
                        }}
                      >
                        $100k
                      </p>
                    </Col>

                    <Col flex="0 0 1px">
                      <div
                        style={{
                          width: 1,
                          height: 18,
                          background: 'rgba(255,255,255,0.25)',
                        }}
                      />
                    </Col>

                    <Col flex="1" style={{ textAlign: 'center' }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.62rem',
                          color: '#aaa',
                          letterSpacing: 0.4,
                        }}
                      >
                        Volume
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.8rem',
                          color: '#fff',
                          fontWeight: 500,
                        }}
                      >
                        $2M
                      </p>
                    </Col>
                    <Col flex="0 0 1px">
                      <div
                        style={{
                          width: 1,
                          height: 18,
                          background: 'rgba(255,255,255,0.25)',
                        }}
                      />
                    </Col>
                    <Col flex="1" style={{ textAlign: 'center' }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.62rem',
                          color: '#aaa',
                          letterSpacing: 0.4,
                        }}
                      >
                        ITD P&L
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.8rem',
                          color: '#4ade80',
                          fontWeight: 500,
                        }}
                      >
                        +5%
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row justify="center" gutter={10} style={{ marginTop: 10 }}>
                    <Col flex="0 0 auto"
            xs={24}
            sm={24}
            md={24}
          >
            <Button
              onClick={() => handleNavigation(tag.factsheetRoute)}
              size="small"
              style={{
                padding: '6px 12px',
                          borderRadius: 6,
                          border: '1px solid rgba(255,255,255,0.25)',
                          background: 'rgba(255,255,255,0.05)',
                          color: '#fff',
                          fontSize: '0.78rem',
                          lineHeight: 1,
                          cursor: 'pointer',
                        }}
                      >
                        View Factsheet
                      </Button>
                    </Col>
                    <Col flex="0 0 auto"
            xs={24}
            sm={24}
            md={24}>
                      <Button
                        onClick={() => handleNavigation(tag.productExplorerRoute)}
                        size="small"
                        style={{
                          padding: '6px 12px',
                          borderRadius: 6,
                          background:
                            'linear-gradient(90deg, #fafaf96c, #f5f5f43d)',
                          border: '#fafaf9d2',
                          borderWidth: 1,
                          color: '#fafaf9fa',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          lineHeight: 1,
                          cursor: 'pointer',
                        }}
                      >
                        View Live Pool
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Tag>
          </Col>
        ))}
      </Row>
    </motion.div>
  );
}
