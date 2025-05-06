import { Typography } from 'antd';

const { Title, Text } = Typography;

export const ElementPool = () => {
  return (
    <>
      <Title level={3}>
        <Text
          style={{ fontSize: 'inherit' }}
        >
          &ldquo;A balancer element pool &rdquo;
        </Text>
      </Title>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          The idea:{' '}
        </Text>
        This is a pool that is made up of other stable pools. The idea is that
        the pool will be stable as long as the constituent pools are stable.
      </p>
    </>
  );
};
