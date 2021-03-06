import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useAppContext } from '../../contexts/AppContext';
import { DEFAULT_THEME } from '../../themes';
import Chip from '../Chip';

type EditPanelsMenuItemProps = { editing: boolean; onEditPress: () => void };

export default function EditPanelsMenuItem({
  editing,
  onEditPress,
}: EditPanelsMenuItemProps) {
  const { colorScheme } = useAppContext();
  const [_, theme] = useTheme(DEFAULT_THEME, colorScheme);

  return (
    <Pressable onPress={onEditPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Chip variant={editing ? 'highlight' : undefined}>
          <Ionicons
            name="build"
            size={15}
            color={editing ? theme.textColor2 : theme.textColor}
          />
        </Chip>

        <Text>Manage panels</Text>
      </View>
    </Pressable>
  );
}
