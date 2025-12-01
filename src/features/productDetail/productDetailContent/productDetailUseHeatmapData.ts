import { useMemo } from 'react';
import { GqlPoolEvent, GqlPoolEventType } from '../../../__generated__/graphql-types';

interface Product {
  poolConstituents?: ({ address?: string | null; coin?: string | null } | null)[] | null;
}

export function useHeatmapData(product: Product | undefined | null, poolEvents: GqlPoolEvent[] | undefined) {
  interface HeatDatum { tokenIn: string; tokenOut: string; usd: number }

  return useMemo(() => {
    const constituents = (product?.poolConstituents ?? []).filter((c): c is { address: string; coin?: string | null } => !!c?.address);
    const addrToCoin = new Map(constituents.map((c) => [String(c.address).toLowerCase(), String(c.coin ?? c.address)]));
    const canonicalCoinOrder = constituents.map((c) => String(c.coin ?? c.address));
    const addrNameMap = Object.fromEntries(constituents.map((c) => [String(c.address).toLowerCase(), String(c.coin ?? c.address)]));

    const normAddr = (a?: string) => {
      const v = String(a ?? '').trim();
      return /^0x[a-fA-F0-9]{40}$/.test(v) ? v.toLowerCase() : '';
    };

    const acc = new Map<string, number>();
    for (const ev of poolEvents ?? []) {
      if (ev.type !== ('SWAP' as GqlPoolEventType)) continue;

      const inAddr = normAddr((ev as any)?.tokenIn?.address);
      const outAddr = normAddr((ev as any)?.tokenOut?.address);
      if (!inAddr || !outAddr) continue;

      const coinIn = addrToCoin.get(inAddr) ?? inAddr;
      const coinOut = addrToCoin.get(outAddr) ?? outAddr;

      const usd = Number(ev.valueUSD ?? 0);
      if (!Number.isFinite(usd) || usd <= 0) continue;

      const key = `${coinIn}__${coinOut}`;
      acc.set(key, (acc.get(key) ?? 0) + usd);
    }

    const heatmapData: HeatDatum[] = Array.from(acc, ([key, usd]) => {
      const [tokenIn, tokenOut] = key.split('__');
      return { tokenIn, tokenOut, usd };
    });

    const present = new Set<string>([
      ...heatmapData.map((d) => d.tokenIn),
      ...heatmapData.map((d) => d.tokenOut),
    ]);

    const base = canonicalCoinOrder.filter((name) => present.has(name));
    const seen = new Set(base);
    const extras: string[] = [];
    for (const d of heatmapData) {
      if (!seen.has(d.tokenIn)) { seen.add(d.tokenIn); extras.push(d.tokenIn); }
      if (!seen.has(d.tokenOut)) { seen.add(d.tokenOut); extras.push(d.tokenOut); }
    }
    const domain = [...base, ...extras];

    const indexBy = new Map(domain.map((d, i) => [d, i]));
    const idx = (k: string) => (indexBy.has(k) ? (indexBy.get(k)!) : Number.MAX_SAFE_INTEGER);

    heatmapData.sort((a, b) => {
      const ai = idx(a.tokenIn);
      const bi = idx(b.tokenIn);
      if (ai !== bi) return ai - bi;
      return idx(a.tokenOut) - idx(b.tokenOut);
    });

    return { heatmapData, xDomain: domain, yDomain: domain, addrNameMap };
  }, [poolEvents, product?.poolConstituents]);
}
