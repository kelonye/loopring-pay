import { createMuiTheme } from '@material-ui/core/styles';
import { createSelector } from 'reselect';

export const isDarkSelector = createSelector(
  state => state.app.theme,
  theme => theme === 'dark'
);

export const secondaryColorSelector = createSelector(isDarkSelector, isDark =>
  isDark ? '#7aceff' : '#007cc3'
);

export default createSelector(
  isDarkSelector,
  secondaryColorSelector,
  (isDark, secondaryColor) =>
    createMuiTheme({
      typography: {
        fontFamily: ['Work Sans', 'sans-serif'].join(','),
      },
      palette: {
        isDark,
        type: isDark ? 'dark' : 'light',
        primary: {
          main: isDark ? '#ffffff' : '#373836',
        },
        secondary: {
          main: secondaryColor,
        },
      },
      overrides: {
        MuiButton: {
          root: {
            borderRadius: 2,
          },
        },
      },
    })
);
