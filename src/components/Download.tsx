import { Ionicons } from '@expo/vector-icons';
import { Tooltip } from 'native-base';
import { View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useAppContext } from '../contexts/AppContext';
import { DEFAULT_THEME } from '../themes';
import { downloadPanelData } from '../utils';

type DownloadProps = {
  size?: number;
  data?: any;
  filename: string;
};

export default function Download({ data, filename, size = 18 }: DownloadProps) {
  const { colorScheme } = useAppContext();
  const [_, theme] = useTheme(DEFAULT_THEME, colorScheme);

  return (
    <Tooltip label="Export as JSON">
      <View>
        <Ionicons
          name="ios-cloud-download-outline"
          size={size}
          color={theme.textColor}
          onPress={() => downloadPanelData(data, filename)}
        />
      </View>
    </Tooltip>
  );
}
