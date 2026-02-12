import { Typography } from 'antd';

const { Title, Text } = Typography;

export const FX = () => {
  return (
    <>
      <Title level={3}>
        <Text style={{ fontSize: 'inherit' }}>A balancer FX pool</Text>
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
