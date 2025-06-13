import { FC, PropsWithChildren, useEffect, useState } from 'react';
import type { ConfigProviderProps } from 'antd';
import { ConfigProvider, Grid, theme } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { useAppSelector } from './app/hooks';
import { selectTheme } from './features/themes/themeSlice';

const { useBreakpoint } = Grid;

type SizeType = ConfigProviderProps['componentSize'];

const darkTheme = {
  token: {
    colorPrimary: '#e6ce97',
    colorInfo: '#e6ce97',
    colorBgBase: '#162536',
    colorBgContainer: '#162536',
    colorBgLayout: '#162536',
    splitColor: '#162536',
    fontFamily: 'Jost',
  },
  Menu: {
    algorithm: true,
  },
};

const lightTheme = {
  token: {
    colorPrimary: '#3b340d',
    colorInfo: '#3b340d',
    colorBgBase: '#fff',
    colorBgContainer: 'rgb(245, 245, 245)',
    colorBgLayout: 'rgb(245, 245, 245)',
    fontFamily: 'Jost',
  },
  Menu: {
    algorithm: true,
  },
};

export const AntDesignThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const isDark = useAppSelector(selectTheme);
  const [componentSize, setComponentSize] = useState<SizeType>('large');

  const screens = useBreakpoint();

  let themeConfig = {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    Button: {
      algorithm: true,
    },
  };

  if (isDark) {
    themeConfig = {
      ...themeConfig,
      ...darkTheme,
    };
  } else {
    themeConfig = {
      ...themeConfig,
      ...lightTheme,
    };
  }

  useEffect(() => {
    if (screens.xl ?? screens.lg) {
      setComponentSize('large');
    } else {
      setComponentSize('small');
    }
  }, [screens]);

  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider theme={themeConfig} componentSize={componentSize}>
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
};
