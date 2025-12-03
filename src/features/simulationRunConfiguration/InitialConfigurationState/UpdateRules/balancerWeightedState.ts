import { Chain, UpdateRule } from '../../simulationRunConfigModels';

export const BalancerWeightedState: UpdateRule = {
  updateRuleName: 'Balancer Weighted',
  updateRuleKey: 'balancer',
  updateRuleSimKey: 'balancer',
  updateRuleResultProfileSummary:
    'As a constant function market maker balancer suffers from impermanent loss leading to negative returns in almost all circumstances.',
  heatmapKeys: [],
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  updateRuleParameters: [],
  applicablePoolTypes: ['Balancer Weighted'],
  chainDeploymentDetails: new Map<Chain, string>(),
};


export const LvrBalancerWeightedState: UpdateRule = {
  updateRuleName: 'LVR - Balancer Weighted',
  updateRuleKey: 'lvr__balancer',
  updateRuleSimKey: 'lvr__balancer',
  updateRuleResultProfileSummary:
    'As a constant function market maker balancer suffers from impermanent loss leading to negative returns in almost all circumstances.',
  heatmapKeys: [],
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: undefined,
  updateRuleParameters: [],
  applicablePoolTypes: ['LVR for Balancer Weighted'],
  chainDeploymentDetails: new Map<Chain, string>(),
};


export const RvrBalancerWeightedState: UpdateRule = {
  updateRuleName: 'RVR - Balancer Weighted',
  updateRuleKey: 'rvr__balancer',
  updateRuleSimKey: 'rvr__balancer',
  updateRuleResultProfileSummary:
    'As a constant function market maker balancer suffers from impermanent loss leading to negative returns in almost all circumstances.',
  heatmapKeys: [],
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: undefined,
  updateRuleParameters: [],
  applicablePoolTypes: ['RVR for Balancer Weighted'],
  chainDeploymentDetails: new Map<Chain, string>(),
};
