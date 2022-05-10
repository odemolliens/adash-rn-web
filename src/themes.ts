import { StyleSheet, useColorScheme } from 'react-native';
import { registerThemes } from 'react-native-themed-styles';

import { config } from './utils';

const light = {
  backgroundColor: config.get('themes.light.backgroundColor'),
  accentBackgroundColor: config.get('themes.light.accentBackgroundColor'),
  accentBackgroundColor2: config.get('themes.light.accentBackgroundColor2'),
  textColor: config.get('themes.light.textColor'),
  textColor2: config.get('themes.light.textColor2'),
};

const dark = {
  backgroundColor: config.get('themes.dark.backgroundColor'),
  accentBackgroundColor: config.get('themes.dark.accentBackgroundColor'),
  accentBackgroundColor2: config.get('themes.dark.accentBackgroundColor2'),
  textColor: config.get('themes.dark.textColor'),
  textColor2: config.get('themes.dark.textColor2'),
};

export const baseCss = StyleSheet.create({
  textBold: { fontWeight: '700' },
  textItalic: { fontStyle: 'italic' },
  textCenter: { textAlign: 'center' },
  textUnderline: { textDecorationLine: 'underline' },
});

export const DEFAULT_COLOR_SCHEME = config.get('themes.defaultTheme', 'auto');

const styleSheetFactory = registerThemes({ light, dark }, () =>
  DEFAULT_COLOR_SCHEME === 'auto' ? useColorScheme() : DEFAULT_COLOR_SCHEME
);

export const DEFAULT_THEME = styleSheetFactory(() => ({}));

export { styleSheetFactory };
