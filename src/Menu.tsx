import { FC, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Switch, Divider, MenuProps } from 'antd';
import {
  RadarChartOutlined,
  HomeOutlined,
  LineChartOutlined,
  FireOutlined,
  SunOutlined,
  MoonOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { changeTheme, selectTheme } from './features/themes/themeSlice';
import { ROUTES } from './routesEnum';

import style from './app.module.scss';

type MenuItem = Required<MenuProps>['items'][number];

interface MenuComponentProps {
  initialise: (page: string) => void;
}

export const MenuComponent: FC<MenuComponentProps> = ({ initialise }) => {
  const [current, setCurrent] = useState<string>(ROUTES.HOME);
  const dispatch = useAppDispatch();
  const isDark = useAppSelector(selectTheme);
  const navigate = useNavigate();

  const toggleTheme = (isChecked: boolean) => {
    dispatch(changeTheme(isChecked));
    changeTheme(isChecked);
  };

  const handleClick: MenuProps['onClick'] = useCallback(
    (event: { key: string }) => {
      const key = event.key;
      setCurrent(key);
      navigate(key);
      setTimeout(() => initialise(event.key), 100);
    },
    [initialise, navigate]
  );

  const items: MenuItem[] = [
    {
      label: 'QuantAMM',
      key: ROUTES.HOME,
      icon: <HomeOutlined />,
    },
    {
      label: 'How it works',
      key: ROUTES.DOCUMENTATION,
      icon: <FireOutlined />,
    },
    {
      label: 'Simulator:',
      key: 'divider',
      disabled: true,
      icon: <Divider type="vertical" />,
    },
    {
      label: 'Simulation Runner',
      key: ROUTES.SIMULATION_RUNNER,
      icon: <RadarChartOutlined />,
    },
    {
      label: 'Multi-run Simulation Results Comparer',
      key: ROUTES.SIMULATION_COMPARER,
      icon: <RadarChartOutlined />,
    },
    {
      label: 'Simulation Price Data',
      key: ROUTES.COINS,
      icon: <LineChartOutlined />,
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--main-background)',
        width: '100%',
      }}
    >
      <Menu
        onClick={handleClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
        overflowedIndicator={<MenuOutlined />}
        style={{
          width: '100%',
          backgroundColor: 'var(--main-background)',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '60px',
        }}
      >
        <Switch
          rootClassName="switch-root"
          className={style['switch-root']}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          checked={isDark}
          onChange={toggleTheme}
        />
      </div>
    </div>
  );
};
