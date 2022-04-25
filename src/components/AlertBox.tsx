import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useAppContext } from '../contexts/AppContext';
import { baseCss, styleSheetFactory } from '../themes';

type AlertBoxProps = { panelId?: string };

export default function AlertBox({ panelId }: AlertBoxProps) {
  const { flashMessage, clearFlashMessage } = useAppContext();
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);

  if (!flashMessage?.message || flashMessage?.panelId !== panelId) return null;

  return (
    <View style={[styles.box, styles.row, styles[flashMessage.type]]}>
      <Text style={[styles.message, baseCss.textBold]}>
        {flashMessage.message}
      </Text>

      <Pressable onPress={() => clearFlashMessage()}>
        <Ionicons name="ios-close-sharp" size={24} color="white" />
      </Pressable>
    </View>
  );
}

const themedStyles = styleSheetFactory(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  box: {
    padding: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
  message: { flex: 1, color: '#fff' },
  error: {
    backgroundColor: '#FF3843',
  },
  success: {
    backgroundColor: '#0FC389',
  },
}));
