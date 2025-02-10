import { Typography } from 'antd';

const { Title, Text } = Typography;

export const PowerChannel = () => {
  return (
    <>
      <Title level={3}>
        <Text
          style={{ color: 'var(--secondary-text-color)', fontSize: 'inherit' }}
        >
          &ldquo;Ignore the noise of small price movements, act fast on large
          price movements&rdquo;
        </Text>
      </Title>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Noise is unpredictable and you can get caught out:{' '}
        </Text>
        Broad market movements can be more predictable than &quot;technical
        analysis&quot; day trading. Avoid day trading and move for the medium /
        long term.
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          HODL when prices move in small noise patters:{' '}
        </Text>
        Just don&apos;t act. HODL is a good strategy when the price is moving in
        small ways
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Act big if the price moves outside of your noise thresholds:{' '}
        </Text>
        FOMO into a mooning consituent or exit a freefalling one.
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          More detail:{' '}
        </Text>
        <p>
          Somewhere between momentum and channel following, there is an argument
          that small price movement noise distorts or delays acting on a good
          momentum signal. This strategy addresses that by ignoring those small
          price movements. When a large price move is detected this strategy
          moves aggressively to capture the movement.
        </p>
        <p>
          Modelling has shown this is a particularly good approach for small cap
          tokens and coins that can suddenly moon but whose day to day prices
          are erratic.
        </p>
      </p>
    </>
  );
};
