import { Ionicons } from '@expo/vector-icons';
import { last } from 'lodash';
import { Tooltip } from 'native-base';
import { Pressable } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useAppContext } from '../contexts/AppContext';
import { DEFAULT_THEME } from '../themes';
import { downloadPanelScreenshot } from '../utils';

type ScreenshotButtonProps = {
  panelId: string;
};

export default function ScreenshotButton({ panelId }: ScreenshotButtonProps) {
  const { colorScheme } = useAppContext();
  const [_, theme] = useTheme(DEFAULT_THEME, colorScheme);

  function onPress() {
    const element: HTMLElement = last(
      document.querySelectorAll(`[data-panel-id='${panelId}']`)
    )!;

    downloadPanelScreenshot(element);
  }

  return (
    <Tooltip label="Export as PNG">
      <Pressable onPress={onPress}>
        <Ionicons name="camera-outline" size={18} color={theme.textColor} />
      </Pressable>
    </Tooltip>
  );
}
