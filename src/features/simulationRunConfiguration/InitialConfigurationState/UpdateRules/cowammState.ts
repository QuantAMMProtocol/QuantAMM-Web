import { Chain, UpdateRule } from '../../simulationRunConfigModels';

export const CowAMMState: UpdateRule = {
  updateRuleName: 'CowAMM Weighted',
  updateRuleKey: 'CowAMM Weighted',
  updateRuleSimKey: 'cow',
  updateRuleResultProfileSummary: 'CowAMM Weighted simulation engine',
  heatmapKeys: [],
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: 'runTraining',
  updateRuleParameters: [
    {
      factorName: 'arb_quality',
      factorDisplayName: 'Solver efficiency',
      factorDescription:
        'There can be enough competition between solvers when batching to fully eliminate LVR, however they can also run sub-optimally',
      applicableCoins: [],
      factorValue: '1.0',
      minValue: '0.0',
      maxValue: '1.0',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'noise_trader_ratio',
      factorDisplayName: 'Noise/Arb Ratio',
      factorDescription:
        'CowAMM shows how noise can be a multiplier of arb volume. This is that multiplier',
      applicableCoins: [],
      factorValue: '0.0',
      minValue: '0.0',
      maxValue: '10.0',
      smartContractSortOrder: 1,
    },
  ],
  applicablePoolTypes: ['CowAMM Weighted'],
  chainDeploymentDetails: new Map<Chain, string>(),
};
export const LvrCowAMMState: UpdateRule = {
  updateRuleName: 'LVR - CowAMM Weighted',
  updateRuleKey: 'lvr__CowAMM',
  updateRuleSimKey: 'lvr__cow',
  updateRuleResultProfileSummary: 'CowAMM Weighted LVR simulation engine',
  heatmapKeys: [],
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: undefined,
  updateRuleParameters: [],
  applicablePoolTypes: ['LVR for CowAMM Weighted'],
  chainDeploymentDetails: new Map<Chain, string>(),
};
export const RvrCowAMMState: UpdateRule = {
  updateRuleName: 'RVR - CowAMM Weighted',
  updateRuleKey: 'rvr__CowAMM',
  updateRuleSimKey: 'rvr__cow',
  updateRuleResultProfileSummary: 'CowAMM Weighted RVR simulation engine',
  heatmapKeys: [],
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: undefined,
  updateRuleParameters: [],
  applicablePoolTypes: ['RVR for CowAMM Weighted'],
  chainDeploymentDetails: new Map<Chain, string>(),
};
