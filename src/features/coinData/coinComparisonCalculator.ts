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

function getMinMaxUnix(returns: ReturnTimeStep[]) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const item of returns) {
    if (item.unix < min) min = item.unix;
    if (item.unix > max) max = item.unix;
  }

  return { min, max };
}

//tracking error
export function calculateTrackingError(
  rPortfolio: ReturnTimeStep[],
  rBenchmark: ReturnTimeStep[]
): number {
  if (rPortfolio.length === 0 || rBenchmark.length === 0) {
    return 0;
  }

  const { min: rPortfolioMin, max: rPortfolioMax } =
    getMinMaxUnix(rPortfolio);
  const { min: rBenchmarkMin, max: rBenchmarkMax } =
    getMinMaxUnix(rBenchmark);

  const rangeMin = Math.max(rPortfolioMin, rBenchmarkMin);
  const rangeMax = Math.min(rPortfolioMax, rBenchmarkMax);
  if (rangeMax <= rangeMin) {
    return 0;
  }

  const comparisonRPortfolio = rPortfolio
    .filter((x) => rangeMin < x.unix && rangeMax > x.unix)
    .sort((a, b) => a.unix - b.unix);
  const comparisonRBenchmark = rBenchmark
    .filter((x) => rangeMin < x.unix && rangeMax > x.unix)
    .sort((a, b) => a.unix - b.unix);

  if (comparisonRPortfolio.length === 0 || comparisonRBenchmark.length === 0) {
    return 0;
  }

  const rPortfolioMean =
    comparisonRPortfolio
      .map((x) => x.return)
      .reduce<number>((accumulator, current) => {
        return accumulator + current;
      }, 0) / comparisonRPortfolio.length;

  const rBenchmarkMean =
    comparisonRBenchmark
      .map((x) => x.return)
      .reduce<number>((accumulator, current) => {
        return accumulator + current;
      }, 0) / comparisonRBenchmark.length;

  const meanDif = rPortfolioMean - rBenchmarkMean;
  const numerator = comparisonRPortfolio
    .map((x) => {
      let rbEquiv = findLastAvailableReturn(
        comparisonRBenchmark,
        x.unix,
        1,
        604800000 /*daily*/
      )?.return;

      if (rbEquiv === undefined) {
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
): number {
  if (rPortfolio.length === 0 || rBenchmark.length === 0) {
    return 0;
  }

  const { min: rPortfolioMin, max: rPortfolioMax } =
    getMinMaxUnix(rPortfolio);
  const { min: rBenchmarkMin, max: rBenchmarkMax } =
    getMinMaxUnix(rBenchmark);

  const rangeMin = Math.max(rPortfolioMin, rBenchmarkMin);
  const rangeMax = Math.min(rPortfolioMax, rBenchmarkMax);
  if (rangeMax <= rangeMin) {
    return 0;
  }

  const comparisonRPortfolio = rPortfolio
    .filter((x) => rangeMin < x.unix && rangeMax > x.unix)
    .sort((a, b) => a.unix - b.unix);
  const comparisonRBenchmark = rBenchmark
    .filter((x) => rangeMin < x.unix && rangeMax > x.unix)
    .sort((a, b) => a.unix - b.unix);

  if (comparisonRPortfolio.length === 0 || comparisonRBenchmark.length === 0) {
    return 0;
  }

  let rPortfolioMean = 0;
  comparisonRPortfolio.forEach((v) => {
    rPortfolioMean += v.return;
  });

  rPortfolioMean /= comparisonRPortfolio.length;

  let rBenchmarkMean = 0;

  comparisonRBenchmark.forEach((v) => {
    rBenchmarkMean += v.return;
  });

  rBenchmarkMean /= comparisonRBenchmark.length;

  let sumRiRj = 0;

  comparisonRPortfolio.forEach((x) => {
    let rbEquiv = findLastAvailableReturn(
      comparisonRBenchmark,
      x.unix,
      1,
      604800000 /*daily*/
    )?.return;

    if (rbEquiv === undefined) {
      rbEquiv = x.return;
    }

    sumRiRj += (x.return - rPortfolioMean) * (rbEquiv - rBenchmarkMean);
  });

  return sumRiRj / comparisonRPortfolio.length;
}
