import { Typography } from 'antd';

const { Title, Text } = Typography;

export const Momentum = () => {
  return (
    <>
      <Title level={3}>
        <Text
          style={{ color: 'var(--secondary-text-color)', fontSize: 'inherit' }}
        >
          <Text
            delete
            style={{
              fontSize: 'inherit',
            }}
          >
            &ldquo;Buy low and sell high
          </Text>{' '}
          - Buy high and sell higher&rdquo;
        </Text>
      </Title>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Spot the wave:{' '}
        </Text>
        Is the wave growing faster or starting to shrink? If the growing faster
        it&apos;s probably going to continue rising.
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Ride the wave:{' '}
        </Text>
        Pile into something that is already winning instead of trying to find
        winners before they have traction.
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Getting out in time:{' '}
        </Text>
        This is not a perfect strategy. Momentum strategies lose more money at
        the top but tend to have made enough money to not care.
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Limitations:{' '}
        </Text>
        It does not behave differently in bull or bear or sideways markets.
        Reducing adaptability.
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Memory setting:{' '}
        </Text>
        Is the wave growing faster? Faster compared to what exactly? The wave an
        hour ago or compared to weeks ago. A comparison needs a benchmark or
        memory.
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          K (aggressiveness) setting:{' '}
        </Text>
        When I can see the wave growing faster, how quickly should I react? This
        reaction aggressiveness parameter is called K.
      </p>
    </>
  );
};
