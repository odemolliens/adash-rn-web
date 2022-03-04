import React, { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useAppContext } from '../contexts/AppContext';
import { styleSheetFactory } from '../themes';

type ChipVariant = 'highlight' | 'error' | 'warning' | 'success';

type ChipProps = {
  children: ReactNode;
  variant?: ChipVariant;
  onPress?: () => void;
};

export default React.forwardRef(function Chip(
  { children, variant, onPress }: ChipProps,
  ref: any
) {
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);

  return (
    <Pressable onPress={onPress} pointerEvents={onPress ? 'auto' : 'none'}>
      <Text style={[styles.chip, variant && styles[variant]]}>{children}</Text>
    </Pressable>
  );
});

const themedStyles = styleSheetFactory(theme => ({
  chip: {
    overflow: 'hidden',
    borderRadius: 45,
    padding: 12,
    margin: 8,
    backgroundColor: theme.accentBackgroundColor,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    color: theme.textColor,
    minWidth: 40,
    justifyContent: 'center',
  },
  highlight: {
    color: theme.textColor2,
    backgroundColor: theme.accentBackgroundColor2,
  },
  error: { backgroundColor: '#FF2158' },
  warning: { backgroundColor: '#FFD134' },
  success: { backgroundColor: '#0FC389' },
}));
