import { Typography } from 'antd';

const { Title, Text } = Typography;

export const ChannelFollowing = () => {
  return (
    <>
      <Title level={3}>
        <Text style={{ fontSize: 'inherit' }}>
          Capitalize on small movements but act fast on larger movements
        </Text>
      </Title>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Define a channel:{' '}
        </Text>
        Define some distance from the mean price that you expect the price to
        orbit
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Expect bouncing within the channel:{' '}
        </Text>
        The strategy expects the price to bouce within the channel but not
        outside it. Pre-empt and capitalise on the bouce back.
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Move fast if the expected channel is wrong:{' '}
        </Text>
        If a bounce crosses the channel, start to act fast to avoid getting
        caught out by unexpected large price movements.
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          How its used normally:{' '}
        </Text>
        Often associated with weighted moving averages, this strategy expects a
        to enact the mean reversion strategy within the channel and the power
        channel strategy outside the channel.
      </p>
    </>
  );
};
