import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useAppContext } from '../../contexts/AppContext';
import { DEFAULT_THEME } from '../../themes';
import Chip from '../Chip';

export default function AuthenticateMenuItem() {
  const { colorScheme, isAuthenticated, setAuth, logout } = useAppContext();
  const [_, theme] = useTheme(DEFAULT_THEME, colorScheme);

  return (
    <Pressable
      onPress={() => {
        isAuthenticated
          ? logout()
          : setAuth(
              prompt(
                'Please input the credentials in the format of `ProjectID:Token` (ex: 112233:AabbCcDd)'
              ) || ''
            );
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Chip variant={isAuthenticated ? 'highlight' : undefined}>
          <Ionicons
            name="lock-closed-outline"
            size={15}
            color={isAuthenticated ? theme.textColor2 : theme.textColor}
          />
        </Chip>
        <Text>Gitlab Credentials</Text>
      </View>
    </Pressable>
  );
}
