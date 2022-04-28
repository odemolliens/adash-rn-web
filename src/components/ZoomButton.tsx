import { Ionicons } from '@expo/vector-icons';
import { Tooltip } from 'native-base';
import { Pressable } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useAppContext } from '../contexts/AppContext';
import { DEFAULT_THEME } from '../themes';

type ZoomButtonProps = {
  panelId: string;
  zoomed?: boolean;
  onZoom?: () => void;
  onZoomOut?: () => void;
};

export default function ZoomButton({ panelId }: ZoomButtonProps) {
  const { isZoomed, setZoomedPanel, closeZoomedPanel } = useAppContext();

  const zoomed = isZoomed(panelId);
  const { colorScheme } = useAppContext();
  const [_, theme] = useTheme(DEFAULT_THEME, colorScheme);

  return (
    <Tooltip label="Zoom In/Out">
      <Pressable
        onPress={() => (zoomed ? closeZoomedPanel() : setZoomedPanel(panelId))}
      >
        <Ionicons
          name={zoomed ? 'contract' : 'expand'}
          size={18}
          color={theme.textColor}
        />
      </Pressable>
    </Tooltip>
  );
}
