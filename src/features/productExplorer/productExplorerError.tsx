import { Layout, Typography } from 'antd';

import style from './productExplorerError.module.scss';

const { Content } = Layout;
const { Title } = Typography;

export const ProductExplorerError = () => {
  return (
    <Layout>
      <Content className={style['product-explorer-error']}>
        <Title type="danger" level={2}>
          Loading Error - please reload the page
        </Title>
      </Content>
    </Layout>
  );
};
