// bannerProductSection.tsx
import { Button, Col, Row, Tag, Tooltip, Spin } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useFetchPoolsSummaryByParams } from '../../../../hooks/useFetchPoolsSummaryByParams';
import type { GqlChain } from '../../../../__generated__/graphql-types';
import type { RootState } from '../../../../app/store';
import { selectCoinPrice } from '../../../../features/coinData/coinCurrentPriceSlice';
import styles from './landingDesktop.module.css';

interface ProductBannerProp {
  title: string;
  imgSrc: string;
  description: string[];
  status: string;
  opacity: number;
  imgWidth: string;
  focus: boolean;
  poolId: string;
  poolChain: string;
  factsheetRoute: string;
  productExplorerRoute: string;
  inceptionLpPrice: number; // initial LP token price from factsheet model
}

export interface ProductBannerProps {
  productData: ProductBannerProp[];
}

type FlashDir = 'up' | 'down' | null;

export function BannerProductSection({ productData }: ProductBannerProps) {
  const navigate = useNavigate();

  const params = useMemo(() => {
    const ids = productData.map((p) => p.poolId);
    const chains = productData.map((p) => p.poolChain as GqlChain);
    return {
      where: {
        idIn: ids,
        chainIn: chains,
      },
    };
  }, [productData]);

  const { data, loading } = useFetchPoolsSummaryByParams(params);

  const poolsByKey = useMemo(() => {
    const map: Record<string, { tvl: number; volume: number }> = {};
    data?.poolGetPools?.forEach((pool) => {
      const key = `${pool.chain}:${pool.id}`;
      map[key] = {
        tvl: Number(pool.dynamicData?.totalLiquidity ?? 0),
        volume: Number(pool.dynamicData?.volume24h ?? 0),
      };
    });
    return map;
  }, [data]);

  const neededPrices = useSelector((s: RootState) => {
    const out: Record<string, number> = {};
    productData.forEach((p) => {
      const entry = selectCoinPrice(p.poolChain as GqlChain, p.poolId)(s);
      if (entry?.price != null) {
        out[`${p.poolChain}:${p.poolId.toLowerCase()}`] = Number(entry.price);
      }
    });
    return out;
  }, shallowEqual);

  const lastPricesRef = useRef<Record<string, number>>({});
  const timersRef = useRef<Record<string, number>>({});
  const [flashByKey, setFlashByKey] = useState<Record<string, FlashDir>>({});

  useEffect(() => {
    productData.forEach((p) => {
      const k = `${p.poolChain}:${p.poolId.toLowerCase()}`;
      const next = neededPrices[k];
      const prev = lastPricesRef.current[k];

      if (Number.isFinite(next) && Number.isFinite(prev)) {
        let dir: FlashDir = next > prev ? 'up' : 'down';

        if (next === prev) {
          const perf = computeItdPerfPct(next, p.inceptionLpPrice);
          if (perf != null && perf > 0) {
            dir = 'up';
          } else {
            dir = 'down';
          }
        }
        setFlashByKey((fm) => ({ ...fm, [k]: dir }));

        if (timersRef.current[k]) {
          window.clearTimeout(timersRef.current[k]);
        }

        timersRef.current[k] = window.setTimeout(() => {
          setFlashByKey((fm) => ({ ...fm, [k]: null }));
          delete timersRef.current[k];
        }, 500);
      }

      if (Number.isFinite(next)) {
        lastPricesRef.current[k] = next;
      }
    });

    return () => {
      Object.values(timersRef.current).forEach((t) => window.clearTimeout(t));
      timersRef.current = {};
    };
  }, [neededPrices, productData]);

  const handleNavigation = (route?: string) => {
    if (route) navigate(route);
  };

  const formatUsd = (value: number) =>
    value >= 1_000_000
      ? `$${(value / 1_000_000).toFixed(1)}M`
      : value >= 1_000
        ? `$${(value / 1_000).toFixed(1)}k`
        : `$${value.toFixed(0)}`;

  const formatPct = (value: number) =>
    `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;

  const computeItdPerfPct = (
    currentPrice?: number,
    inceptionPrice?: number
  ) => {
    const cur = Number(currentPrice);
    const inc = Number(inceptionPrice);
    if (!Number.isFinite(cur) || !Number.isFinite(inc) || inc === 0)
      return null;
    return (cur / inc - 1) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Row className={styles.bannerHeaderRow}>
        <Col span={24} className={styles.textCenter}>
          <h3 className={styles.bannerTitle}>
            Featured Blockchain Traded Funds
          </h3>
          <div className={styles.bannerUnderline} />
        </Col>
      </Row>

      {loading ? (
        <Row justify="center">
          <Spin tip="Loading pool data..." />
        </Row>
      ) : (
        <Row gutter={[24, 24]} justify="center">
          {productData.map((tag) => {
            const key = `${tag.poolChain}:${tag.poolId}`;
            const keyLower = `${tag.poolChain}:${tag.poolId.toLowerCase()}`;

            const pool = poolsByKey[key];
            const currentPrice = neededPrices[keyLower];

            const perf = computeItdPerfPct(currentPrice, tag.inceptionLpPrice);
            const basePerfColor =
              perf == null ? '#aaa' : perf >= 0 ? '#4ade80' : '#f87171';

            const flashDir = flashByKey[keyLower];

            const flashBg =
              flashDir === 'up'
                ? 'rgba(74, 222, 128, 0.25)' // green
                : flashDir === 'down'
                  ? 'rgba(248, 113, 113, 0.25)' // red
                  : 'transparent';

            return (
              <Col
                key={key}
                xs={24}
                sm={24}
                md={24}
                lg={6}
                xl={6}
                className={styles.centeredRow}
              >
                <Tag
                  className={styles.productTag}
                  style={{
                    opacity: tag.opacity,
                    background: 'transparent',
                    border: 'transparent',
                    padding: 0,
                    margin: 0,
                    textAlign: 'center',
                  }}
                >
                  <Row gutter={[0, 8]} justify="center">
                    <Col span={24}>
                      <Row justify="center">
                        <img
                          src={tag.imgSrc}
                          alt={tag.title}
                          className={styles.productIcon}
                        />
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Tooltip
                        placement="top"
                        title={
                          <div>
                            {tag.description.map((d: string, i: number) => (
                              <p key={i} style={{ margin: 0 }}>
                                {d}
                              </p>
                            ))}
                          </div>
                        }
                      >
                        <h5 style={{ margin: 0 }}>
                          {tag.title.toUpperCase()}
                          {tag.status !== 'LIVE' && ' (' + tag.status + ')'}
                        </h5>
                      </Tooltip>
                    </Col>
                    <Col span={24}>
                      <Row
                        justify="space-around"
                        align="middle"
                        className={styles.statsRow}
                      >
                        <Col flex="1" className={styles.textCenter}>
                          <p className={styles.statLabel}>TVL</p>
                          <p className={styles.statValue}>
                            {pool ? formatUsd(pool.tvl) : '--'}
                          </p>
                        </Col>

                        <Col flex="0 0 1px">
                          <div className={styles.statDivider} />
                        </Col>

                        <Col flex="1" className={styles.textCenter}>
                          <p className={styles.statLabel}>Volume</p>
                          <p className={styles.statValue}>
                            {pool ? formatUsd(pool.volume) : '--'}
                          </p>
                        </Col>

                        <Col flex="0 0 1px">
                          <div className={styles.statDivider} />
                        </Col>

                        <Col flex="1" className={styles.textCenter}>
                          <p className={styles.statLabel}>ITD P&L</p>
                          <p
                            className={styles.perfValue}
                            style={
                              {
                                '--perf-bg': flashBg,
                                '--perf-color': basePerfColor,
                              } as CSSProperties
                            }
                          >
                            {perf != null ? formatPct(perf) : '--'}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row
                        justify="center"
                        gutter={10}
                        className={styles.actionRow}
                      >
                        <Col flex="0 0 auto" xs={24} sm={24} md={24}>
                          <Button
                            onClick={() => handleNavigation(tag.factsheetRoute)}
                            size="small"
                            disabled={
                              tag.status !== 'LIVE' && tag.status !== 'PREVIEW'
                            }
                            style={{
                              padding: '6px 12px',
                              borderRadius: 6,
                              border: '1px solid rgba(255,255,255,0.25)',
                              background: 'rgba(255,255,255,0.05)',
                              color: '#fff',
                              fontSize: '0.78rem',
                              lineHeight: 1,
                              opacity:
                                tag.status !== 'LIVE' &&
                                tag.status !== 'PREVIEW'
                                  ? 0.7
                                  : 1,
                              cursor:
                                tag.status !== 'LIVE' &&
                                tag.status !== 'PREVIEW'
                                  ? 'not-allowed'
                                  : 'pointer',
                            }}
                          >
                            View Factsheet
                          </Button>
                        </Col>
                        <Col flex="0 0 auto" xs={24} sm={24} md={24}>
                          <Button
                            onClick={() =>
                              handleNavigation(tag.productExplorerRoute)
                            }
                            size="small"
                            disabled={tag.status !== 'LIVE'}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 6,
                              background:
                                'linear-gradient(90deg, #fafaf96c, #f5f5f43d)',
                              border: '1px solid #fafaf9d2',
                              color: '#fafaf9fa',
                              fontWeight: 600,
                              fontSize: '0.78rem',
                              lineHeight: 1,
                              opacity: tag.status !== 'LIVE' ? 0.7 : 1,
                              cursor:
                                tag.status !== 'LIVE'
                                  ? 'not-allowed'
                                  : 'pointer',
                            }}
                          >
                            View Live Pool
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Tag>
              </Col>
            );
          })}
        </Row>
      )}
    </motion.div>
  );
}
