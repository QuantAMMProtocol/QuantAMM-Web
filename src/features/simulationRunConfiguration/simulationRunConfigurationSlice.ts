import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  Coin,
  LiquidityPoolCoin,
  SimulationRunDateRange,
  LiquidityPool,
  CoinPrice,
  CoinComparison,
  UpdateRule,
  PoolType,
  GasStep,
  FeeHookStep,
} from './simulationRunConfigModels';
import { Guid } from 'guid-typescript';
import { SwapImport } from './simulationRunConfigModels'; // Add this line to import SwapImport
import { ConfigInitialState } from './simulationRunConfigurationInitialState';
import { ReturnTimeStep } from '../simulationResults/simulationResultSummaryModels';

const initialState = ConfigInitialState;
initialState.simulationLiquidityPools = [];
initialState.selectedUpdateRulesToSimulate = [];

export const simConfigurationSlice = createSlice({
  name: 'simRunner',
  initialState,
  reducers: {
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
      updatePoolAmounts(
        state.startDate,
        state.initialLiquidityPool.poolConstituents
      );
      updatePoolWeights(state.initialLiquidityPool.poolConstituents);
      state.simulationLiquidityPools.forEach((x) => {
        updatePoolAmounts(state.startDate, x.poolConstituents);
        updatePoolWeights(x.poolConstituents);
      });
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
    },
    setDateRange: (state, action: PayloadAction<SimulationRunDateRange>) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;

      updatePoolAmounts(
        state.startDate,
        state.initialLiquidityPool.poolConstituents
      );
      updatePoolWeights(state.initialLiquidityPool.poolConstituents);
      state.simulationLiquidityPools.forEach((x) => {
        updatePoolAmounts(state.startDate, x.poolConstituents);
        updatePoolWeights(x.poolConstituents);
      });
    },
    updatePriceHistoryLoadStatus: (state, action: PayloadAction<number>) => {
      state.status.priceHistoryLoad = action.payload;
    },
    updateSimRunStatus: (state, action: PayloadAction<number>) => {
      state.status.simulationRunProgress = action.payload;
    },
    updateSimRunStatusDescription: (state, action: PayloadAction<string>) => {
      state.status.status = action.payload;
    },
    setPoolCoinNumeraire: (state, action: PayloadAction<string>) => {
      state.initialLiquidityPool.poolNumeraireCoinCode = action.payload;
    },
    setSelectedInitialCoinAmount: (
      state,
      action: PayloadAction<number | undefined | null>
    ) => {
      if (action.payload != undefined && action.payload != null) {
        state.selectedInitialCoinMarketValue = action.payload;
      }
    },
    updateConsitutentMarketValue: (
      state,
      action: PayloadAction<{ poolCoin: LiquidityPoolCoin; newMV: number }>
    ) => {
      const constituent = state.initialLiquidityPool.poolConstituents.find(
        (x) => x.coin.coinCode == action.payload.poolCoin.coin.coinCode
      );
      if (constituent != undefined) {
        constituent.marketValue = action.payload.newMV;
      }

      updatePoolAmounts(
        state.startDate,
        state.initialLiquidityPool.poolConstituents
      );
      updatePoolWeights(state.initialLiquidityPool.poolConstituents);
      state.simulationLiquidityPools.forEach((x) => {
        updatePoolAmounts(state.startDate, x.poolConstituents);
        updatePoolWeights(x.poolConstituents);
      });
    },
    upsertSelectedCoins: (state, action: PayloadAction<string>) => {
      const availableCoin = state.availableCoins.find(
        (x) => x.coinCode == action.payload
      );
      const foundCoin = state.selectedCoinsToAddToPool.find(
        (x) => x.coinCode == availableCoin?.coinCode
      );
      if (foundCoin == undefined && availableCoin != undefined) {
        state.selectedCoinsToAddToPool.push(availableCoin);
      }
      if (
        state.selectedCoinsToAddToPool.length > 2 &&
        state.selectedSimplifiedPools.length > 0
      ) {
        state.selectedSimplifiedPools = state.selectedSimplifiedPools.filter(
          (x) =>
            x.toLowerCase().indexOf('cow') == -1 &&
            x.toLowerCase().indexOf('gyroscope') == -1
        );
      }
    },
    updateCoinPriceHistoryLoadedStatus: (
      state,
      action: PayloadAction<string>
    ) => {
      state.coinPriceHistoryLoadedStatus = action.payload;
    },

    updateCoinLoadStatus: (state, action: PayloadAction<string>) => {
      state.coinLoadStatus.push(action.payload);
    },
    removeSelectedCoins: (state, action: PayloadAction<string>) => {
      state.selectedCoinsToAddToPool = state.selectedCoinsToAddToPool.filter(
        (x) => x.coinCode != action.payload
      );
    },
    upsertSelectedSimplifiedPool: (state, action: PayloadAction<string>) => {
      if (
        state.selectedSimplifiedPools.filter((x) => x == action.payload)
          .length == 0 &&
        (state.selectedCoinsToAddToPool.length <= 2 ||
          (state.selectedCoinsToAddToPool.length > 2 &&
            action.payload.indexOf('cow') == -1) ||
          action.payload.toLowerCase().indexOf('gyroscope') == -1)
      ) {
        state.selectedSimplifiedPools.push(action.payload);
      }
    },
    removeSelectedSimplifiedPool: (state, action: PayloadAction<string>) => {
      state.selectedSimplifiedPools = state.selectedSimplifiedPools.filter(
        (x) => x != action.payload
      );
    },
    addSimplifiedSelectionsToSimulatorPools: (state) => {
      const constituentProportion = 1 / state.selectedCoinsToAddToPool.length;
      const totalPoolDollarValue = 10000000;
      const tokenMarketValue = totalPoolDollarValue / constituentProportion;
      state.initialLiquidityPool.poolConstituents = [];

      for (const newConstituent of state.selectedCoinsToAddToPool) {
        const availableCoin = state.availableCoins.find(
          (x) => x.coinCode == newConstituent.coinCode
        );
        if (availableCoin != undefined) {
          const newCurrentPrice = getCurrentPrice(
            availableCoin,
            state.startDate
          );
          if (newCurrentPrice != undefined) {
            const newPoolConstituent: LiquidityPoolCoin = {
              currentPrice: newCurrentPrice?.close,
              currentPriceUnix: newCurrentPrice.closeUnix,
              amount: tokenMarketValue / newCurrentPrice?.close,
              marketValue: tokenMarketValue,
              coin: newConstituent,
              weight: 0,
              factorValue: null,
            };
            state.initialLiquidityPool.poolConstituents.push(
              newPoolConstituent
            );
          }
        }
      }

      state.selectedSimplifiedPools.forEach((poolSimplified) => {
        const foundRule = state.availableUpdateRules.find(
          (x) =>
            x.updateRuleName == poolSimplified ||
            x.applicablePoolTypes[0] + ': ' + x.updateRuleName == poolSimplified
        );
        if (
          foundRule != undefined &&
          foundRule.updateRuleName !=
            state.initialLiquidityPool.updateRule.updateRuleName
        ) {
          state.initialLiquidityPool.updateRule = foundRule;
        }
        const poolLength = state.simulationLiquidityPools.length;
        const liquidityPool: LiquidityPool =
          createLiquidityPoolFromInitialPool();
        liquidityPool.enableAutomaticArbBots = true;

        state.simulationLiquidityPools.push(liquidityPool);

        const originalUpdateRule = state.initialLiquidityPool.updateRule;

        if (state.simulationSimplifiedIncludeLvrRuns) {
          const lvrEquivalentRule = state.availableUpdateRules.find(
            (x) =>
              x.applicablePoolTypes[0] ==
                'LVR for ' + liquidityPool.updateRule.applicablePoolTypes[0] &&
              x.updateRuleName == 'LVR - ' + originalUpdateRule.updateRuleName
          );

          if (
            lvrEquivalentRule != undefined &&
            lvrEquivalentRule.updateRuleName !=
              state.initialLiquidityPool.updateRule.updateRuleName
          ) {
            state.initialLiquidityPool.updateRule = lvrEquivalentRule;
            const lvrPool: LiquidityPool = createLiquidityPoolFromInitialPool();
            lvrPool.enableAutomaticArbBots = true;
            state.simulationLiquidityPools.push(lvrPool);
          }
        }

        if (state.simulationSimplifiedIncludeRvrRuns) {
          const rvrEquivalentRule = state.availableUpdateRules.find(
            (x) =>
              x.applicablePoolTypes[0] ==
                'RVR for ' + liquidityPool.updateRule.applicablePoolTypes[0] &&
              x.updateRuleName == 'RVR - ' + originalUpdateRule.updateRuleName
          );

          if (
            rvrEquivalentRule != undefined &&
            rvrEquivalentRule.updateRuleName !=
              state.initialLiquidityPool.updateRule.updateRuleName
          ) {
            state.initialLiquidityPool.updateRule = rvrEquivalentRule;
            const rvrPool: LiquidityPool = createLiquidityPoolFromInitialPool();
            rvrPool.enableAutomaticArbBots = true;
            state.simulationLiquidityPools.push(rvrPool);
          }
        }

        function createLiquidityPoolFromInitialPool(): LiquidityPool {
          return {
            id:
              poolLength > 0
                ? state.simulationLiquidityPools[poolLength - 1].id + 1
                : '1',
            name:
              poolLength > 0
                ? state.simulationLiquidityPools[poolLength - 1].name +
                  poolLength
                : 'pool',
            runStatus: 'pending',
            poolNumeraireCoinCode:
              state.initialLiquidityPool.poolNumeraireCoinCode,
            enableAutomaticArbBots:
              state.initialLiquidityPool.enableAutomaticArbBots,
            poolConstituents: state.initialLiquidityPool.poolConstituents,
            updateRule: state.initialLiquidityPool.updateRule,
            poolType: state.availablePoolTypes?.find(
              (x) =>
                x.name ==
                (state.initialLiquidityPool.updateRule.applicablePoolTypes[0] ??
                  '')
            ) ?? {
              name: 'unknown',
              shortDescription: 'unknown',
              mandatoryProperties: [],
              requiresPoolNumeraire:
                state.initialLiquidityPool.poolType.requiresPoolNumeraire,
            },
            swapImports: [],
            feeHooks: [],
          };
        }
      });
    },
    clearSelectedCoins: (state) => {
      state.selectedCoinsToAddToPool = [];
    },
    deleteConstituent: (state, action: PayloadAction<LiquidityPoolCoin>) => {
      state.initialLiquidityPool.poolConstituents =
        state.initialLiquidityPool.poolConstituents.filter(
          (x) => x.coin.coinCode != action.payload.coin.coinCode
        );
      updatePoolWeights(state.initialLiquidityPool.poolConstituents);
    },
    setUpdateRule: (state, action: PayloadAction<string>) => {
      const foundRule = state.availableUpdateRules.find(
        (x) => x.updateRuleName == action.payload
      );
      if (
        foundRule != undefined &&
        foundRule.updateRuleName !=
          state.initialLiquidityPool.updateRule.updateRuleName
      ) {
        state.initialLiquidityPool.updateRule = foundRule;
      }
    },
    setPoolType: (state, action: PayloadAction<string>) => {
      const foundType = state.availablePoolTypes.find(
        (x) => x.name == action.payload
      );
      if (
        foundType != undefined &&
        foundType.name != state.initialLiquidityPool.poolType.name
      ) {
        state.initialLiquidityPool.poolType = foundType;
        if (foundType.name == 'HODL') {
          setUpdateRule('HODL');
        } else if (foundType.name == 'Balancer Weighted Pool') {
          setUpdateRule('Balancer');
        } else if (foundType.name == 'CowAMM') {
          setUpdateRule('CowAMM');
        }

        if (foundType.requiresPoolNumeraire) {
          if (state.initialLiquidityPool.poolConstituents.length > 0) {
            state.initialLiquidityPool.poolNumeraireCoinCode =
              state.initialLiquidityPool.poolConstituents[0].coin.coinCode;
          } else {
            state.initialLiquidityPool.poolNumeraireCoinCode = '';
          }
        } else {
          state.initialLiquidityPool.poolNumeraireCoinCode = '';
        }
      }
    },
    updateCoinComparisons: (
      state,
      action: PayloadAction<Map<string, CoinComparison>>
    ) => {
      state.availableCoins.forEach((x) => {
        x.coinComparisons = action.payload;
      });
    },
    updateCoinPriceHistoryLoaded: (state, action: PayloadAction<boolean>) => {
      state.coinPriceHistoryLoaded = action.payload;
    },
    updateCoinPriceHistory: (state, action: PayloadAction<Coin>) => {
      const availableCoin = state.availableCoins.find(
        (x) => x.coinCode == action.payload.coinCode
      );
      if (availableCoin != undefined) {
        availableCoin.dailyPriceHistoryMap =
          action.payload.dailyPriceHistoryMap;
        availableCoin.dailyPriceHistory = action.payload.dailyPriceHistory;
        availableCoin.dailyReturns = action.payload.dailyReturns;
      } else {
        state.availableCoins.push(action.payload);
      }
      for (const pool of state.simulationLiquidityPools) {
        const availableSimCoin = pool.poolConstituents.find(
          (x) => x.coin.coinCode == action.payload.coinCode
        );
        if (availableSimCoin != undefined) {
          availableSimCoin.coin.dailyPriceHistoryMap =
            action.payload.dailyPriceHistoryMap;
          availableSimCoin.coin.dailyPriceHistory =
            action.payload.dailyPriceHistory;
          availableSimCoin.coin.dailyReturns = action.payload.dailyReturns;
        }
      }

      const availableSimCoin = state.initialLiquidityPool.poolConstituents.find(
        (x) => x.coin.coinCode == action.payload.coinCode
      );
      if (availableSimCoin != undefined) {
        availableSimCoin.coin.dailyPriceHistoryMap =
          action.payload.dailyPriceHistoryMap;
        availableSimCoin.coin.dailyPriceHistory =
          action.payload.dailyPriceHistory;
        availableSimCoin.coin.dailyReturns = action.payload.dailyReturns;
      }

      updatePoolAmounts(
        state.startDate,
        state.initialLiquidityPool.poolConstituents
      );
      updatePoolWeights(state.initialLiquidityPool.poolConstituents);
      state.simulationLiquidityPools.forEach((x) =>
        updatePoolAmounts(state.startDate, x.poolConstituents)
      );
    },
    updateLiquidityPoolConstituents: (state) => {
      state.selectedInitialCoinMarketValue =
        state.selectedInitialCoinMarketValue ?? 0;
      for (const newConstituent of state.selectedCoinsToAddToPool) {
        const constituent = state.initialLiquidityPool.poolConstituents.find(
          (x) => x.coin.coinCode == newConstituent.coinCode
        );
        if (constituent != undefined) {
          constituent.marketValue = state.selectedInitialCoinMarketValue;
        } else {
          const availableCoin = state.availableCoins.find(
            (x) => x.coinCode == newConstituent.coinCode
          );
          if (availableCoin != undefined) {
            const newCurrentPrice = getCurrentPrice(
              availableCoin,
              state.startDate
            );
            if (newCurrentPrice != undefined) {
              const newPoolConstituent: LiquidityPoolCoin = {
                currentPrice: newCurrentPrice?.close,
                currentPriceUnix: newCurrentPrice.closeUnix,
                amount:
                  state.selectedInitialCoinMarketValue / newCurrentPrice?.close,
                marketValue: state.selectedInitialCoinMarketValue ?? 0,
                coin: newConstituent,
                weight: 0,
                factorValue:
                  state?.initialLiquidityPool?.updateRule
                    ?.updateRuleParameters[0]?.factorValue ?? null,
              };
              state.initialLiquidityPool.poolConstituents.push(
                newPoolConstituent
              );
            }
          }
        }
      }
      updatePoolAmounts(
        state.startDate,
        state.initialLiquidityPool.poolConstituents
      );
      updatePoolWeights(state.initialLiquidityPool.poolConstituents);
      state.selectedCoinsToAddToPool = [];
      state.selectedInitialCoinMarketValue = 0;
    },
    addToSim: (state) => {
      const newPool = clonePool(state.initialLiquidityPool);
      state.simulationLiquidityPools.push(newPool);
    },
    changeSimulationSimplifiedIncludeLvrRuns: (state) => {
      state.simulationSimplifiedIncludeLvrRuns =
        !state.simulationSimplifiedIncludeLvrRuns;
    },
    changeSimulationSimplifiedIncludeRvRuns: (state) => {
      state.simulationSimplifiedIncludeRvrRuns =
        !state.simulationSimplifiedIncludeRvrRuns;
    },
    addGasSteps: (state, action: PayloadAction<{ gas: GasStep[] }>) => {
      state.gasPriceImport = action.payload.gas;
    },
    addSwapImportToPools: (
      state,
      action: PayloadAction<{ swapImports: SwapImport[] }>
    ) => {
      state.simulationLiquidityPools.forEach((x) => {
        x.swapImports = action.payload.swapImports;
      });
    },
    addFixedFeeToPool: (
      state,
      action: PayloadAction<{
        fixedFee: number;
        poolId: string;
        feeHookName: string;
      }>
    ) => {
      const targetPool = state.simulationLiquidityPools.find(
        (x) => x.id == action.payload.poolId
      );

      if (targetPool == undefined) {
        return;
      }

      targetPool.feeHooks = targetPool.feeHooks.filter(
        (x) => x.hookName != action.payload.feeHookName
      );

      const unixValues = targetPool.poolConstituents
        .map((x) => x.coin.dailyPriceHistory.map((y) => y.unix))
        .flat();

      targetPool.feeHooks.push({
        hookName: action.payload.feeHookName,
        hookTargetTokens: targetPool.poolConstituents.map(
          (x) => x.coin.coinCode
        ),
        hookTimeSteps: unixValues.map((x) => {
          return {
            unix: x,
            value: action.payload.fixedFee,
          };
        }),
        minValue: 0,
        maxValue: 0,
        unit: 'bps',
      });
    },
    addFeeHooksToPool(
      state,
      action: PayloadAction<{
        feeHookName: string;
        poolId: string;
        fees: FeeHookStep[];
      }>
    ) {
      const targetPool = state.simulationLiquidityPools.find(
        (x) => x.id == action.payload.poolId
      );

      if (targetPool == undefined) {
        return;
      }

      targetPool.feeHooks = targetPool.feeHooks.filter(
        (x) => x.hookName != action.payload.feeHookName
      );

      targetPool.feeHooks.push({
        hookName: action.payload.feeHookName,
        hookTargetTokens: targetPool.poolConstituents.map(
          (x) => x.coin.coinCode
        ),
        hookTimeSteps: action.payload.fees,
        minValue: 0,
        maxValue: 0,
        unit: 'bps',
      });
    },
    generateAndAddPoolToSim: (
      state,
      action: PayloadAction<{
        updateRule: UpdateRule;
        poolConstituents: LiquidityPoolCoin[];
        poolType: PoolType;
        enableAutomaticArbBots: boolean;
        id: string;
      }>
    ) => {
      const poolLength = state.simulationLiquidityPools.length;
      const liquidityPool: LiquidityPool = {
        id:
          action.payload.id != ''
            ? action.payload.id
            : poolLength > 0
              ? state.simulationLiquidityPools[poolLength - 1].id + 1
              : '1',
        name:
          poolLength > 0
            ? state.simulationLiquidityPools[poolLength - 1].name + poolLength
            : 'pool',
        runStatus: 'pending',
        enableAutomaticArbBots: action.payload.enableAutomaticArbBots,
        poolNumeraireCoinCode: state.initialLiquidityPool.poolNumeraireCoinCode,
        poolConstituents: action.payload.poolConstituents,
        updateRule: action.payload.updateRule,
        poolType: action.payload.poolType,
        swapImports: [],
        feeHooks: [],
      };
      state.simulationLiquidityPools.push(liquidityPool);
    },
    removeSim: (state, action: PayloadAction<string>) => {
      state.simulationLiquidityPools = state.simulationLiquidityPools.filter(
        (x) => x.id != action.payload
      );
    },
    resetSims: (state) => {
      state.simulationRunning = false;
      state.status.status = 'Pending';
      state.status.simulationRunProgress = 0;
      state.simulationLiquidityPools = [];
      state.gasPriceImport = [];
    },
    runSimulation: (state) => {
      state.simulationLiquidityPools.forEach((x) => {
        x.poolConstituents = state.initialLiquidityPool.poolConstituents;
      });

      state.simulationRunning = true;
    },
    stopSimulation: (state) => {
      state.simulationRunning = true;
    },
  },
});

export const clonePool = (originalPool: LiquidityPool): LiquidityPool => {
  return {
    id: Guid.create().toString(),
    name: originalPool.name,
    enableAutomaticArbBots: originalPool.enableAutomaticArbBots,
    poolNumeraireCoinCode: originalPool.poolNumeraireCoinCode,
    runStatus: originalPool.runStatus,
    poolConstituents: originalPool.poolConstituents.map((x) => {
      return {
        coin:
          originalPool.updateRule.updateRuleRunUrl == undefined
            ? x.coin
            : {
                coinName:
                  originalPool.poolConstituents.find(
                    (z) => z.coin.coinCode == x.coin.coinCode
                  )?.coin.coinName ?? x.coin.coinCode,
                coinCode: x.coin.coinCode,
                dailyPriceHistory: [],
                dailyPriceHistoryMap: new Map<number, CoinPrice>(),
                dailyReturns: new Map<number, ReturnTimeStep>(),
                deploymentByChain: x.coin.deploymentByChain,
                coinComparisons: new Map<string, CoinComparison>(),
              },
        amount: x.amount,
        marketValue: x.marketValue,
        currentPrice: x.currentPrice,
        currentPriceUnix: x.currentPriceUnix,
        weight: x.weight,
        factorValue: x.factorValue,
      };
    }),
    poolType: originalPool.poolType,
    swapImports: originalPool.swapImports,
    feeHooks: originalPool.feeHooks,
    updateRule: {
      updateRuleName: originalPool.updateRule.updateRuleName,
      updateRuleRunUrl: originalPool.updateRule.updateRuleRunUrl,
      updateRuleTrainUrl: originalPool.updateRule.updateRuleTrainUrl,
      applicablePoolTypes: originalPool.updateRule.applicablePoolTypes,
      chainDeploymentDetails: originalPool.updateRule.chainDeploymentDetails,
      updateRuleResultProfileSummary:
        originalPool.updateRule.updateRuleResultProfileSummary,
      heatmapKeys: originalPool.updateRule.heatmapKeys,
      updateRuleSimKey: originalPool.updateRule.updateRuleSimKey,
      updateRuleKey:
        originalPool.updateRule.updateRuleName +
        (originalPool.updateRule.updateRuleParameters.length > 0
          ? originalPool.updateRule.updateRuleParameters
              .filter(
                (y) =>
                  y.factorName != 'chunk_period' &&
                  y.factorName != 'weight_interpolation_period'
              ) //not interesting from a result perspective
              .reduce<string>((accumulator, current) => {
                if (current.applicableCoins.length > 0) {
                  const sortedArray = [...current.applicableCoins];
                  return (
                    accumulator +
                    '[' +
                    current.factorName +
                    ':' +
                    sortedArray
                      .sort((a, b) =>
                        a.coin.coinCode.localeCompare(b.coin.coinCode)
                      )
                      .map((x) => x.factorValue)
                      .join(',') +
                    ']'
                  );
                }
                return (
                  accumulator +
                  '[' +
                  current.factorName +
                  ':' +
                  current.factorValue +
                  ']'
                );
              }, '')
          : ''),
      updateRuleParameters: originalPool.updateRule.updateRuleParameters.map(
        (x) => {
          return {
            factorName: x.factorName,
            factorDisplayName: x.factorDisplayName,
            factorDescription: x.factorDescription,
            factorValue: x.factorValue,
            minValue: x.minValue,
            maxValue: x.maxValue,
            smartContractSortOrder: x.smartContractSortOrder,
            applicableCoins: x.applicableCoins.map((x) => x),
          };
        }
      ),
    },
  };
};

export const updatePoolAmounts = (
  currentDate: string,
  poolConstituents: LiquidityPoolCoin[]
) => {
  poolConstituents.forEach((x) => {
    const currentPrice = getCurrentPrice(x.coin, currentDate);
    if (currentPrice != undefined && x.marketValue != undefined) {
      x.currentPrice = currentPrice?.close;
      x.currentPriceUnix = currentPrice?.closeUnix;
      x.amount = x.marketValue / x.currentPrice;
    }
  });
};

export const updatePoolWeights = (poolConstituents: LiquidityPoolCoin[]) => {
  const initialValue = 0;
  const totalMarketValue = poolConstituents.reduce((prev, current) => {
    return prev + (current.marketValue ?? 0);
  }, initialValue);
  if (totalMarketValue > 0) {
    poolConstituents.forEach((x) => {
      if (x.marketValue) {
        x.weight = (x.marketValue / totalMarketValue) * 100;
      }
    });
  }
};

export const getCurrentPrice = (
  targetCoin: Coin,
  currentDate: string
): { close: number; closeUnix: number } | undefined => {
  let applicablePrices = targetCoin.dailyPriceHistory.filter(
    (y) => y.unix >= new Date(currentDate).getTime()
  );
  applicablePrices = applicablePrices.sort((a, b) => {
    return a.unix - b.unix;
  });
  if (applicablePrices.length > 0) {
    return {
      close: applicablePrices[0].close,
      closeUnix: applicablePrices[0].unix,
    };
  } else {
    let applicablePrices = targetCoin.dailyPriceHistory.filter(
      (y) => y.unix > new Date(currentDate).getTime() / 1000
    );
    applicablePrices = applicablePrices.sort((a, b) => {
      return a.unix - b.unix;
    });
    if (applicablePrices.length > 0) {
      return {
        close: applicablePrices[0].close,
        closeUnix: applicablePrices[0].unix,
      };
    }
  }
};

export const clonePoolFingerPrint = (
  originalPool: LiquidityPool,
  updateRuleSimKey: string
): LiquidityPool => {
  return {
    id: Guid.create().toString(),
    name: originalPool.name,
    runStatus: originalPool.runStatus,
    enableAutomaticArbBots: originalPool.enableAutomaticArbBots,
    poolNumeraireCoinCode: originalPool.poolNumeraireCoinCode,
    poolConstituents: originalPool.poolConstituents.map((x) => {
      return {
        coin:
          originalPool.updateRule.updateRuleRunUrl == undefined
            ? x.coin
            : {
                coinName:
                  originalPool.poolConstituents.find(
                    (z) => z.coin.coinCode == x.coin.coinCode
                  )?.coin.coinName ?? x.coin.coinCode,
                coinCode: x.coin.coinCode,
                dailyPriceHistory: [],
                dailyPriceHistoryMap: new Map<number, CoinPrice>(),
                dailyReturns: new Map<number, ReturnTimeStep>(),
                deploymentByChain: x.coin.deploymentByChain,
                coinComparisons: new Map<string, CoinComparison>(),
              },
        amount: x.amount,
        factorValue: x.factorValue,
        marketValue: x.marketValue,
        currentPrice: x.currentPrice,
        currentPriceUnix: x.currentPriceUnix,
        weight: x.weight,
      };
    }),
    poolType: originalPool.poolType,
    swapImports: originalPool.swapImports,
    feeHooks: originalPool.feeHooks,
    updateRule: {
      updateRuleName: originalPool.updateRule.updateRuleName,
      updateRuleRunUrl: originalPool.updateRule.updateRuleRunUrl,
      updateRuleTrainUrl: originalPool.updateRule.updateRuleTrainUrl,
      applicablePoolTypes: originalPool.updateRule.applicablePoolTypes,
      chainDeploymentDetails: originalPool.updateRule.chainDeploymentDetails,
      updateRuleResultProfileSummary:
        originalPool.updateRule.updateRuleResultProfileSummary,
      heatmapKeys: originalPool.updateRule.heatmapKeys,
      updateRuleSimKey: updateRuleSimKey,
      updateRuleKey:
        originalPool.updateRule.updateRuleName +
        (originalPool.updateRule.updateRuleParameters.length > 0
          ? originalPool.updateRule.updateRuleParameters
              .filter(
                (y) =>
                  y.factorName != 'chunk_period' &&
                  y.factorName != 'weight_interpolation_period'
              ) //not interesting from a result perspective
              .reduce<string>((accumulator, current) => {
                if (current.applicableCoins.length > 0) {
                  const sortedArray = [...current.applicableCoins];
                  return (
                    accumulator +
                    '[' +
                    current.factorName +
                    ':' +
                    sortedArray
                      .sort((a, b) =>
                        a.coin.coinCode.localeCompare(b.coin.coinCode)
                      )
                      .map((x) => x.factorValue)
                      .join(',') +
                    ']'
                  );
                }
                return (
                  accumulator +
                  '[' +
                  current.factorName +
                  ':' +
                  current.factorValue +
                  ']'
                );
              }, '')
          : ''),
      updateRuleParameters: originalPool.updateRule.updateRuleParameters.map(
        (x) => {
          return {
            factorName: x.factorName,
            factorDisplayName: x.factorDisplayName,
            factorDescription: x.factorDescription,
            factorValue: x.factorValue,
            minValue: x.minValue,
            maxValue: x.maxValue,
            smartContractSortOrder: x.smartContractSortOrder,
            applicableCoins: x.applicableCoins.map((x) => x),
          };
        }
      ),
    },
  };
};

export const {
  setStartDate,
  setEndDate,
  updateConsitutentMarketValue,
  deleteConstituent,
  setUpdateRule,
  setPoolType,
  updateCoinPriceHistory,
  runSimulation,
  upsertSelectedSimplifiedPool,
  removeSelectedSimplifiedPool,
  upsertSelectedCoins,
  removeSelectedCoins,
  clearSelectedCoins,
  setSelectedInitialCoinAmount,
  updateLiquidityPoolConstituents,
  setDateRange,
  addToSim,
  generateAndAddPoolToSim,
  addSimplifiedSelectionsToSimulatorPools,
  removeSim,
  resetSims,
  updateCoinLoadStatus,
  updateCoinPriceHistoryLoadedStatus,
  updateCoinPriceHistoryLoaded,
  updateCoinComparisons,
  addGasSteps,
  addSwapImportToPools,
  addFeeHooksToPool,
  changeSimulationSimplifiedIncludeLvrRuns,
  changeSimulationSimplifiedIncludeRvRuns,
  addFixedFeeToPool,
  setPoolCoinNumeraire,
} = simConfigurationSlice.actions;

export const selectRequiredPoolNumeraire = (state: RootState) =>
  state.simConfig.initialLiquidityPool.poolType.requiresPoolNumeraire;
export const selectPoolNumeraire = (state: RootState) =>
  state.simConfig.initialLiquidityPool.poolNumeraireCoinCode;
export const selectCoinPriceDataLoaded = (state: RootState) =>
  state.simConfig.coinPriceHistoryLoaded;
export const selectStartDate = (state: RootState) => state.simConfig.startDate;
export const selectEndDate = (state: RootState) => state.simConfig.endDate;
export const selectSimRunning = (state: RootState) =>
  state.simConfig.simulationRunning;
export const selectCoinLoadStatus = (state: RootState) =>
  state.simConfig.coinLoadStatus;
export const selectCoinPriceHistoryLoadedStatus = (state: RootState) =>
  state.simConfig.coinPriceHistoryLoadedStatus;
export const selectPoolConstituents = (state: RootState) =>
  state.simConfig.initialLiquidityPool.poolConstituents;
export const selectUpdateRule = (state: RootState) =>
  state.simConfig.initialLiquidityPool.updateRule;
export const selectPoolType = (state: RootState) =>
  state.simConfig.initialLiquidityPool.poolType;
export const selectAvailableCoins = (state: RootState) =>
  state.simConfig.availableCoins;
export const selectAvailableCoinLength = (state: RootState) =>
  state.simConfig.availableCoins.length;
export const selectAvailableUpdateRules = (state: RootState) =>
  state.simConfig.availableUpdateRules;
export const selectAvailablePoolTypes = (state: RootState) =>
  state.simConfig.availablePoolTypes;
export const selectSwapImports = (state: RootState) => {
  if (state.simConfig.simulationLiquidityPools.length > 0) {
    return state.simConfig.simulationLiquidityPools[0].swapImports;
  }
  return [];
};
export const selectGasSteps = (state: RootState) => {
  return state.simConfig.gasPriceImport;
};

export const maxInitialPoolConstituentAvailableDate = (state: RootState) => {
  let defaultEndDate = 0;
  state.simConfig.initialLiquidityPool.poolConstituents.forEach((x) => {
    const maxUnixDate = Math.max(
      ...x.coin.dailyPriceHistory.map((price) => price.unix)
    );
    if (maxUnixDate > defaultEndDate) {
      defaultEndDate = maxUnixDate;
    }
  });
  if (defaultEndDate == 0) {
    defaultEndDate = new Date('2025-07-01').getTime() / 1000;
  }

  return new Date(defaultEndDate * 1000).toISOString().split('T')[0];
};
export const minInitialPoolConstituentAvailableDate = (state: RootState) => {
  let defaultStartDate = Number.MAX_SAFE_INTEGER;
  state.simConfig.initialLiquidityPool.poolConstituents.forEach((x) => {
    const minUnixDate = Math.min(
      ...x.coin.dailyPriceHistory.map((price) => price.unix)
    );
    if (minUnixDate < defaultStartDate) {
      defaultStartDate = minUnixDate;
    }
  });
  if (defaultStartDate == Number.MAX_SAFE_INTEGER) {
    defaultStartDate = new Date('2000-01-01').getTime() / 1000;
  }

  return new Date(defaultStartDate * 1000).toISOString().split('T')[0];
};

export const selectSimulationSimplifiedIncludeLvrRuns = (state: RootState) =>
  state.simConfig.simulationSimplifiedIncludeLvrRuns;

export const selectSimulationSimplifiedIncludeRvrRuns = (state: RootState) =>
  state.simConfig.simulationSimplifiedIncludeRvrRuns;

export const selectSimplifiedPoolVariations = (state: RootState) => {
  const simplifiedVariations: string[] = [];

  state.simConfig.availableUpdateRules
    .filter(
      (x) =>
        x.updateRuleKey.indexOf('lvr__') == -1 &&
        x.updateRuleKey.indexOf('rvr__') == -1
    )
    .forEach((x) => {
      x.applicablePoolTypes?.forEach((y) => {
        if (y.toLowerCase() != x.updateRuleName.toLowerCase()) {
          simplifiedVariations.push(y + ': ' + x.updateRuleName);
        } else {
          simplifiedVariations.push(y);
        }
      });
    });

  return simplifiedVariations;
};
export const selectPoolConstituentLength = (state: RootState) =>
  state.simConfig.initialLiquidityPool.poolConstituents.length;
export const selectedInitialCoinMarketValue = (state: RootState) =>
  state.simConfig.selectedInitialCoinMarketValue;
export const selectSimulationPools = (state: RootState) =>
  state.simConfig.simulationLiquidityPools;
export const selectTrainingParameters = (state: RootState) =>
  state.simConfig.trainingParameters;
export const selectSelectedCoinsToAddToPool = (state: RootState) =>
  state.simConfig.selectedCoinsToAddToPool;

export const selectedSimplifiedPools = (state: RootState) =>
  state.simConfig.selectedSimplifiedPools;

export const selectPoolTypeDefaultUpdateRule = (
  state: RootState,
  poolType: string
) => {
  if (poolType == 'QuantAMM') {
    return state.simConfig.availableUpdateRules.find(
      (x) => x.updateRuleName == 'Momentum'
    );
  } else {
    return state.simConfig.availableUpdateRules.find((x) =>
      x.applicablePoolTypes.find((y) => y == poolType)
    );
  }
};

export default simConfigurationSlice.reducer;
