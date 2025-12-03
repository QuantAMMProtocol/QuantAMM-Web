import { decode } from '@msgpack/msgpack';
import {
  ReturnTimeStep,
  SimulationRunBreakdown,
  SimulationRunBreakdownDto,
} from '../features/simulationResults/simulationResultSummaryModels';
import {
  Chain,
  CoinComparison,
  CoinPrice,
  DeployedToken,
} from '../features/simulationRunConfiguration/simulationRunConfigModels';

// Declare the Pool type with new possible values
export type Pool =
  | 'balancerWeighted'
  | 'balancerWeightedLvr'
  | 'balancerWeightedRvr'
  | 'cowAMM'
  | 'cowAmmLvr'
  | 'cowAmmRvr'
  | 'gyroscope'
  | 'gyroscopeLvr'
  | 'gyroscopeRvr'
  | 'quantAMMMomentum'
  | 'quantAMMAntiMomentum'
  | 'quantAMMPowerChannel'
  | 'quantAMMChannelFollowing'
  | 'quantAMMMeanReversionChannel'
  | 'hodlEthUsdc'
  | 'hodlBtcEthUsdc'
  | 'solExampleMomentum'
  | 'solExampleAntimomentum'
  | 'solExamplePowerChannel'
  | 'solExampleChannelFollowing'
  | 'solExampleHodl'
  | 'solExampleWeighted'
  | 'safeHavenBTF2025Test'
  | 'safeHavenBTFAugTest'
  | 'safeHavenBTFAugTrain'
  | 'safeHavenCFMM2025Test'
  | 'safeHavenCFMMAugTest'
  | 'safeHavenCFMMAugTrain'
  | 'safeHavenHodl2025Test'
  | 'safeHavenHodlAugTest'
  | 'safeHavenHodlAugTrain'
  | 'safeHavenBTF2025TestFull'
  | 'safeHavenBTFAugTestFull'
  | 'safeHavenBTFAugTrainFull'
  | 'safeHavenCFMM2025TestFull'
  | 'safeHavenCFMMAugTestFull'
  | 'safeHavenCFMMAugTrainFull'
  | 'safeHavenHodl2025TestFull'
  | 'safeHavenHodlAugTestFull'
  | 'safeHavenHodlAugTrainFull'
  | 'baseMacroBTF2025Test'
  | 'baseMacroBTFAugTest'
  | 'baseMacroBTFAugTrain'
  | 'baseMacroCFMM2025Test'
  | 'baseMacroCFMMAugTest'
  | 'baseMacroCFMMAugTrain'
  | 'baseMacroHodl2025Test'
  | 'baseMacroHodlAugTest'
  | 'baseMacroHodlAugTrain'
  | 'baseMacroBTF2025TestFull'
  | 'baseMacroBTFAugTestFull'
  | 'baseMacroBTFAugTrainFull'
  | 'baseMacroCFMM2025TestFull'
  | 'baseMacroCFMMAugTestFull'
  | 'baseMacroCFMMAugTrainFull'
  | 'baseMacroHodl2025TestFull'
  | 'baseMacroHodlAugTestFull'
  | 'baseMacroHodlAugTrainFull'
  | 'sonicMacroBTFAprilTest'
  | 'sonicMacroBTFAugTrain'
  | 'sonicMacroCFMMAprilTest'
  | 'sonicMacroCFMMAugTrain'
  | 'sonicMacroHodlAprilTest'
  | 'sonicMacroHodlAugTrain'
  | 'sonicMacroBTFAprilTestFull'
  | 'sonicMacroBTFAugTrainFull'
  | 'sonicMacroCFMMAprilTestFull'
  | 'sonicMacroCFMMAugTrainFull'
  | 'sonicMacroHodlAprilTestFull'
  | 'sonicMacroHodlAugTrainFull'
  | 'arbitrumMacroBTFAugTrain'
  | 'arbitrumMacroCFMMAugTrain'
  | 'arbitrumMacroHodlAugTrain'
  | 'arbitrumMacroBTFAugTrainFull'
  | 'arbitrumMacroCFMMAugTrainFull'
  | 'arbitrumMacroHodlAugTrainFull'
  | 'arbitrumMacroCFMMAugTest'
  | 'arbitrumMacroBTFAugTest'
  | 'arbitrumMacroHodlAugTest'
  | 'arbitrumMacroBTF2025Test'
  | 'arbitrumMacroCFMM2025Test'
  | 'arbitrumMacroHodl2025Test'
  | 'arbitrumMacroCFMMAugTestFull'
  | 'arbitrumMacroBTFAugTestFull'
  | 'arbitrumMacroHodlAugTestFull'
  | 'arbitrumMacroBTF2025TestFull'
  | 'arbitrumMacroCFMM2025TestFull'
  | 'arbitrumMacroHodl2025TestFull'  
  |  'truflationBitcoinBTFAugTrain'
  |  'truflationBitcoinCFMMAugTrain'
  |  'truflationBitcoinHodlAugTrain'
  |  'truflationBitcoinCFMMAugTest'
  |  'truflationBitcoinBTFAugTest'
  |  'truflationBitcoinHodlAugTest'
  |  'truflationBitcoinBTF2025Test'
  |  'truflationBitcoinCFMM2025Test'
  |  'truflationBitcoinHodl2025Test'  
  |  'truflationBitcoinBTFAugTrainFull'
  |  'truflationBitcoinCFMMAugTrainFull'
  |  'truflationBitcoinHodlAugTrainFull'
  |  'truflationBitcoinCFMMAugTestFull'
  |  'truflationBitcoinBTFAugTestFull'
  |  'truflationBitcoinHodlAugTestFull'
  |  'truflationBitcoinBTF2025TestFull'
  |  'truflationBitcoinCFMM2025TestFull'
  |  'truflationBitcoinHodl2025TestFull';

// Helper to convert MessagePack data to breakdown DTO
export const convertBreakdownDtoToBreakdown = (
  dto: SimulationRunBreakdownDto
): SimulationRunBreakdown => {
  return {
    simulationRun: {
      id: dto.simulationRun.id,
      name: dto.simulationRun.name,
      enableAutomaticArbBots: dto.simulationRun.enableAutomaticArbBots,
      poolNumeraireCoinCode: dto.simulationRun.poolNumeraireCoinCode,
      poolConstituents: dto.simulationRun.poolConstituents.map(
        (constituent) => {
          return {
            coin: {
              coinName: constituent.coin.coinName,
              coinCode: constituent.coin.coinCode,
              dailyPriceHistory: constituent.coin.dailyPriceHistory,
              dailyPriceHistoryMap: new Map<number, CoinPrice>(),
              dailyReturns: new Map<number, ReturnTimeStep>(),
              coinComparisons: new Map<string, CoinComparison>(),
              deploymentByChain: new Map<Chain, DeployedToken>(),
            },
            amount: constituent.amount,
            marketValue: constituent.marketValue,
            currentPrice: constituent.currentPrice,
            currentPriceUnix: constituent.currentPriceUnix,
            weight: constituent.weight,
            factorValue: null,
          };
        }
      ),
      updateRule: dto.simulationRun.updateRule,
      runStatus: dto.simulationRun.runStatus,
      feeHooks: dto.simulationRun.feeHooks,
      swapImports: dto.simulationRun.swapImports,
      poolType: dto.simulationRun.poolType,
    },
    flatSimulationRunResult: dto.flatSimulationRunResult,
    simulationRunStatus: dto.simulationRunStatus,
    simulationRunResultAnalysis: dto.simulationRunResultAnalysis,
    simulationComplete: dto.simulationComplete,
    timeSteps: dto.timeSteps,
    timeRange: dto.timeRange,
  };
};

// Function to dynamically load MessagePack file and convert it to breakdown
export const getBreakdown = async (
  poolName: Pool
): Promise<SimulationRunBreakdown> => {
  const poolFileMapping: Record<Pool, string> = {
    // Mapping pool names to corresponding file paths
    balancerWeighted: '/prerun_sims/Balancer Weighted_ETH-USDC.msgpack',
    balancerWeightedLvr:
      '/prerun_sims/LVR - Balancer Weighted_-ETH-USDC.msgpack',
    balancerWeightedRvr:
      '/prerun_sims/RVR - Balancer Weighted_-ETH-USDC.msgpack',
    cowAMM: '/prerun_sims/CowAMM[arb_quality_1.0]_-ETH-USDC.msgpack',
    cowAmmLvr: '/prerun_sims/LVR - CowAMM_-ETH-USDC.msgpack',
    cowAmmRvr: '/prerun_sims/RVR - CowAMM_-ETH-USDC.msgpack',
    gyroscope:
      '/prerun_sims/Gyroscope[alpha_1000][beta_5000]_-ETH-USDC.msgpack',
    gyroscopeLvr:
      '/prerun_sims/LVR - Gyroscope[alpha_1000][beta_5000]_-ETH-USDC.msgpack',
    gyroscopeRvr:
      '/prerun_sims/RVR - Gyroscope[alpha_1000][beta_5000]_-ETH-USDC.msgpack',
    quantAMMMomentum:
      '/prerun_sims/Momentum[k_per_day_50][memory_days_5]_-ETH-BTC-USDC.msgpack',
    quantAMMAntiMomentum:
      '/prerun_sims/AntiMomentum[k_per_day_0.005][memory_days_80]_-BTC-ETH-USDC.msgpack',
    quantAMMPowerChannel:
      '/prerun_sims/Power Channel[k_per_day_50][memory_days_5][exponent_1.13]_-BTC-ETH-USDC.msgpack',
    quantAMMChannelFollowing:
      '/prerun_sims/Channel Following_VectorParams.msgpack',
    quantAMMMeanReversionChannel:
      '/prerun_sims/Difference Momentum[k_per_day_-10,-5,5,2][memory_days_2_100,2,2,5][memory_days_1_70,1,30,15]_-BTC-ETH-PAXG-USDC.msgpack',
    hodlEthUsdc: '/prerun_sims/HODL_-ETH-USDC.msgpack',
    hodlBtcEthUsdc:
      '/prerun_sims/Momentum[k_per_day_50][memory_days_5]_-ETH-BTC-USDC.msgpack', // Example; replace with actual path
    solExampleMomentum: '/prerun_sims/BTC-ETH-SOL-USDC-momentum-daily.msgpack',
    solExampleAntimomentum: '/prerun_sims/BTC-ETH-SOL-USDC-antimomentum.msgpack',
    solExamplePowerChannel: '/prerun_sims/BTC-ETH-SOL-USDC-power-channel-daily.msgpack',
    solExampleChannelFollowing:
      '/prerun_sims/BTC-ETH-SOL-USDC-channel-following-daily.msgpack',
    solExampleHodl: '/prerun_sims/BTC-ETH-SOL-USDC-hodl-daily.msgpack',
    solExampleWeighted:'/prerun_sims/BTC-ETH-SOL-USDC-weighted.msgpack',
    safeHavenBTF2025Test: '/prerun_sims/SAFE_HAVEN_BTF_2025_TEST.msgpack',
    safeHavenBTFAugTest: '/prerun_sims/SAFE_HAVEN_BTF_AUG_TEST.msgpack',
    safeHavenBTFAugTrain: '/prerun_sims/SAFE_HAVEN_BTF_AUG_TRAIN.msgpack',
    safeHavenCFMM2025Test: '/prerun_sims/SAFE_HAVEN_CFMM_2025_TEST.msgpack',
    safeHavenCFMMAugTest: '/prerun_sims/SAFE_HAVEN_CFMM_AUG_TEST.msgpack',
    safeHavenCFMMAugTrain: '/prerun_sims/SAFE_HAVEN_CFMM_AUG_TRAIN.msgpack',
    safeHavenHodl2025Test: '/prerun_sims/SAFE_HAVEN_HODL_2025_TEST.msgpack',
    safeHavenHodlAugTest: '/prerun_sims/SAFE_HAVEN_HODL_AUG_TEST.msgpack',
    safeHavenHodlAugTrain: '/prerun_sims/SAFE_HAVEN_HODL_AUG_TRAIN.msgpack',
    safeHavenBTF2025TestFull: '/prerun_sims/SAFE_HAVEN_BTF_2025_TEST_FULL.msgpack',
    safeHavenBTFAugTestFull: '/prerun_sims/SAFE_HAVEN_BTF_AUG_TEST_FULL.msgpack',
    safeHavenBTFAugTrainFull: '/prerun_sims/SAFE_HAVEN_BTF_AUG_TRAIN_FULL.msgpack',
    safeHavenCFMM2025TestFull: '/prerun_sims/SAFE_HAVEN_CFMM_2025_TEST_FULL.msgpack',
    safeHavenCFMMAugTestFull: '/prerun_sims/SAFE_HAVEN_CFMM_AUG_TEST_FULL.msgpack',
    safeHavenCFMMAugTrainFull: '/prerun_sims/SAFE_HAVEN_CFMM_AUG_TRAIN_FULL.msgpack',
    safeHavenHodl2025TestFull: '/prerun_sims/SAFE_HAVEN_HODL_2025_TEST_FULL.msgpack',
    safeHavenHodlAugTestFull: '/prerun_sims/SAFE_HAVEN_HODL_AUG_TEST_FULL.msgpack',
    safeHavenHodlAugTrainFull: '/prerun_sims/SAFE_HAVEN_HODL_AUG_TRAIN_FULL.msgpack',
    baseMacroBTF2025Test: '/prerun_sims/BASE_MACRO_BTF_2025_TEST.msgpack',
    baseMacroBTFAugTest: '/prerun_sims/BASE_MACRO_BTF_AUG_TEST.msgpack',
    baseMacroBTFAugTrain: '/prerun_sims/BASE_MACRO_BTF_AUG_TRAIN.msgpack',
    baseMacroCFMM2025Test: '/prerun_sims/BASE_MACRO_CFMM_2025_TEST.msgpack',
    baseMacroCFMMAugTest: '/prerun_sims/BASE_MACRO_CFMM_AUG_TEST.msgpack',
    baseMacroCFMMAugTrain: '/prerun_sims/BASE_MACRO_CFMM_AUG_TRAIN.msgpack',
    baseMacroHodl2025Test: '/prerun_sims/BASE_MACRO_HODL_2025_TEST.msgpack',
    baseMacroHodlAugTest: '/prerun_sims/BASE_MACRO_HODL_AUG_TEST.msgpack',
    baseMacroHodlAugTrain: '/prerun_sims/BASE_MACRO_HODL_AUG_TRAIN.msgpack',
    baseMacroBTF2025TestFull: '/prerun_sims/BASE_MACRO_BTF_2025_TEST_FULL.msgpack',
    baseMacroBTFAugTestFull: '/prerun_sims/BASE_MACRO_BTF_AUG_TEST_FULL.msgpack',
    baseMacroBTFAugTrainFull: '/prerun_sims/BASE_MACRO_BTF_AUG_TRAIN_FULL.msgpack',
    baseMacroCFMM2025TestFull: '/prerun_sims/BASE_MACRO_CFMM_2025_TEST_FULL.msgpack',
    baseMacroCFMMAugTestFull: '/prerun_sims/BASE_MACRO_CFMM_AUG_TEST_FULL.msgpack',
    baseMacroCFMMAugTrainFull: '/prerun_sims/BASE_MACRO_CFMM_AUG_TRAIN_FULL.msgpack',
    baseMacroHodl2025TestFull: '/prerun_sims/BASE_MACRO_HODL_2025_TEST_FULL.msgpack',
    baseMacroHodlAugTestFull: '/prerun_sims/BASE_MACRO_HODL_AUG_TEST_FULL.msgpack',
    baseMacroHodlAugTrainFull: '/prerun_sims/BASE_MACRO_HODL_AUG_TRAIN_FULL.msgpack',
    sonicMacroBTFAprilTest: '/prerun_sims/SONIC_MACRO_BTF_APRIL_TEST.msgpack',
    sonicMacroBTFAugTrain: '/prerun_sims/SONIC_MACRO_BTF_APRIL_TRAIN.msgpack',
    sonicMacroCFMMAprilTest: '/prerun_sims/SONIC_MACRO_CFMM_APRIL_TEST.msgpack',
    sonicMacroCFMMAugTrain: '/prerun_sims/SONIC_MACRO_CFMM_APRIL_TRAIN.msgpack',
    sonicMacroHodlAprilTest: '/prerun_sims/SONIC_MACRO_HODL_APRIL_TEST.msgpack',
    sonicMacroHodlAugTrain: '/prerun_sims/SONIC_MACRO_HODL_APRIL_TRAIN.msgpack',
    sonicMacroBTFAprilTestFull: '/prerun_sims/SONIC_MACRO_BTF_APRIL_TEST_FULL.msgpack',
    sonicMacroBTFAugTrainFull: '/prerun_sims/SONIC_MACRO_BTF_APRIL_TRAIN_FULL.msgpack',
    sonicMacroCFMMAprilTestFull: '/prerun_sims/SONIC_MACRO_CFMM_APRIL_TEST_FULL.msgpack',
    sonicMacroCFMMAugTrainFull: '/prerun_sims/SONIC_MACRO_CFMM_APRIL_TRAIN_FULL.msgpack',
    sonicMacroHodlAprilTestFull: '/prerun_sims/SONIC_MACRO_HODL_APRIL_TEST_FULL.msgpack',
    sonicMacroHodlAugTrainFull: '/prerun_sims/SONIC_MACRO_HODL_APRIL_TRAIN_FULL.msgpack',
    arbitrumMacroBTFAugTrain: '/prerun_sims/ARBITRUM_MACRO_BTF_APRIL_TRAIN.msgpack',
    arbitrumMacroCFMMAugTrain: '/prerun_sims/ARBITRUM_MACRO_CFMM_APRIL_TRAIN.msgpack',
    arbitrumMacroHodlAugTrain: '/prerun_sims/ARBITRUM_MACRO_HODL_APRIL_TRAIN.msgpack',
    arbitrumMacroBTFAugTrainFull: '/prerun_sims/ARBITRUM_MACRO_BTF_APRIL_TRAIN_FULL.msgpack',
    arbitrumMacroCFMMAugTrainFull: '/prerun_sims/ARBITRUM_MACRO_CFMM_APRIL_TRAIN_FULL.msgpack',
    arbitrumMacroHodlAugTrainFull: '/prerun_sims/ARBITRUM_MACRO_HODL_APRIL_TRAIN_FULL.msgpack',
    arbitrumMacroCFMMAugTest: '/prerun_sims/ARBITRUM_MACRO_CFMM_AUG_TEST.msgpack',
    arbitrumMacroBTFAugTest: '/prerun_sims/ARBITRUM_MACRO_BTF_AUG_TEST.msgpack',
    arbitrumMacroHodlAugTest: '/prerun_sims/ARBITRUM_MACRO_HODL_AUG_TEST.msgpack',
    arbitrumMacroBTF2025Test: '/prerun_sims/ARBITRUM_MACRO_BTF_2025_TEST.msgpack',
    arbitrumMacroCFMM2025Test: '/prerun_sims/ARBITRUM_MACRO_CFMM_2025_TEST.msgpack',
    arbitrumMacroHodl2025Test: '/prerun_sims/ARBITRUM_MACRO_HODL_2025_TEST.msgpack',
    arbitrumMacroCFMMAugTestFull: '/prerun_sims/ARBITRUM_MACRO_BTF_AUG_TEST_FULL.msgpack',
    arbitrumMacroBTFAugTestFull: '/prerun_sims/ARBITRUM_MACRO_CFMM_AUG_TEST_FULL.msgpack',
    arbitrumMacroHodlAugTestFull: '/prerun_sims/ARBITRUM_MACRO_HODL_AUG_TEST_FULL.msgpack',
    arbitrumMacroBTF2025TestFull: '/prerun_sims/ARBITRUM_MACRO_BTF_2025_TEST_FULL.msgpack',
    arbitrumMacroCFMM2025TestFull: '/prerun_sims/ARBITRUM_MACRO_CFMM_2025_TEST_FULL.msgpack',
    arbitrumMacroHodl2025TestFull: '/prerun_sims/ARBITRUM_MACRO_HODL_2025_TEST_FULL.msgpack',
    truflationBitcoinBTFAugTrain:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinCFMMAugTrain:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinHodlAugTrain:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinCFMMAugTest:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinBTFAugTest:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinHodlAugTest:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinBTF2025Test:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinCFMM2025Test:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinHodl2025Test:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinBTFAugTrainFull:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinCFMMAugTrainFull:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinHodlAugTrainFull:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinCFMMAugTestFull:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinBTFAugTestFull:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinHodlAugTestFull:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinBTF2025TestFull:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinCFMM2025TestFull:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
    truflationBitcoinHodl2025TestFull:"/prerun_sims/TRUFLATION_BITCOIN_.msgpack",
  };

  const poolFilePath = poolFileMapping[poolName];

  if (!poolFilePath) {
    throw new Error(`No MessagePack file found for pool: ${poolName}`);
  }

  // Fetch the MessagePack file dynamically
  const response = await fetch(poolFilePath);
  const buffer = await response.arrayBuffer();
  const decodedData = decode(new Uint8Array(buffer));
  return convertBreakdownDtoToBreakdown(
    decodedData as SimulationRunBreakdownDto
  );
};
