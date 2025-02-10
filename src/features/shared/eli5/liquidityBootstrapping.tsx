import { Typography } from 'antd';

const { Title, Text } = Typography;

export const LiquidityBoostrap = () => {
  return (
    <>
      <Title level={3}>
        <Text
          style={{ color: 'var(--secondary-text-color)', fontSize: 'inherit' }}
        >
          &ldquo;A liquidity boostrap pool &rdquo;
        </Text>
      </Title>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          The idea:{' '}
        </Text>
        This is a pool designed for initial liquidity of one of the
        constituents. The weights start heavily skewed and slowly the weight of
        the target constituent is increased.
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          The goal:{' '}
        </Text>
        The goal is to bootstrap the liquidity of a new token by providing
        initial liquidity.
      </p>
    </>
  );
};
