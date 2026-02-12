import { Typography } from 'antd';

const { Title, Text } = Typography;

export const PowerChannel = () => {
  return (
    <>
      <Title level={3}>
        <Text style={{ fontSize: 'inherit' }}>
          Ignore the noise of small price movements, act fast on large price
          movements
        </Text>
      </Title>

      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Intra-day noise is unpredictable and you can get caught out:{' '}
        </Text>
        Broad market movements can be more predictable than &quot;technical
        analysis&quot; day trading. Avoid day trading and move for the medium /
        long term.
      </p>

      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          HODL when prices move in small noise patterns:{' '}
        </Text>
        Just don&apos;t act. HODL is a good strategy when the price is moving in
        small ways.
      </p>

      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Act big if the price moves outside of your noise thresholds:{' '}
        </Text>
      </p>
      <p>
        <Text strong>More detail: </Text>
      </p>

      <div style={{ paddingLeft: 16 }}>
        <p>
          Somewhere between momentum and channel following, there is an argument
          that small price movement noise distorts or delays acting on a good
          momentum signal. This strategy addresses that by ignoring those small
          price movements. When a large price move is detected this strategy
          moves aggressively to capture the movement.
        </p>
        <p>
          This works well if one constituent is moving more erratically than
          another—you might want to penalise those erratic movements.
        </p>
      </div>
    </>
  );
};
