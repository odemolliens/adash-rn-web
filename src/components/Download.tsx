import { Ionicons } from '@expo/vector-icons';
import { Tooltip } from 'native-base';
import { View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useAppContext } from '../contexts/AppContext';
import { DEFAULT_THEME } from '../themes';

type DownloadProps = {
  onPress: () => void;
  size?: number;
};

export default function Download({ onPress, size = 18 }: DownloadProps) {
  const { colorScheme } = useAppContext();
  const [_, theme] = useTheme(DEFAULT_THEME, colorScheme);

  return (
    <Tooltip label="Export as JSON">
      <View>
        <Ionicons
          name="ios-cloud-download-outline"
          size={size}
          color={theme.textColor}
          onPress={onPress}
        />
      </View>
    </Tooltip>
  );
}
