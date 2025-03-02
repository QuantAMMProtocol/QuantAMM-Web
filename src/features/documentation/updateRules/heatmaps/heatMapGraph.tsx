import { Col, Row } from 'antd';
import { useAppSelector } from '../../../../app/hooks';
import { HeatMap } from '../../../simulationRunConfiguration/simulationRunConfigModels';
import { selectTheme } from '../../../themes/themeSlice';

export interface HeatMapProp {
  heatMap: HeatMap;
}

export function HeatMapGraph(props: HeatMapProp) {
  const isDarkTheme = useAppSelector(selectTheme);
  return (
    <Row>
      <Col span={24}>
        <img
          hidden={isDarkTheme}
          loading="lazy"
          src={'/heatmaps/' + props.heatMap.imageName + '_light.png'}
          alt=""
          style={{ width: '100%' }}
        />
        <img
          hidden={!isDarkTheme}
          loading="lazy"
          src={'/heatmaps/' + props.heatMap.imageName + '_dark.png'}
          alt=""
          style={{ width: '100%' }}
        />
      </Col>
    </Row>
  );
}
