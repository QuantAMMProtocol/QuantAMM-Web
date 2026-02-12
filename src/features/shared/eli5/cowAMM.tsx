import { Typography } from 'antd';

const { Title, Text } = Typography;

export const CowAMM = () => {
  return (
    <>
      <Title level={3}>
        <Text style={{ fontSize: 'inherit' }}>CoW AMM</Text>
      </Title>
      <p>
        CoW AMM introduces clearing-price consistency to AMM design. Unlike
        traditional constant product AMMs where traders execute at different
        prices from the final marginal price, CoW AMM ensures each trade
        executes at the post-trade marginal price. This is done to reduce or
        eliminate LVR. Trades reach the AMM pools via the CoW protocol solver
        network.
      </p>

      <p>
        The pools implement passive investment strategies with fixed portfolio
        weights, similar to traditional AMMs.
      </p>

      <div>
        For more background, implementation details, and detailed mathematical
        analysis, see:
        <ul>
          <li>
            <a href="https://cow.fi/cow-amm">CoW AMM</a>
          </li>
          <li>
            <a href="https://docs.cow.fi/category/concepts-2">
              CoW AMM Documentation
            </a>
          </li>
          <li>
            <a href="https://arxiv.org/abs/2307.02074">
              CoW AMM Protocol Whitepaper
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};
