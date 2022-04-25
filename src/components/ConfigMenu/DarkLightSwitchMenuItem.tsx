import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tooltip } from 'native-base';
import { Pressable, Text, View } from 'react-native';
import { useAppContext } from '../../contexts/AppContext';
import Chip from '../Chip';

export default function DarkLightSwitchMenuItem() {
  const { colorScheme, setColorScheme } = useAppContext();
  return (
    <Pressable
      onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Chip>
          <Tooltip label="Dark/Light mode">
            <Pressable
              onPress={() =>
                setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
              }
            >
              <MaterialCommunityIcons
                name="theme-light-dark"
                size={15}
                color={colorScheme !== 'dark' ? '#fff' : '#000'}
              />
            </Pressable>
          </Tooltip>
        </Chip>

        <Text>Switch Theme</Text>
      </View>
    </Pressable>
  );
}
