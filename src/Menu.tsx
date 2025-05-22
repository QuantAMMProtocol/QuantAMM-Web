import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Switch, MenuProps, Button, Grid } from 'antd';
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

import { useLocation } from 'react-router-dom'; // add this at the top

type MenuItem = Required<MenuProps>['items'][number];

interface MenuComponentProps {
  initialise: (page: string) => void;
}

const { useBreakpoint } = Grid;

export const MenuComponent: FC<MenuComponentProps> = ({ initialise }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.lg && !screens.xl && !screens.xxl;

  const navigate = useNavigate();
  const path = window.location.pathname.split('/')[1];
  const [current, setCurrent] = useState<string>(
    path && path != '' ? (path as unknown as ROUTES) : ROUTES.HOME
  );
  const dispatch = useAppDispatch();
  const isDark = useAppSelector(selectTheme);


  const location = useLocation();

  useEffect(() => {
    const newPath = location.pathname.split('/')[1] || ROUTES.HOME;
    setCurrent(newPath as ROUTES);
    if ((newPath as ROUTES) === ROUTES.HOME) {
      dispatch(changeTheme((newPath as ROUTES) === ROUTES.HOME));
    }
  }, [location.pathname, dispatch]);

  const backgroundColor = useMemo(() => {
    return (current as ROUTES) == ROUTES.HOME
      ? '#2c496b'
      : 'var(--main-background)';
  }, [current]);

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

  function getMobileItems(): MenuItem[] {
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
        key: 'Education',
        label: '',
        type: 'submenu',
        icon: <MenuOutlined />,
        children: [
          {
            key: 'Company',
            label: 'Company',
            icon: <FireOutlined />,
          },
          {
            key: 'contact',
            label: 'Contact',
            icon: <LineChartOutlined />,
          },
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
            key: 'simulation-results-comparer',
            label: 'Multi-run Simulation Results Comparer',
            icon: <RadarChartOutlined />,
          },
          {
            key: 'coins',
            label: 'Simulation Price Data',
            icon: <LineChartOutlined />,
          },
          {
            key: 'tos',
            label: 'Terms of Service',
            icon: <LineChartOutlined />,
          }
        ],
        style: { marginLeft: 'auto' }, // Align to the right
      },
    ];
  }

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
            key: 'simulation-results-comparer',
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
        key: 'tos',
        label: 'Terms of Service',
      },
      {
        key: ROUTES.PRODUCT_EXPLORER + "/MAINNET/" + ROUTES.SAFEHAVENFACTSHEET,
        label: '',
        icon: (
            <Button
              type="primary"
              size="small"
              style={{ width: '100%', color: 'var(--main-background)' }}
            >
              View Safe Haven 
            </Button>
        ),
      },

      {
        key: ROUTES.PRODUCT_EXPLORER + "/BASE/" + ROUTES.BASEMACROFACTSHEET,
        label: '',
        icon: (
            <Button
              type="primary"
              size="small"
              style={{ width: '100%', color: 'var(--main-background)' }}
            >
              View Base Macro 
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
        backgroundColor: backgroundColor,
        width: '100%',
      }}
    >
      <Menu
        onClick={handleClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={isMobile ? getMobileItems() : getItems()}
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
          height: '20px',
          width: (current as ROUTES) == ROUTES.HOME ? '0px' : '40px',
          paddingRight: '10px',
        }}
        hidden={(current as ROUTES) == ROUTES.HOME}
      >
        <div hidden={(current as ROUTES) == ROUTES.HOME}>
          <Switch
            style={{ padding: 0, margin: 0 }}
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
