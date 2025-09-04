// CurrentPricePollingGate.tsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import { startCoinCurrentPricesPolling, stopCoinCurrentPricesPolling } from './coinCurrentPriceSlice';
import { apolloClient } from '../../queries/apolloClient';

export function CurrentPricePollingGate(): null {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(startCoinCurrentPricesPolling(apolloClient, 30_000));
    return () => {
      dispatch(stopCoinCurrentPricesPolling());
    };
  }, [dispatch]);

  return null;
}
