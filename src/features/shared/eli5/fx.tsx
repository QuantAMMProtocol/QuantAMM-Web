import { Typography } from 'antd';

const { Title, Text } = Typography;

export const FX = () => {
  return (
    <>
      <Title level={3}>
        <Text
          style={{ color: 'var(--secondary-text-color)', fontSize: 'inherit' }}
        >
          &ldquo;A balancer FX pool &rdquo;
        </Text>
      </Title>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          The idea:{' '}
        </Text>
        This is an FX pool
      </p>
    </>
  );
};
