import { last } from 'lodash';
import { Tooltip } from 'native-base';
import { Linking, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import Download from '../components/Download';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import StatusIcon from '../components/StatusIcon';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import { styleSheetFactory } from '../themes';
import { downloadPanelData, formatDate } from '../utils';

const ERROR = 'error';
const SUCCESS = 'success';
const IN_PROGRESS = 'in-progress';
const ABORTED = 'aborted';

const PANEL_ID = 'BitriseBuildsStatusPanel';

function getVariant(build: {
  status_text: string;
  triggered_workflow: string;
}) {
  switch (build.status_text) {
    case ERROR:
      return 'error';

    case ABORTED:
    case IN_PROGRESS:
      return 'warning';

    case SUCCESS:
      return 'success';

    default:
      return 'highlight';
  }
}

export default function BitriseBuildsStatusPanel() {
  const {
    data: { bitriseData },
    zoomedPanel,
    setZoomedPanel,
    closeZoomedPanel,
  } = useAppContext();
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);
  const zoomed = zoomedPanel === PANEL_ID;
  const latest = last(bitriseData)!;

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>Bitrise builds status</Panel.Title>

      <Panel.Actions>
        <ZoomButton
          zoomed={zoomed}
          onZoom={() => setZoomedPanel(PANEL_ID)}
          onZoomOut={() => closeZoomedPanel()}
        />

        <Download
          onPress={() =>
            downloadPanelData(latest.workflows, 'bitrise_status.json')
          }
        />

        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
        {Object.entries(latest.workflows).map(obj => {
          const [key, value] = obj as [string, any];
          const onPress = () =>
            Linking.openURL(`https://app.bitrise.io/build/${value.slug}`);

          return (
            <View style={styles.row} key={key}>
              <Tooltip label={value.status_text}>
                <Text>
                  <StatusIcon variant={getVariant(value)} onPress={onPress} />
                </Text>
              </Tooltip>

              <Text style={styles.text} onPress={onPress}>
                {`${key.toUpperCase()} - #${
                  value.build_number
                } Triggered: ${formatDate(value.triggered_at)} Finished: ${
                  value.finished_at
                    ? formatDate(value.finished_at)
                    : 'Not finished'
                }`}
              </Text>
            </View>
          );
        })}
      </Panel.Body>

      <Panel.Footer>Last update: {formatDate(latest!.createdAt)}</Panel.Footer>
    </Panel>
  );
}

const themedStyles = styleSheetFactory(theme => ({
  text: { padding: 3, marginBottom: 1, color: theme.textColor },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
