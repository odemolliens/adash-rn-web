import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Tooltip } from 'native-base';
import { Pressable } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useAppContext } from '../contexts/AppContext';
import { DEFAULT_THEME } from '../themes';

export default function ConfigurationButton() {
  const { colorScheme } = useAppContext();
  const navigation = useNavigation();
  const [_, theme] = useTheme(DEFAULT_THEME, colorScheme);

  return (
    <Tooltip label="Configuration">
      <Pressable onPress={() => navigation.navigate('CONFIGURATION' as never)}>
        <Ionicons name="build" size={18} color={theme.textColor} />
      </Pressable>
    </Tooltip>
  );
}
