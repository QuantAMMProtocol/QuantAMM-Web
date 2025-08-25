import { Col, Row, Tag } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ProductBannerProp{
      title:string;
      imgSrc: string;
      description: string[];
      status: string;
      opacity: number;
      imgWidth: string;
      focus: boolean;
      route: string;
    }

interface ProductBannerProps{
    productData:ProductBannerProp[];
}

export function BannerProductSection(props:ProductBannerProps) {
  const navigate = useNavigate();

  const handleNavigation = (route: string | undefined) => {
    if (route) {
      navigate(route);
    }
  };

return <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 3,
                delay: 1.2,
                scale: { type: 'spring', visualDuration: 3, bounce: 0.1 },
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: '100%',
              }}
            >
              <Row>
                {props.productData.map((tag, index) => (
                  <Col span={12} key={index}>
                    <Tag
                      onClick={() => handleNavigation(tag.route)}
                      style={{
                        width: '100%',
                        margin: '5px',
                        textAlign: 'center',
                        border: 'transparent',
                        backgroundColor: 'transparent',
                        opacity: tag.opacity,
                        cursor: tag.route ? 'pointer' : 'default',
                        transition: 'box-shadow 0.3s ease-in-out',
                        boxShadow: tag.route
                          ? '0 0 0px rgba(255, 255, 255, 0)'
                          : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (tag.route) {
                          (e.currentTarget as HTMLElement).style.boxShadow =
                            '0 0 10px rgba(255, 255, 255, 0.8)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (tag.route) {
                          (e.currentTarget as HTMLElement).style.boxShadow =
                            '0 0 0px rgba(255, 255, 255, 0)';
                        }
                      }}
                    >
                      <Row style={{ margin: 0, padding: 0 }}>
                        <Col span={24}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <img
                              src={tag.imgSrc}
                              style={{ width: tag.imgWidth, height: 'auto' }}
                              alt={tag.title}
                            />
                          </div>
                        </Col>
                        <Col span={24}>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              height: '100%',
                            }}
                          >
                            <h3 style={{ margin: '5px', textAlign: 'left' }}>
                              {tag.title + ' - ' + tag.status}
                            </h3>
                            {tag.description.map((desc, i) => (
                              <p
                                key={i}
                                style={{
                                  textAlign: 'left',
                                  margin: 0,
                                  paddingLeft: '5px',
                                }}
                              >
                                {desc}
                              </p>
                            ))}
                          </div>
                        </Col>
                      </Row>
                    </Tag>
                  </Col>
                ))}
              </Row>
            </motion.div>
}