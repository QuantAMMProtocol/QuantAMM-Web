import { CSSProperties, FC, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Affix, Button, Layout } from 'antd';
import { LeftOutlined, TableOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../../app/hooks';
import {
  selectProductById,
  selectProducts,
} from '../../productExplorer/productExplorerSlice';
import { ProductDetailInfo } from './productDetailInfo';
import styles from './productDetailSidebar.module.scss';

const { Sider } = Layout;

interface ProductDetailSidebarProps {
  id: string;
  isDark?: boolean;
}

export const ProductDetailSidebar: FC<ProductDetailSidebarProps> = ({
  id,
  isDark = false,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [brokenBreakpoint, setBrokenBreakpoint] = useState<boolean>(true);
  const product = selectProductById(useAppSelector(selectProducts), id);

  const style: CSSProperties = useMemo(() => {
    if (brokenBreakpoint) {
      return {
        position: 'absolute',
        left: 0,
        zIndex: 99,
        backgroundColor: 'inherit',
      };
    }

    return {};
  }, [brokenBreakpoint]);

  return (
    <Sider
      width={brokenBreakpoint ? '250px' : '25%'}
      breakpoint="xl"
      collapsedWidth="0"
      onBreakpoint={(broken) => {
        setBrokenBreakpoint(broken);
      }}
      onCollapse={(collapsed: boolean) => {
        setCollapsed(collapsed);
      }}
      zeroWidthTriggerStyle={{
        borderColor: '#E6CE97',
        borderStyle: 'solid',
        borderWidth: `1px 1px 1px ${collapsed ? '1px' : '0'}`,
        top: 0,
      }}
      theme={isDark ? 'dark' : 'light'}
      style={{
        minHeight: '100vh',
        backgroundColor: 'transparent',
        ...style,
      }}
      className={styles['product-detail-sidebar__sider']}
    >
      <Affix>
        <div
          className={styles['product-detail-sidebar__top']}
          style={{
            display: brokenBreakpoint && collapsed ? 'none' : 'flex',
          }}
        >
          <Button type="link">
            <Link to="..">
              <LeftOutlined /> <TableOutlined />
            </Link>
          </Button>
        </div>
      </Affix>
      {product && <ProductDetailInfo product={product} />}
    </Sider>
  );
};
