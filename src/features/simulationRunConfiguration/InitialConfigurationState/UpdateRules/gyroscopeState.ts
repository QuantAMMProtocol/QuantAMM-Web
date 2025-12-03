import { Chain, UpdateRule } from '../../simulationRunConfigModels';

export const gyroscopeState: UpdateRule = {
  updateRuleName: 'Gyroscope',
  updateRuleKey: 'gyroscope',
  updateRuleSimKey: 'gyroscope',
  updateRuleResultProfileSummary: 'Gyroscope simulation engine',
  heatmapKeys: [],
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: undefined,
  updateRuleParameters: [
    {
      factorName: 'alpha',
      factorDisplayName: 'Lower price bound',
      factorDescription:
        'Top of the price range (denominated in the numeraire token)',
      applicableCoins: [],
      factorValue: '10',
      minValue: '0',
      maxValue: '200000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'beta',
      factorDisplayName: 'Upper price bound',
      factorDescription:
        'Top of the price range (denominated in the numeraire token)',
      applicableCoins: [],
      factorValue: '20',
      minValue: '0',
      maxValue: '200000',
      smartContractSortOrder: 1,
    },
  ],
  applicablePoolTypes: ['Gyroscope'],
  chainDeploymentDetails: new Map<Chain, string>(),
};

export const lvrGyroscopeState: UpdateRule = {
  updateRuleName: 'LVR - Gyroscope',
  updateRuleKey: 'lvr__Gyroscope',
  updateRuleSimKey: 'lvr__gyroscope',
  updateRuleResultProfileSummary: 'Gyroscope LVR simulation engine',
  heatmapKeys: [],
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: undefined,
  updateRuleParameters: [
    {
      factorName: 'alpha',
      factorDisplayName: 'Lower price bound',
      factorDescription:
        'Top of the price range (denominated in the numeraire token)',
      applicableCoins: [],
      factorValue: '10',
      minValue: '0',
      maxValue: '200000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'beta',
      factorDisplayName: 'Upper price bound',
      factorDescription:
        'Top of the price range (denominated in the numeraire token)',
      applicableCoins: [],
      factorValue: '20',
      minValue: '0',
      maxValue: '200000',
      smartContractSortOrder: 1,
    },
  ],
  applicablePoolTypes: ['LVR for Gyroscope'],
  chainDeploymentDetails: new Map<Chain, string>(),
};
export const rvrGyroscopeState: UpdateRule = {
  updateRuleName: 'RVR - Gyroscope',
  updateRuleKey: 'rvr__Gyroscope',
  updateRuleSimKey: 'rvr__gyroscope',
  updateRuleResultProfileSummary: 'Gyroscope RVR simulation engine',
  heatmapKeys: [],
  updateRuleRunUrl: 'runSimulation',
  updateRuleTrainUrl: undefined,
  updateRuleParameters: [
    {
      factorName: 'alpha',
      factorDisplayName: 'Lower price bound',
      factorDescription:
        'Top of the price range (denominated in the numeraire token)',
      applicableCoins: [],
      factorValue: '10',
      minValue: '0',
      maxValue: '200000',
      smartContractSortOrder: 0,
    },
    {
      factorName: 'beta',
      factorDisplayName: 'Upper price bound',
      factorDescription:
        'Top of the price range (denominated in the numeraire token)',
      applicableCoins: [],
      factorValue: '20',
      minValue: '0',
      maxValue: '200000',
      smartContractSortOrder: 1,
    },
  ],
  applicablePoolTypes: ['RVR for Gyroscope'],
  chainDeploymentDetails: new Map<Chain, string>(),
};
