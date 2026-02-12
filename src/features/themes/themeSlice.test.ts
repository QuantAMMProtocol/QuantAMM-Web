import { afterEach, describe, expect, it, vi } from 'vitest';
import themeReducer, {
  changeTheme,
  selectAgChartTheme,
  selectAgGridTheme,
  selectTheme,
} from './themeSlice';

describe('themeSlice view-model logic', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('initializes with dark theme enabled', () => {
    const state = themeReducer(undefined, { type: '@@INIT' });

    expect(state.isDarkTheme).toBe(true);
    expect(state.chartTheme).toBe('ag-polychroma-dark');
  });

  it('switches between light and dark theme while updating document body attribute', () => {
    const setAttribute = vi.fn();
    vi.stubGlobal('document', {
      body: {
        setAttribute,
      },
    });

    const initialState = themeReducer(undefined, { type: '@@INIT' });
    const lightState = themeReducer(initialState, changeTheme(false));
    const darkState = themeReducer(lightState, changeTheme(true));

    expect(lightState.isDarkTheme).toBe(false);
    expect(lightState.chartTheme).toBe('ag-polychroma');
    expect(darkState.isDarkTheme).toBe(true);
    expect(darkState.chartTheme).toBe('ag-polychroma-dark');
    expect(setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    expect(setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });

  it('selectors resolve grid/chart themes from state', () => {
    const lightState = {
      theme: {
        isDarkTheme: false,
        chartTheme: 'ag-polychroma',
      },
    } as any;
    const darkState = {
      theme: {
        isDarkTheme: true,
        chartTheme: 'ag-polychroma-dark',
      },
    } as any;

    expect(selectTheme(lightState)).toBe(false);
    expect(selectAgGridTheme(lightState)).toBe('ag-theme-quartz');
    expect(selectAgChartTheme(lightState)).toBe('ag-polychroma');
    expect(selectAgGridTheme(darkState)).toBe('ag-theme-quartz-dark');
  });
});
