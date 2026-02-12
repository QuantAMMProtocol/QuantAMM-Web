import { CURRENT_LIVE_FACTSHEETS } from '../documentation/factSheets/liveFactsheets';
import { ProductDetailHealthMonitor } from '../productDetail/productDetailHealthMonitor';
import { Grid } from 'antd';
// import { useSelector } from 'react-redux'; // if you want Redux-driven filters/sorting

const { useBreakpoint } = Grid;

export default function ProductHealthMonitor() {
  const { factsheets } = CURRENT_LIVE_FACTSHEETS;
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;

  const liveFactsheets = factsheets.filter(
    (x) => x.status && x.status.toLowerCase() === 'live'
  );

  if (isMobile) {
    // Mobile: card layout
    return (
      <div
        style={{
          padding: '1.5rem 1.25rem',
        }}
      >
        <h1
          style={{
            marginBottom: '0.5rem',
            fontSize: '1.6rem',
            fontWeight: 600,
          }}
        >
          Pool Health Monitoring
        </h1>

        <p
          style={{
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            opacity: 0.8,
          }}
        >
          Live overview of pool update cadence, liquidity and recent flow
          metrics.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {liveFactsheets.map((factsheet) => (
            <ProductDetailHealthMonitor
              key={`${factsheet.poolChain}-${factsheet.poolId}`}
              factsheet={factsheet}
              isMobile
            />
          ))}
        </div>
      </div>
    );
  }

  // Desktop: table layout (unchanged styling from the latest version)
  return (
    <div
      style={{
        padding: '2.5rem 3rem',
      }}
    >
      <h1
        style={{
          marginBottom: '0.5rem',
          fontSize: '2rem',
          fontWeight: 600,
        }}
      >
        Pool Health Monitoring
      </h1>

      <p
        style={{
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          opacity: 0.8,
        }}
      >
        Live overview of pool update cadence, liquidity and recent flow metrics.
      </p>

      <div
        style={{
          overflowX: 'auto',
          borderRadius: '0.75rem',
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.03))',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
              }}
            >
              <th
                style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                  whiteSpace: 'nowrap',
                }}
              >
                Pool Name
              </th>
              <th
                style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                  whiteSpace: 'nowrap',
                }}
              >
                Health
              </th>
              <th
                style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                  whiteSpace: 'nowrap',
                }}
              >
                Time since last update
              </th>
              <th
                style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                  whiteSpace: 'nowrap',
                }}
              >
                Last Update Time
              </th>
              <th
                style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'right',
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                  whiteSpace: 'nowrap',
                }}
              >
                Liquidity (last)
              </th>
              <th
                style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'right',
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                  whiteSpace: 'nowrap',
                }}
              >
                Liquidity Δ 24h
              </th>
              <th
                style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'right',
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                  whiteSpace: 'nowrap',
                }}
              >
                Volume Δ 24h
              </th>
            </tr>
          </thead>
          <tbody>
            {liveFactsheets.map((factsheet) => (
              <ProductDetailHealthMonitor
                key={`${factsheet.poolChain}-${factsheet.poolId}`}
                factsheet={factsheet}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { ProductHealthMonitor };
