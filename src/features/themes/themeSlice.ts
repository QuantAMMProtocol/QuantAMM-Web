import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ActiveThemes } from './themeModels';

const initialState: ActiveThemes = {
  isDarkTheme: true,
  chartTheme: 'ag-polychroma-dark',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState: initialState,
  reducers: {
    changeTheme: (state, action: PayloadAction<boolean>) => {
      state.isDarkTheme = action.payload;
      if (action.payload) {
        document.body.setAttribute('data-theme', 'dark');
        state.chartTheme = 'ag-polychroma-dark';
      } else {
        document.body.setAttribute('data-theme', 'light');
        state.chartTheme = 'ag-polychroma';
      }
    },
  },
});

export const { changeTheme } = themeSlice.actions;

export default themeSlice.reducer;

export const selectTheme = (state: RootState) => state.theme.isDarkTheme;
export const selectAgGridTheme = (state: RootState) =>
  state.theme.isDarkTheme ? 'ag-theme-quartz-dark' : 'ag-theme-quartz';
export const selectAgChartTheme = (state: RootState) => state.theme.chartTheme;
