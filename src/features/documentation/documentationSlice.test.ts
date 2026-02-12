import { describe, expect, it } from 'vitest';
import {
  selectBasket,
  selectEndDate,
  selectStartDate,
  selectUpdateRuleTrainingFilter,
  setBasket,
  setEndDate,
  setStartDate,
  setTrainingResult,
  setUpdateRuleTrainingLoadState,
} from './documentationSlice';
import documentationReducer from './documentationSlice';

describe('documentationSlice view-model logic', () => {
  it('updates individual training filter fields through reducers', () => {
    const baseState = documentationReducer(undefined, { type: '@@INIT' });

    const withBasket = documentationReducer(baseState, setBasket('macro'));
    const withStartDate = documentationReducer(
      withBasket,
      setStartDate('2024-01-01')
    );
    const withEndDate = documentationReducer(
      withStartDate,
      setEndDate('2024-06-30')
    );
    const withLoading = documentationReducer(
      withEndDate,
      setUpdateRuleTrainingLoadState(true)
    );

    expect(withLoading.updateRuleTrainingFilter.basket).toBe('macro');
    expect(withLoading.updateRuleTrainingFilter.startDate).toBe('2024-01-01');
    expect(withLoading.updateRuleTrainingFilter.endDate).toBe('2024-06-30');
    expect(withLoading.updateRuleTrainingLoadState).toBe(true);
  });

  it('stores the full training result payload', () => {
    const baseState = documentationReducer(undefined, { type: '@@INIT' });
    const trainingResult = {
      batch_size: 16,
      n_parameter_sets: 42,
      decay_lr_plateau: 3,
      decay_lr_ratio: '0.5',
      optimiser: 'adam',
      objective: [1, 2, 3],
      train_objective: [0.8, 0.9],
      test_objective: [0.7, 0.75],
    };

    const nextState = documentationReducer(
      baseState,
      setTrainingResult(trainingResult)
    );

    expect(nextState.updateRuleTrainingResults).toEqual(trainingResult);
  });

  it('selectors map the docs state shape correctly', () => {
    const state = {
      docs: {
        updateRuleTrainingLoadState: false,
        updateRuleTrainingFilter: {
          basket: 'btc',
          updateRule: '',
          parameterType: '',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          trainingWindow: '',
          memorySettings: '',
          tradingFunction: '',
          strategyRefresh: '',
        },
        updateRuleTrainingResults: {
          batch_size: 0,
          n_parameter_sets: 0,
          decay_lr_plateau: 0,
          decay_lr_ratio: '',
          optimiser: '',
          objective: [],
          train_objective: [],
          test_objective: [],
        },
      },
    } as any;

    expect(selectBasket(state)).toBe('btc');
    expect(selectStartDate(state)).toBe('2024-01-01');
    expect(selectEndDate(state)).toBe('2024-12-31');
    expect(selectUpdateRuleTrainingFilter(state)).toEqual(
      state.docs.updateRuleTrainingFilter
    );
  });
});
