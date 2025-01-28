import { ReturnTimeStep } from '../simulationResults/simulationResultSummaryModels';
import { findLastAvailableReturn } from '../simulationResults/simulationReturnCalculator';
import { CoinComparison } from '../simulationRunConfiguration/simulationRunConfigModels';

export function CalculateCoinComparison(
  coinAReturns: ReturnTimeStep[],
  coinBReturns: ReturnTimeStep[]
): CoinComparison {
  const tr = calculateTrackingError(coinAReturns, coinBReturns);
  const covar = calculateCovariance(coinAReturns, coinBReturns);

  return {
    trackingError: tr,
    covariance: covar,
  };
}

//tracking error
export function calculateTrackingError(
  rPortfolio: ReturnTimeStep[],
  rBenchmark: ReturnTimeStep[]
): number {
  const rPortfolioMax = rPortfolio.sort((a, b) => (a.unix > b.unix ? -1 : 1))[0]
    .unix;
  const rBenchmarkMax = rBenchmark.sort((a, b) => (a.unix > b.unix ? -1 : 1))[0]
    .unix;
  const rPortfolioMin = rPortfolio.sort((a, b) => (a.unix < b.unix ? -1 : 1))[0]
    .unix;
  const rBenchmarkMin = rBenchmark.sort((a, b) => (a.unix < b.unix ? -1 : 1))[0]
    .unix;

  let rangeMin = rPortfolioMin;
  if (rangeMin < rBenchmarkMin) {
    rangeMin = rBenchmarkMin;
  }
  let rangeMax = rPortfolioMax;
  if (rangeMax > rBenchmarkMax) {
    rangeMax = rBenchmarkMax;
  }

  const comparisonRPortfolio = rPortfolio
    .filter((x) => rangeMin < x.unix && rangeMax > x.unix)
    .sort((a, b) => (a.unix < b.unix ? -1 : 1));
  const comparionRBenchmark = rBenchmark
    .filter((x) => rangeMin < x.unix && rangeMax > x.unix)
    .sort((a, b) => (a.unix < b.unix ? -1 : 1));

  const rPortfolioMean =
    comparisonRPortfolio
      .map((x) => x.return)
      .reduce<number>((accumulator, current) => {
        return accumulator + current;
      }, 0) / comparisonRPortfolio.length;

  const rBenchmarkMean =
    comparionRBenchmark
      .map((x) => x.return)
      .reduce<number>((accumulator, current) => {
        return accumulator + current;
      }, 0) / comparionRBenchmark.length;

  const meanDif = rPortfolioMean - rBenchmarkMean;
  const numerator = comparisonRPortfolio
    .map((x) => {
      let rbEquiv = findLastAvailableReturn(
        comparionRBenchmark,
        x.unix,
        1,
        604800000 /*daily*/
      )?.return;

      if (rbEquiv == undefined) {
        rbEquiv = x.return;
      }

      return Math.pow((x.return - rbEquiv - meanDif) * 100, 2);
    })
    .reduce<number>((accumulator, current) => {
      return accumulator + current;
    }, 0);

  return Math.sqrt(numerator / comparisonRPortfolio.length);
}

//covariance
export function calculateCovariance(
  rPortfolio: ReturnTimeStep[],
  rBenchmark: ReturnTimeStep[]
) {
  const rPortfolioMax = rPortfolio.sort((a, b) => (a.unix > b.unix ? -1 : 1))[0]
    .unix;
  const rBenchmarkMax = rBenchmark.sort((a, b) => (a.unix > b.unix ? -1 : 1))[0]
    .unix;
  const rPortfolioMin = rPortfolio.sort((a, b) => (a.unix < b.unix ? -1 : 1))[0]
    .unix;
  const rBenchmarkMin = rBenchmark.sort((a, b) => (a.unix < b.unix ? -1 : 1))[0]
    .unix;

  let rangeMin = rPortfolioMin;
  if (rangeMin < rBenchmarkMin) {
    rangeMin = rBenchmarkMin;
  }
  let rangeMax = rPortfolioMax;
  if (rangeMax > rBenchmarkMax) {
    rangeMax = rBenchmarkMax;
  }

  const comparisonRPortfolio = rPortfolio
    .filter((x) => rangeMin < x.unix && rangeMax > x.unix)
    .sort((a, b) => (a.unix < b.unix ? -1 : 1));
  const comparionRBenchmark = rBenchmark
    .filter((x) => rangeMin < x.unix && rangeMax > x.unix)
    .sort((a, b) => (a.unix < b.unix ? -1 : 1));

  let rPortfolioMean = 0;
  comparisonRPortfolio.forEach((v) => {
    rPortfolioMean += v.return;
  });

  rPortfolioMean /= comparisonRPortfolio.length;

  let rBenchmarkMean = 0;

  comparionRBenchmark.forEach((v) => {
    rBenchmarkMean += v.return;
  });

  rBenchmarkMean /= comparionRBenchmark.length;

  let sumRiRj = 0;

  comparisonRPortfolio.forEach((x) => {
    let rbEquiv = findLastAvailableReturn(
      comparionRBenchmark,
      x.unix,
      1,
      604800000 /*daily*/
    )?.return;

    if (rbEquiv == undefined) {
      rbEquiv = x.return;
    }

    sumRiRj += (x.return - rPortfolioMean) * (rbEquiv - rBenchmarkMean);
  });

  return sumRiRj / comparisonRPortfolio.length;
}
