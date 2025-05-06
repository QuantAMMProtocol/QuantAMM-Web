import { Typography } from 'antd';

const { Title, Text } = Typography;

export const AntiMomentum = () => {
  return (
    <>
      <Title level={3}>
        <Text
          style={{ fontSize: 'inherit' }}
        >
          Deviations will revert back to the mean. Buy and sell assuming
          prices will revert.
        </Text>
      </Title>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Calculate the average price given the last N number of days:{' '}
        </Text>
        Often associated with weighted moving averages, this strategy expects a
        to enact the mean reversion strategy within the channel and the power
        channel strategy outside the channel.
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Buy and sell as if you knew the price would always go back to that
          average:{' '}
        </Text>
        If the price is above the average, sell as you expect the price to fall
        back down. If the price is below the average, buy as you expect the
        price to rise again.
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          More detail:{' '}
        </Text>
        This is a much more refined strategy that can be considered market cycle
        specific (i.e. works when markets are sideways) and likely should not be
        used by itself.
      </p>
    </>
  );
};
