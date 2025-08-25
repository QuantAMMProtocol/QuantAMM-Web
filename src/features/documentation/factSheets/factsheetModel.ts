import { Dictionary } from 'lodash';
import { Pool } from '../../../services/breakdownService';

export interface FactsheetImage {
  image: string;
  width: string;
  alt: string;
}

export interface FactsheetDeploymentLinks {
  contractLinks: [string, string][];
}

export interface FactsheetFixedSettings {
  strategyInterval: string;
  strategy: string;
  staleness: string;
  swapFee: string;
  withdrawalFee: string;
  streamingFee: string;
}

export interface FactsheetFact {
  title: string;
  description: JSX.Element;
}

export interface FactsheetTrainedParameters {
  name: string;
  variations: FactsheetTrainedParamVariation[];
}

export interface FactsheetTrainedParamVariation {
  name: string;
  tooltip: string;
  value: string[];
}

export interface FactsheetModel {
  mainTitle: string;
  mainDescription: string;
  iconTitle:string;
  iconDescription:string[];
  status: string;
  iconOpacity: number;
  iconFocus: boolean;
  poolId: string;
  poolChain:string;
  pools: Pool[];
  factsheetImage: FactsheetImage;
  objective: string;
  defaultPeriod: [string, string]; //value, description
  alternatePeriod: [string, string];
  trainPeriod: string;
  poolPrefix: string;
  xAxisIntervals: Map<string, number>;
  cumulativePerformanceOverrideSeriesStrokeColor?: Dictionary<string>;
  cumulativePerformanceOverrideSeriesName?: Dictionary<string>;
  updateRule: JSX.Element;
  advantages: FactsheetFact[];
  risks: FactsheetFact[];
  trainingWindowTitle: string;
  trainingDescription: JSX.Element;
  trainedParameters: FactsheetTrainedParameters[];
  deploymentLinks: FactsheetDeploymentLinks;
  fixedSettings: [string, string][];
}
