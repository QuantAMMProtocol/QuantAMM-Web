import { Chain, UpdateRule } from '../../simulationRunConfigModels';

export const HodlState: UpdateRule = {
  updateRuleName: 'HODL',
  updateRuleKey: 'HODL',
  updateRuleSimKey: 'hodl',
  updateRuleRunUrl: 'runSimulation',
  applicablePoolTypes: ['HODL'],
  chainDeploymentDetails: new Map<Chain, string>(),
  updateRuleTrainUrl: undefined,
  updateRuleResultProfileSummary:
    'Your return is just the price change (proportional per coin held at the start) of each coin over time',
  heatmapKeys: [],
  updateRuleParameters: [],
};
