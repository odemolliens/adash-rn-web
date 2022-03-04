import { AntDesign } from '@expo/vector-icons';
import { Tooltip } from 'native-base';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useAppContext } from '../../contexts/AppContext';
import { DEFAULT_THEME } from '../../themes';
import Chip from '../Chip';

type EditGridSizeMenuItemProps = {
  gridSize: string;
  onChange: (value: string) => void;
};

export default function EditGridSizeMenuItem({
  gridSize,
  onChange,
}: EditGridSizeMenuItemProps) {
  const { colorScheme } = useAppContext();
  const [_, theme] = useTheme(DEFAULT_THEME, colorScheme);

  return (
    <Pressable
      onPress={() => onChange(prompt('Set Grid size', gridSize) || gridSize)}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Chip>
          <Tooltip label="Re-order panels">
            <View>
              <AntDesign name="edit" size={15} color={theme.textColor} />
            </View>
          </Tooltip>
        </Chip>
        <Text>Grid Size: {gridSize}</Text>
      </View>
    </Pressable>
  );
}
