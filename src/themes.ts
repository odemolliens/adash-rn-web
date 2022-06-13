import { StyleSheet, useColorScheme } from 'react-native';
import { registerThemes } from 'react-native-themed-styles';

import { config } from './utils';

const light = {
  backgroundColor: config.get('themes_light_backgroundColor'),
  accentBackgroundColor: config.get('themes_light_accentBackgroundColor'),
  accentBackgroundColor2: config.get('themes_light_accentBackgroundColor2'),
  textColor: config.get('themes_light_textColor'),
  textColor2: config.get('themes_light_textColor2'),
};

const dark = {
  backgroundColor: config.get('themes_dark_backgroundColor'),
  accentBackgroundColor: config.get('themes_dark_accentBackgroundColor'),
  accentBackgroundColor2: config.get('themes_dark_accentBackgroundColor2'),
  textColor: config.get('themes_dark_textColor'),
  textColor2: config.get('themes_dark_textColor2'),
};

export const baseCss = StyleSheet.create({
  textBold: { fontWeight: '700' },
  textItalic: { fontStyle: 'italic' },
  textCenter: { textAlign: 'center' },
  textUnderline: { textDecorationLine: 'underline' },
});

export const DEFAULT_COLOR_SCHEME = config.get('themes_defaultTheme', 'auto');

const styleSheetFactory = registerThemes({ light, dark }, () =>
  DEFAULT_COLOR_SCHEME === 'auto' ? useColorScheme() : DEFAULT_COLOR_SCHEME
);

export const DEFAULT_THEME = styleSheetFactory(() => ({}));

export { styleSheetFactory };
