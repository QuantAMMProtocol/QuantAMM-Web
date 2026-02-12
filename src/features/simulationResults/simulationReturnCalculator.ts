import {
  SimulationRunLiquidityPoolSnapshot,
  ReturnDistribution,
  ReturnTimeStep,
} from './simulationResultSummaryModels';

import { default as tBillPrices } from '../../price_data/DTB3.json';
import { SimulationResultAnalysisDto } from '../simulationRunner/simulationRunnerDtos';

const download = function (data: string) {
  // Creating a Blob for having a csv file format
  // and passing the data with type
  const blob = new Blob([data], { type: 'text/csv' });

  // Creating an object for downloading url
  const url = window.URL.createObjectURL(blob);

  // Creating an anchor(a) tag of HTML
  const a = document.createElement('a');

  // Passing the blob downloading url
  a.setAttribute('href', url);

  // Setting the anchor tag attribute for downloading
  // and passing the download file name
  a.setAttribute('download', 'download.csv');

  // Performing a download with click
  a.click();
};

export interface TBillYield {
  date: string;
  rate: number;
}

export interface simpRet {
  unix: number;
  return: number;
}

const csvmaker = function (data: ReturnTimeStep[]) {
  if (data.length === 0) {
    return '';
  }

  const downloadData: simpRet[] = data.map((x) => {
    return { unix: x.unix, return: x.return };
  });
  // Empty array for storing the values
  const csvRows = [];

  // Headers is basically a keys of an
  // object which is id, name, and
  // profession
  const headers = Object.keys(downloadData[0]);

  // As for making csv format, headers
  // must be separated by comma and
  // pushing it into array
  csvRows.push(headers.join(','));

  // Pushing Object values into array
  // with comma separation
  downloadData.forEach((x) => {
    const values = Object.values(x).join(',');
    csvRows.push(values);
  });

  // Returning the array joining with new line
  return csvRows.join('\n');
};

export function downloadReturns(data: ReturnTimeStep[]) {
  if (data.length === 0) {
    return;
  }
  const csvdata = csvmaker(data);
  download(csvdata);
}

export function convertTBillDataToReturnTimeSteps(): ReturnTimeStep[] {
  const prices = tBillPrices as TBillYield[];

  const result: ReturnTimeStep[] = prices.map((x) => {
    return {
      date: x.date + 'T05:00:00',
      unix: new Date(x.date + 'T05:00:00').getTime(),
      return: x.rate / 100,
    };
  });

  return result;
}

export function findLastAvailableReturn(
  returns: ReturnTimeStep[],
  unixTime: number,
  timeStepTolerance: number,
  offsetInterval: number
): ReturnTimeStep | undefined {
  let result: ReturnTimeStep | undefined = undefined;

  result = returns.find((y) => y.unix === unixTime);

  if (result !== undefined) {
    return result;
  }
  for (let i = 0; i <= timeStepTolerance; i++) {
    result = returns.find((y) => {
      const xDate = new Date(unixTime - i * offsetInterval);
      const yDate = new Date(y.unix);
      return (
        xDate.getFullYear() === yDate.getFullYear() &&
        xDate.getDate() === yDate.getDate() &&
        xDate.getMonth() === yDate.getMonth()
      );
    });

    if (result === undefined) {
      result = returns.find((y) => y.unix / 1000 === i * offsetInterval);
    }

    if (result !== undefined) {
      break;
    }
  }

  return result;
}

//covariance
export function calculateCovariance(
  ri: ReturnTimeStep[],
  rj: ReturnTimeStep[]
) {
  if (ri.length < 2 || rj.length < 2) {
    return 0;
  }

  const riMean =
    ri
      .map((x) => x.return)
      .reduce<number>((accumulator, current) => {
        return accumulator + current;
      }, 0) / ri.length;

  const rjMean =
    rj
      .map((x) => x.return)
      .reduce<number>((accumulator, current) => {
        return accumulator + current;
      }, 0) / rj.length;

  let sumRiRj = 0;

  ri.forEach((i) => {
    const j = findLastAvailableReturn(rj, i.unix, 1, 604800000);

    if (j !== undefined) {
      sumRiRj += (i.return - riMean) * (j.return - rjMean);
    }
  });

  return sumRiRj / (ri.length - 1);
}

export function calculateReturnDistribution(
  returns: ReturnTimeStep[]
): ReturnDistribution[] {
  const sortedReturns = returns
    .map((x) => x.return)
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
  if (sortedReturns.length === 0) {
    return [];
  }
  const returnRange =
    (sortedReturns[sortedReturns.length - 1] - sortedReturns[0]) / 100;

  const result: ReturnDistribution[] = [];

  for (let i = 1; i <= 100; i++) {
    const count = sortedReturns.filter(
      (x) =>
        x <= sortedReturns[0] + i * returnRange &&
        x >= sortedReturns[0] + (i - 1) * returnRange &&
        isFinite(x)
    ).length;

    const percentile = parseFloat(
      (100 * (sortedReturns[0] + i * returnRange)).toFixed(4)
    );

    result.push({
      percentile,
      count,
    });
  }

  return result;
}

export function generateReturnTimestepSeries(marketValues: number[]) {
  const result: ReturnTimeStep[] = [];
  for (let i = 0; i < marketValues.length; i++) {
    if (i === 0) {
      result.push({
        date: new Date().toLocaleString(),
        unix: i,
        return: 0,
      });
      continue;
    }

    let returnValue: number;
    if (marketValues[i] === 0 || marketValues[i - 1] === 0) {
      returnValue = 0;
    } else {
      returnValue =
        (marketValues[i] - marketValues[i - 1]) / marketValues[i - 1];
    }

    result.push({
      date: new Date().toLocaleString(),
      unix: i,
      return: returnValue,
    });
  }
  return result;
}

//parametric VaR

//tracking error
export function calculateTrackingError(
  rPortfolio: ReturnTimeStep[],
  rBenchmark: ReturnTimeStep[]
) {
  if (rPortfolio.length < 2 || rBenchmark.length < 2) {
    return 0;
  }

  const rPortfolioMean =
    rPortfolio
      .map((x) => x.return)
      .reduce<number>((accumulator, current) => {
        return accumulator + current;
      }, 0) / rPortfolio.length;

  const rBenchmarkMean =
    rBenchmark
      .map((x) => x.return)
      .reduce<number>((accumulator, current) => {
        return accumulator + current;
      }, 0) / rBenchmark.length;

  const meanDif = rPortfolioMean - rBenchmarkMean;
  const numerator = rPortfolio
    .map((x) => {
      let rbEquiv = rBenchmark.find((y) => x.unix === y.unix)?.return;
      if (rbEquiv === undefined) {
        rbEquiv = findLastAvailableReturn(
          rBenchmark,
          x.unix,
          1,
          604800000
        )?.return;

        if (rbEquiv === undefined) {
          rbEquiv = x.return;
        }
      }
      return Math.pow((x.return - rbEquiv - meanDif) * 100, 2);
    })
    .reduce<number>((accumulator, current) => {
      return accumulator + current;
    }, 0);

  return Math.sqrt(numerator / (rPortfolio.length - 1));
}

export function convertApiResponse(apiResponse: any): {
  results: SimulationRunLiquidityPoolSnapshot[];
  analysisResults: SimulationResultAnalysisDto;
} {
  const results: SimulationRunLiquidityPoolSnapshot[] =
    apiResponse.timeSteps.map((step: any) => ({
      unix: step.unix,
      date: new Date(step.unix).toLocaleString(),
      coinsHeld: step.coinsHeld.map((coin: any) => ({
        coin: {
          coinName: coin.coinCode,
          coinCode: coin.coinCode,
          dailyPriceHistory: [],
          dailyPriceHistoryMap: new Map(),
          dailyReturns: new Map(),
          coinComparisons: new Map(),
        },
        amount: coin.amount,
        marketValue: coin.marketValue,
        currentPrice: coin.currentPrice,
        currentPriceUnix: step.unix,
        factorValue: '0',
        weight: coin.weight,
      })),
      feeForSnapshot: step.timeStepTotal,
      hodlEquiv: undefined,
      totalFeesReceivedToDate: 0, //@CH We may need to calculate this if not provided by API
      totalPoolMarketValue: step.coinsHeld.reduce(
        (sum: number, coin: any) => sum + coin.marketValue,
        0
      ),
    }));

  const analysisResults = apiResponse.analysis as SimulationResultAnalysisDto;

  return { results, analysisResults };
}
