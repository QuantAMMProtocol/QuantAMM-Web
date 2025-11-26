import React, { useMemo } from 'react';
import { useFetchProductData } from '../../hooks/useFetchProductData';
import { FactsheetModel } from '../documentation/landing/desktop/factsheetModel';
import { GqlChain } from '../../__generated__/graphql-types';
import { Product } from '../../models';

interface ProductDetailHealthMonitorProps {
  factsheet: FactsheetModel;
  isMobile?: boolean;
}

interface UseFetchProductDataResult {
  product?: Product;
  productLoading: boolean;
  productError?: Error;
}

const secondsToHuman = (seconds: number): string => {
  if (seconds < 60) return `${seconds.toFixed(0)}s`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes.toFixed(1)}m`;
  const hours = minutes / 60;
  return `${hours.toFixed(2)}h`;
};

const formatNumber = (value: number | null | undefined, decimals = 2): string => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const baseCellStyle: React.CSSProperties = {
  padding: '0.6rem 1rem',
  fontSize: '0.9rem',
  whiteSpace: 'nowrap',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  opacity: 0.7,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const valueStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 500,
};

export const ProductDetailHealthMonitor: React.FC<ProductDetailHealthMonitorProps> = ({
  factsheet,
  isMobile = false,
}) => {
  const { poolId, poolChain, mainTitle } = factsheet;

  const { product, productLoading, productError } = useFetchProductData(
    poolId.toLowerCase(),
    poolChain as GqlChain
  ) as UseFetchProductDataResult;

  const metrics = useMemo(() => {
    if (!product?.quantAmmWeightedParams) {
      return null;
    }

    const { quantAmmWeightedParams, timeSeries } = product;

    const nowSec = Math.floor(Date.now() / 1000);
    const lastUpdate = Number(quantAmmWeightedParams.lastUpdateIntervalTime);
    const updateInterval = Number(quantAmmWeightedParams.updateInterval);

    const actualLag = nowSec - lastUpdate;
    const maxAllowedLag = updateInterval * 0.01;
    const isHealthy = actualLag <= updateInterval + maxAllowedLag;

    let liquidityChange24h: number | null = null;
    let volumeChange24h: number | null = null;
    let currentLiquidity: number | undefined;
    let currentVolume24h: number | undefined;

    if (timeSeries && timeSeries.length >= 2) {
      const last = timeSeries[timeSeries.length - 1];
      const prev = timeSeries[timeSeries.length - 2];

      currentLiquidity = last.totalLiquidity;
      currentVolume24h = last.volume24h;

      liquidityChange24h =
        ((last.totalLiquidity - prev.totalLiquidity) / prev.totalLiquidity) * 100;
      volumeChange24h = last.volume24h - prev.volume24h;
    } else if (timeSeries && timeSeries.length === 1) {
      const last = timeSeries[0];
      currentLiquidity = last.totalLiquidity;
      currentVolume24h = last.volume24h;
    }

    return {
      isHealthy,
      actualLag,
      maxAllowedLag,
      lastUpdate,
      currentLiquidity,
      currentVolume24h,
      liquidityChange24h,
      volumeChange24h,
    };
  }, [product]);

  const renderLoading = () => {
    if (isMobile) {
      return (
        <div
          style={{
            borderRadius: '0.75rem',
            padding: '1rem 1.1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '0.9rem',
          }}
        >
          <div style={{ ...labelStyle, marginBottom: '0.25rem' }}>{mainTitle}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Loading…</div>
        </div>
      );
    }

    return (
      <tr>
        <td style={{ ...baseCellStyle }} colSpan={7}>
          Loading {mainTitle}…
        </td>
      </tr>
    );
  };

  const renderError = () => {
    if (isMobile) {
      return (
        <div
          style={{
            borderRadius: '0.75rem',
            padding: '1rem 1.1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 77, 79, 0.4)',
            marginBottom: '0.9rem',
          }}
        >
          <div style={{ ...labelStyle, marginBottom: '0.25rem' }}>{mainTitle}</div>
          <div style={{ fontSize: '0.9rem', color: '#ff4d4f' }}>Error loading data</div>
        </div>
      );
    }

    return (
      <tr>
        <td style={{ ...baseCellStyle }}>{mainTitle}</td>
        <td style={{ ...baseCellStyle }}>{poolChain}</td>
        <td
          style={{
            ...baseCellStyle,
            color: '#ff4d4f',
          }}
          colSpan={5}
        >
          Error loading data
        </td>
      </tr>
    );
  };

  if (productLoading) {
    return renderLoading();
  }

  if (productError || !metrics) {
    return renderError();
  }

  const {
    isHealthy,
    actualLag,
    lastUpdate,
    currentLiquidity,
    currentVolume24h,
    liquidityChange24h,
    volumeChange24h,
  } = metrics;

  const healthLabel = isHealthy ? 'Healthy' : 'Stale';
  const healthColor = isHealthy ? '#00a35c' : '#ff4d4f';

  if (isMobile) {
    // Mobile card layout
    return (
      <div
        style={{
          borderRadius: '0.9rem',
          padding: '1.1rem 1.1rem 1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          marginBottom: '1rem',
        }}
      >
        {/* Row 1: Name + Health */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            columnGap: '0.75rem',
            alignItems: 'center',
            marginBottom: '0.75rem',
          }}
        >
          <div>
            <div style={labelStyle}>Pool</div>
            <div
              style={{
                ...valueStyle,
                marginTop: '0.15rem',
                wordBreak: 'break-word',
              }}
            >
              {product?.name ?? mainTitle}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={labelStyle}>Health</div>
            <span
              style={{
                display: 'inline-block',
                marginTop: '0.2rem',
                padding: '0.15rem 0.7rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                backgroundColor: isHealthy ? 'rgba(0, 163, 92, 0.18)' : 'rgba(255, 77, 79, 0.18)',
                color: healthColor,
              }}
            >
              {healthLabel}
            </span>
          </div>
        </div>

        {/* Row 2: Lag + Last update */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: '0.75rem',
            marginBottom: '0.75rem',
          }}
        >
          <div>
            <div style={labelStyle}>Time since last update</div>
            <div style={{ ...valueStyle, marginTop: '0.15rem' }}>
              {secondsToHuman(actualLag)}
            </div>
          </div>
          <div>
            <div style={labelStyle}>Last update time</div>
            <div style={{ ...valueStyle, marginTop: '0.15rem' }}>
              {new Date(lastUpdate * 1000).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Row 3: Liquidity + Volume */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: '0.75rem',
          }}
        >
          <div>
            <div style={labelStyle}>Liquidity (last)</div>
            <div style={{ ...valueStyle, marginTop: '0.15rem' }}>
              {formatNumber(currentLiquidity)}
            </div>
            <div
              style={{
                marginTop: '0.15rem',
                fontSize: '0.8rem',
                color:
                  liquidityChange24h == null
                    ? 'rgba(255, 255, 255, 0.55)'
                    : liquidityChange24h >= 0
                    ? '#00a35c'
                    : '#ffb84d',
              }}
            >
              Liquidity Δ 24h:{' '}
              {liquidityChange24h == null ? '—' : `${formatNumber(liquidityChange24h)}%`}
            </div>
          </div>

          <div>
            <div style={labelStyle}>Volume Δ 24h</div>
            <div
              style={{
                ...valueStyle,
                marginTop: '0.15rem',
                color:
                  volumeChange24h == null
                    ? 'rgba(255, 255, 255, 0.9)'
                    : volumeChange24h >= 0
                    ? '#00a35c'
                    : '#ffb84d',
              }}
            >
              {formatNumber(volumeChange24h)}
            </div>
            {currentVolume24h !== undefined && (
              <div
                style={{
                  marginTop: '0.15rem',
                  fontSize: '0.8rem',
                  opacity: 0.7,
                }}
              >
                Latest 24h volume: {formatNumber(currentVolume24h)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop table row
  return (
    <tr
      style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <td style={{ ...baseCellStyle }}>
        {product?.name ?? mainTitle}
      </td>

      <td style={{ ...baseCellStyle }}>
        <span
          style={{
            display: 'inline-block',
            padding: '0.1rem 0.6rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            backgroundColor: isHealthy ? 'rgba(0, 163, 92, 0.12)' : 'rgba(255, 77, 79, 0.12)',
            color: healthColor,
          }}
        >
          {healthLabel}
        </span>
      </td>

      <td style={{ ...baseCellStyle }}>
        {secondsToHuman(actualLag)}
      </td>

      <td style={{ ...baseCellStyle }}>
        {new Date(lastUpdate * 1000).toLocaleString()}
      </td>

      <td
        style={{
          ...baseCellStyle,
          textAlign: 'right',
        }}
      >
        {formatNumber(currentLiquidity)}
      </td>

      <td
        style={{
          ...baseCellStyle,
          textAlign: 'right',
          color:
            liquidityChange24h == null
              ? undefined
              : liquidityChange24h >= 0
              ? '#00a35c'
              : '#ffb84d',
        }}
      >
        {liquidityChange24h == null ? '—' : `${formatNumber(liquidityChange24h)}%`}
      </td>

      <td
        style={{
          ...baseCellStyle,
          textAlign: 'right',
          color:
            volumeChange24h == null
              ? undefined
              : volumeChange24h >= 0
              ? '#00a35c'
              : '#ffb84d',
        }}
      >
        {formatNumber(volumeChange24h)}
      </td>
    </tr>
  );
};
