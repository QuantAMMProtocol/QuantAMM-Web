// CurrentPricePollingGate.tsx
import { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { apolloClient } from '../../queries/apolloClient';
import {
  startCoinCurrentPricesPolling,
  stopCoinCurrentPricesPolling,
} from './coinCurrentPriceSlice';

export function CurrentPricePollingGate(): null {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(startCoinCurrentPricesPolling(apolloClient, 30_000));
    return () => {
      dispatch(stopCoinCurrentPricesPolling());
    };
  }, [dispatch]);

  return null;
}
