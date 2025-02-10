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
  | 'hodlBtcEthUsdc';

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
  };

  const poolFilePath = poolFileMapping[poolName];

  if (!poolFilePath) {
    throw new Error(`No MessagePack file found for pool: ${poolName}`);
  }

  // Fetch the MessagePack file dynamically
  const response = await fetch(poolFilePath);
  console.log('response', response);
  const buffer = await response.arrayBuffer();
  console.log('buffer', buffer);
  const decodedData = decode(new Uint8Array(buffer));
  console.log('decodedata', decodedData);

  return convertBreakdownDtoToBreakdown(
    decodedData as SimulationRunBreakdownDto
  );
};
