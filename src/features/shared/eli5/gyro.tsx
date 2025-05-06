import { Typography } from 'antd';

const { Title, Text } = Typography;

export const Gyro = () => {
  return (
    <>
      <Title level={3}>
        <Text
          style={{  fontSize: 'inherit' }}
        >
          Gyroscope E-CLP
        </Text>
      </Title>
      <p>
        Elliptic Concentrated Liquidity Pools (E-CLPs) introduce asymmetric
        liquidity concentration to AMM design. Unlike traditional AMMs that
        distribute liquidity uniformly, E-CLPs allow liquidity to be
        concentrated asymmetrically within price bounds, following an elliptical
        curve. This design is particularly suited for stablecoin pairs where
        trading primarily occurs near the peg.
      </p>

      <p>
        The pools can be calibrated for different scenarios through geometric
        transformations of a circle, enabling up to 75% improved capital
        efficiency over traditional StableSwap pools by focusing liquidity where
        it&apos;s most needed. E-CLPs also include rate providers for efficient
        handling of yield-bearing assets. Unlike Uniswap v3&apos;s discrete
        liquidity positions, E-CLPs provide continuous liquidity curves while
        maintaining high capital efficiency.
      </p>

      <p>
        For detailed mathematical analysis and implementation details, see:
        <ul>
          <li>
            <a href="https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools/e-clps">
              E-CLP Documentation
            </a>
          </li>
          <li>
            <a href="https://docs.gyro.finance/">Gyroscope Protocol</a>
          </li>
        </ul>
      </p>
    </>
  );
};
