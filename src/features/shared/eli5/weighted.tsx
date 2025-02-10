import { Typography } from 'antd';

const { Title, Text } = Typography;

export const Weighted = () => {
  return (
    <>
      <Title level={3}>
        <Text
          style={{ color: 'var(--secondary-text-color)', fontSize: 'inherit' }}
        >
          &ldquo;Balancer Classic Fixed Weight Pool&rdquo;
        </Text>
      </Title>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          The idea:{' '}
        </Text>
        This is the original balancer pool. It is a pool that is made up of
        multiple tokens with different weights. The weights can be any weight.
        Popular weights include 80/20 and 50/50. The weights determine the
        relative value of the tokens in the pool.The pool is rebalanced by
        traders trading against the pool.
      </p>
      <p>There can be a maximum of 8 tokens in a V3 Balancer pool.</p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          The goal:{' '}
        </Text>
        The goal is to provide a pool that allows for multiple tokens to be
        traded against each other in a single pool.
      </p>
    </>
  );
};
