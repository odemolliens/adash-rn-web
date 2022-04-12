import { StyleSheet, useColorScheme } from 'react-native';
import { registerThemes } from 'react-native-themed-styles';

import { config } from './utils';

const light = config.themes.light;
const dark = config.themes.dark;

export const baseCss = StyleSheet.create({
  textBold: { fontWeight: '700' },
  textItalic: { fontStyle: 'italic' },
  textCenter: { textAlign: 'center' },
  textUnderline: { textDecorationLine: 'underline' },
});

export const DEFAULT_COLOR_SCHEME = 'light';

const styleSheetFactory = registerThemes(
  { light, dark },
  () => useColorScheme() || DEFAULT_COLOR_SCHEME
);

export const DEFAULT_THEME = styleSheetFactory(() => ({}));

export { styleSheetFactory };
