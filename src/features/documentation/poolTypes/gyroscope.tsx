import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { Col, Row } from 'antd';
import { Gyro } from '../../shared/eli5/gyro';
import styles from './poolTypes.module.css';

const GyroscopePoolDescription: React.FC = () => {
  return (
    <Row>
      <Col span={4}></Col>
      <Col span={16}>
        <Fade>
          <div className={styles.contentPad20}>
            <Gyro />
          </div>
        </Fade>
      </Col>
      <Col span={4}></Col>
    </Row>
  );
};

export default GyroscopePoolDescription;
