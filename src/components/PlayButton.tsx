import { Ionicons } from '@expo/vector-icons';
import { Tooltip } from 'native-base';
import { Pressable } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useAppContext } from '../contexts/AppContext';
import { DEFAULT_THEME } from '../themes';

type PlayButtonProps = {
  onPress: () => void;
  running: boolean;
};

export default function PlayButton({ onPress, running }: PlayButtonProps) {
  const { colorScheme } = useAppContext();
  const [_, theme] = useTheme(DEFAULT_THEME, colorScheme);

  return (
    <Tooltip label="Run Scheduled Pipeline">
      <Pressable onPress={onPress} disabled={running}>
        <Ionicons
          name={running ? 'stopwatch-outline' : 'play-circle-outline'}
          size={22}
          color={theme.textColor}
        />
      </Pressable>
    </Tooltip>
  );
}
