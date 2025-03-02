import { FC, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Switch, MenuProps, Button } from 'antd';
import {
  RadarChartOutlined,
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
    dispatch(changeTheme(isChecked || (current as ROUTES) == ROUTES.HOME));
    changeTheme(isChecked);
  };

  const handleClick: MenuProps['onClick'] = useCallback(
    (event: { key: string }) => {
      const key = event.key;
      if ((key as ROUTES) == ROUTES.HOME) {
        dispatch(changeTheme(true));
      }
      setCurrent(key);
      navigate(key);
      setTimeout(() => initialise(event.key), 100);
    },
    [initialise, navigate, dispatch]
  );

  function getItems(): MenuItem[] {
    return [
      {
        key: 'home',
        label: '',
        icon: (
          <img
            loading="lazy"
            src="/assets/quantamm-logo.png"
            style={{ width: '150px', marginTop: '5px' }}
          />
        ),
      },
      {
        key: 'About',
        label: 'About',
        type: 'submenu',
        children: [
          {
            key: 'Company',
            label: 'Company',
            icon: <FireOutlined />,
          },
          {
            key: 'Vision',
            label: 'Vision',
            icon: <FireOutlined />,
          },
          {
            key: 'contact',
            label: 'Contact',
            icon: <LineChartOutlined />,
          },
        ],
        style: { marginLeft: 'auto' }, // Align to the right
      },
      {
        key: 'Education',
        label: 'Education',
        type: 'submenu',
        children: [
          {
            key: 'research',
            label: 'Research',
            icon: <FireOutlined />,
          },
          {
            key: 'documentation',
            label: 'Documentation',
            icon: <FireOutlined />,
          },
          {
            key: 'simulation-runner',
            label: 'Historical Simulator',
            icon: <LineChartOutlined />,
          },
          {
            key: 'simulation-comparer',
            label: 'Multi-run Simulation Results Comparer',
            icon: <RadarChartOutlined />,
          },
          {
            key: 'coins',
            label: 'Simulation Price Data',
            icon: <LineChartOutlined />,
          },
        ],
      },
      {
        key: 'product-explorer',
        label: '',
        icon: (
          <Button type="primary" size="small" style={{ width: '100%' }}>
            Launch App
          </Button>
        ),
      },
    ];
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:
          (current as ROUTES) == ROUTES.HOME
            ? '#2c496b'
            : 'var(--main-background)',
        width: '100%',
      }}
    >
      <Menu
        onClick={handleClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={getItems()}
        overflowedIndicator={<MenuOutlined />}
        style={{
          width: '100%',
          backgroundColor: 'transparent',
          height: '40px',
          lineHeight: '40px',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: (current as ROUTES) == ROUTES.HOME ? '0px' : '60px',
        }}
        hidden={(current as ROUTES) == ROUTES.HOME}
      >
        <div hidden={(current as ROUTES) == ROUTES.HOME}>
          <Switch
            rootClassName="switch-root"
            className={style['switch-root']}
            checkedChildren={<MoonOutlined />}
            disabled={(current as ROUTES) == ROUTES.HOME}
            unCheckedChildren={<SunOutlined />}
            checked={isDark || (current as ROUTES) == ROUTES.HOME}
            onChange={toggleTheme}
          />
        </div>
      </div>
    </div>
  );
};
