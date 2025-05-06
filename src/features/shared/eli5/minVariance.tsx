import { Typography } from 'antd';

const { Title, Text } = Typography;

export const MinVariance = () => {
  return (
    <>
      <Title level={3}>
        <Text
          style={{ color: 'var(--secondary-text-color)', fontSize: 'inherit' }}
        >
          Hold more of the least volatile constituent
        </Text>
      </Title>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Volatility is bad:{' '}
        </Text>
        If the constituents are not supposed to be volatile, then you really
        should derisk if one is starting to act erratically.
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          More Detail:{' '}
        </Text>
        <p>
          Modern Portfolio Theory is a foundational economic theory of asset
          management proposed by Harry Markowitz in 1952. Simply put, the theory
          uses statistical analysis comparing constituent properties to each
          other to meet a given statistical target. In this case the aim is to
          reduce the variance of the portfolio as a whole.
        </p>
        <p>
          A natural fit for this strategy could be stablecoins, you want to have
          more of the least volatile stable in your portfolio.
        </p>
      </p>
    </>
  );
};
