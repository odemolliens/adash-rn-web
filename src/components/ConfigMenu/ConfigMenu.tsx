import { EvilIcons } from '@expo/vector-icons';
import { Menu, Pressable, Tooltip } from 'native-base';
import { ReactNode } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useAppContext } from '../../contexts/AppContext';
import { styleSheetFactory } from '../../themes';
import Chip from '../Chip';
import DarkLightSwitchMenuItem from './DarkLightSwitchMenuItem';

type ConfigMenuProps = {
  children?: ReactNode;
};

export default function ConfigMenu({ children }: ConfigMenuProps) {
  const { height } = useWindowDimensions();
  const { colorScheme } = useAppContext();
  const [styles, theme] = useTheme(themedStyles, colorScheme);

  return (
    <View style={styles.container}>
      <Menu
        w="200"
        maxHeight={height - 150}
        trigger={triggerProps => {
          return (
            <Tooltip label="Notifications">
              <Pressable
                accessibilityLabel="More options menu"
                {...triggerProps}
              >
                <Chip>
                  <EvilIcons name="gear" size={15} color={theme.textColor} />
                </Chip>
              </Pressable>
            </Tooltip>
          );
        }}
      >
        {children}
      </Menu>
    </View>
  );
}

const themedStyles = styleSheetFactory(() => ({
  container: { flexDirection: 'row', position: 'relative' },
}));
