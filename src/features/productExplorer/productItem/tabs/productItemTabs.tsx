import { FC } from 'react';
import StickyBox from 'react-sticky-box';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import styles from './productItemTabs.module.scss';

interface ProductItemTabsProps {
  items: TabsProps['items'];
  activeKey: string;
  onChange: (activeKey: string) => void;
}

export const ProductItemTabs: FC<ProductItemTabsProps> = ({
  items,
  activeKey,
  onChange,
}) => {
  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <StickyBox offsetTop={240} style={{ zIndex: 1 }}>
      <DefaultTabBar {...props} className={styles['product-item-tabbar']} />
    </StickyBox>
  );

  return (
    <Tabs
      className={styles['product-item-tabs']}
      activeKey={activeKey}
      renderTabBar={renderTabBar}
      items={items}
      tabPosition="bottom"
      onChange={onChange}
    />
  );
};
