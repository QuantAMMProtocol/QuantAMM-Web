import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { Col, Row } from 'antd';
import { CowAMM } from '../../shared/eli5/cowAMM';
import sharedStyles from '../documentation.module.css';

const CowammPoolDescription: React.FC = () => {
  return (
    <Row>
      <Col span={4}></Col>
      <Col span={16}>
        <Fade>
          <div className={sharedStyles.pad20}>
            <CowAMM />
          </div>
        </Fade>
      </Col>
      <Col span={4}></Col>
    </Row>
  );
};

export default CowammPoolDescription;
