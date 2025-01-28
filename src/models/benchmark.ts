export enum Benchmark {
  HODL = 'hodl',
  BTC = 'btc',
  MOMENTUM = 'momentum',
  RISK_FREE = 'Rf',
}

export type BenchmarkType =
  | Benchmark.HODL
  | Benchmark.BTC
  | Benchmark.MOMENTUM
  | Benchmark.RISK_FREE;
