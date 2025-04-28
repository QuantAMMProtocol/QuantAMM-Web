import { decode } from '@msgpack/msgpack';
import {
  ReturnTimeStep,
  SimulationRunBreakdown,
  SimulationRunBreakdownDto,
} from '../features/simulationResults/simulationResultSummaryModels';
import {
  CoinComparison,
  CoinPrice,
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
  | 'safeHavenHodlAugTrain';

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
    balancerWeighted: './prerun_sims/Balancer Weighted_ETH-USDC.msgpack',
    balancerWeightedLvr:
      './prerun_sims/LVR - Balancer Weighted_-ETH-USDC.msgpack',
    balancerWeightedRvr:
      './prerun_sims/RVR - Balancer Weighted_-ETH-USDC.msgpack',
    cowAMM: './prerun_sims/CowAMM[arb_quality_1.0]_-ETH-USDC.msgpack',
    cowAmmLvr: './prerun_sims/LVR - CowAMM_-ETH-USDC.msgpack',
    cowAmmRvr: './prerun_sims/RVR - CowAMM_-ETH-USDC.msgpack',
    gyroscope:
      './prerun_sims/Gyroscope[alpha_1000][beta_5000]_-ETH-USDC.msgpack',
    gyroscopeLvr:
      './prerun_sims/LVR - Gyroscope[alpha_1000][beta_5000]_-ETH-USDC.msgpack',
    gyroscopeRvr:
      './prerun_sims/RVR - Gyroscope[alpha_1000][beta_5000]_-ETH-USDC.msgpack',
    quantAMMMomentum:
      './prerun_sims/Momentum[k_per_day_50][memory_days_5]_-ETH-BTC-USDC.msgpack',
    quantAMMAntiMomentum:
      './prerun_sims/AntiMomentum[k_per_day_0.005][memory_days_80]_-BTC-ETH-USDC.msgpack',
    quantAMMPowerChannel:
      './prerun_sims/Power Channel[k_per_day_50][memory_days_5][exponent_1.13]_-BTC-ETH-USDC.msgpack',
    quantAMMChannelFollowing:
      './prerun_sims/Channel Following_VectorParams.msgpack',
    quantAMMMeanReversionChannel:
      './prerun_sims/Difference Momentum[k_per_day_-10,-5,5,2][memory_days_2_100,2,2,5][memory_days_1_70,1,30,15]_-BTC-ETH-PAXG-USDC.msgpack',
    hodlEthUsdc: './prerun_sims/HODL_-ETH-USDC.msgpack',
    hodlBtcEthUsdc:
      './prerun_sims/Momentum[k_per_day_50][memory_days_5]_-ETH-BTC-USDC.msgpack', // Example; replace with actual path
    solExampleMomentum: './prerun_sims/BTC-ETH-SOL-USDC-momentum-daily.msgpack',
    solExampleAntimomentum: './prerun_sims/BTC-ETH-SOL-USDC-antimomentum.msgpack',
    solExamplePowerChannel: './prerun_sims/BTC-ETH-SOL-USDC-power-channel-daily.msgpack',
    solExampleChannelFollowing:
      './prerun_sims/BTC-ETH-SOL-USDC-channel-following-daily.msgpack',
    solExampleHodl: './prerun_sims/BTC-ETH-SOL-USDC-hodl-daily.msgpack',
    solExampleWeighted:'./prerun_sims/BTC-ETH-SOL-USDC-weighted.msgpack',
    safeHavenBTF2025Test: './prerun_sims/SAFE_HAVEN_BTF_2025_TEST.msgpack',
    safeHavenBTFAugTest: './prerun_sims/SAFE_HAVEN_BTF_AUG_TEST.msgpack',
    safeHavenBTFAugTrain: './prerun_sims/SAFE_HAVEN_BTF_AUG_TRAIN.msgpack',
    safeHavenCFMM2025Test: './prerun_sims/SAFE_HAVEN_CFMM_2025_TEST.msgpack',
    safeHavenCFMMAugTest: './prerun_sims/SAFE_HAVEN_CFMM_AUG_TEST.msgpack',
    safeHavenCFMMAugTrain: './prerun_sims/SAFE_HAVEN_CFMM_AUG_TRAIN.msgpack',
    safeHavenHodl2025Test: './prerun_sims/SAFE_HAVEN_HODL_2025_TEST.msgpack',
    safeHavenHodlAugTest: './prerun_sims/SAFE_HAVEN_HODL_AUG_TEST.msgpack',
    safeHavenHodlAugTrain: './prerun_sims/SAFE_HAVEN_HODL_AUG_TRAIN.msgpack',
  };

  const poolFilePath = poolFileMapping[poolName];

  if (!poolFilePath) {
    throw new Error(`No MessagePack file found for pool: ${poolName}`);
  }

  // Fetch the MessagePack file dynamically
  const response = await fetch(poolFilePath);
  const buffer = await response.arrayBuffer();

  const decodedData = decode(new Uint8Array(buffer));
  console.log('Decoded data:', decodedData);
  console.log(convertBreakdownDtoToBreakdown(
    decodedData as SimulationRunBreakdownDto
  ));
  return convertBreakdownDtoToBreakdown(
    decodedData as SimulationRunBreakdownDto
  );
};
