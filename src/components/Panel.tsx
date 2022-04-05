import { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useAppContext } from '../contexts/AppContext';
import useBreapoint from '../hooks/useBreakpoint';
import { baseCss, styleSheetFactory } from '../themes';
import AlertBox from './AlertBox';

type PanelVariant = 'highlight' | 'error';

type PanelProps = {
  children: ReactNode;
  variant?: PanelVariant;
  id: string;
};

export default function Panel({ children, variant, id }: PanelProps) {
  const breakpoint = useBreapoint();
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);

  return (
    <View
      style={styles.container}
      // @ts-ignore-next-line
      dataSet={{ panelId: id }}
    >
      <View style={[variant && styles[variant], { flex: 1 }]}>
        <AlertBox panelId={id} />
        <View style={{ flex: 1 }}>{children}</View>
      </View>
    </View>
  );
}

Panel.Actions = function ({ children }: { children: ReactNode }) {
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);

  return (
    <View
      style={styles.actionsContainer}
      // @ts-ignore-next-line
      dataSet={{ html2canvasIgnore: true }}
    >
      {children}
    </View>
  );
};

Panel.Title = function ({ children }: { children: ReactNode }) {
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);
  return <Text style={styles.title}>{children}</Text>;
};

Panel.Subtitle = function ({ children }: { children: ReactNode }) {
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);
  return <Text style={styles.subtitle}>{children}</Text>;
};

Panel.Body = function ({ children }: { children?: ReactNode }) {
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);

  return (
    <ScrollView
      style={{
        width: '100%',
        aspectRatio: 3 / 2,
        paddingHorizontal: 10,
      }}
      contentContainerStyle={styles.body}
    >
      {children}
    </ScrollView>
  );
};

Panel.Footer = function ({ children }: { children?: ReactNode }) {
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);

  return <Text style={[baseCss.textItalic, styles.footer]}>{children}</Text>;
};

Panel.Empty = function ({ children }: { children?: ReactNode }) {
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text style={[baseCss.textCenter, baseCss.textItalic, styles.empty]}>
        {children ? children : 'No data to display.'}
      </Text>
    </View>
  );
};

Panel.Error = Panel.Empty;

const themedStyles = styleSheetFactory(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.accentBackgroundColor,
    padding: 12,
    borderRadius: 20,
    position: 'relative',
    justifyContent: 'space-between',
  },
  innerContainer: { flex: 1 },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 5,
  },
  panel: { flex: 1, justifyContent: 'space-between' },
  highlight: {
    borderColor: '#ACC236',
    borderWidth: 2,
    padding: 10,
    borderRadius: 20,
    margin: -12,
  },
  error: {
    borderColor: '#FF3843',
    borderWidth: 2,
    padding: 10,
    borderRadius: 20,
    margin: -12,
  },
  title: {
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 32,
    color: theme.textColor,
  },
  subtitle: { color: theme.textColor },
  body: { marginTop: 10, flex: 1 },
  empty: { color: theme.textColor },
  footer: {
    alignSelf: 'flex-end',
    marginTop: 15,
    fontSize: 12,
    color: theme.textColor,
  },
}));
