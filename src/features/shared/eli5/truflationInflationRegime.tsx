import { Typography } from 'antd';

const { Title, Text } = Typography;

export interface TruflationInflationRegimeProps {
  hideTitle?: boolean;
  hideImage?: boolean;
};

export const TruflationInflationRegime = ({
  hideTitle = false,
  hideImage = false,
}: TruflationInflationRegimeProps) => {
  return (
    <>
      {!hideTitle && (
        <Title level={3} style={{ margin: 0 }}>
          <Text style={{ fontSize: 'inherit' }}>
            Bitcoin is an inflation hedge, it could react to inflation data
          </Text>
        </Title>
      )}
      {hideImage && null}
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Get high frequency, world class inflation data:{' '}
        </Text>
        Truflation provides realtime CPI inflation data that is more timely
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Determine {"\"inflation regimes\""} where BTC price is predicted by inflation:{' '}
        </Text>
        Determine how sensitive and how correlated BTC price is to inflation changes
      </p>
      <p>
        <Text strong style={{ color: 'var(--secondary-text-color)' }}>
          Allocate to BTC accordingly:{' '}
        </Text>
        Allocate to BTC in 3 regimes: high positive correlation, mixed signal, negative correlation
      </p>
    </>
  );
};
