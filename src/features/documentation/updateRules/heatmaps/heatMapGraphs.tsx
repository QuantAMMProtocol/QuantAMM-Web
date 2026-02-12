import { Divider, Select } from 'antd';
import { useState } from 'react';
import { HeatMap } from '../../../simulationRunConfiguration/simulationRunConfigModels';
import { HeatMapGraph } from './heatMapGraph';

export interface HeatMapProps {
  heatMaps: HeatMap[];
}

export function HeatMapGraphs(props: HeatMapProps) {
  const [currentTimeRange, setTimeRange] = useState(
    'Super Cycle 20/11/20:22/07/22'
  );
  const handleChange = (value: string) => {
    setTimeRange(value);
  };

  return (
    <div>
      Simulation Time Range:{' '}
      <Select
        defaultValue={currentTimeRange}
        onChange={handleChange}
        options={props.heatMaps.map((x) => ({ value: x.name, label: x.name }))}
      />
      <Divider></Divider>
      <div hidden={props.heatMaps.length === 0}>
        {props.heatMaps
          .filter((x) => x.name === currentTimeRange)
          .map((x) => (
            <div key={x.name}>
              <HeatMapGraph heatMap={x} />
            </div>
          ))}
      </div>
      <div hidden={props.heatMaps.length !== 0}>
        <p color="red">No heatmaps available for this basket.</p>
        <p>
          It may be that heatmaps are not the right tool for this rule. If there
          are more than two parameters then attempting to visualise the returns
          of the heatmap will be misleading.
        </p>
        <p>
          If you think a heatmap can be applicable and you are running the
          simulator locally you can run do_heatmaps.py to generate custom
          heatmaps.
        </p>
      </div>
    </div>
  );
}
