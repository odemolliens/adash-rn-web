import { last } from 'lodash';
import { Tooltip } from 'native-base';
import { Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import Download from '../components/Download';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import StatusIcon from '../components/StatusIcon';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import { styleSheetFactory } from '../themes';
import {
  applyFilters,
  BrowserStackBuild,
  downloadPanelData,
  formatDate,
  getBrowserStackBuildInfo,
} from '../utils';

const ERROR = 'error';
const FAILED = 'failed';
const DONE = 'done';
const TIMEOUT = 'timeout';

const PANEL_ID = 'BrowserStackBuildsStatusPanel';

function getVariant(build: { status: string }) {
  switch (build.status) {
    case ERROR:
    case FAILED:
      return 'error';

    case TIMEOUT:
      return 'warning';

    case DONE:
      return 'success';

    default:
      return 'highlight';
  }
}

export default function BrowserStackBuildsStatusPanel() {
  const {
    filterByVersion,
    filterByTeam,
    isFilteringActive,
    data: { browserStackData },
    zoomedPanel,
    setZoomedPanel,
    closeZoomedPanel,
  } = useAppContext();

  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);

  const zoomed = zoomedPanel === PANEL_ID;
  const latest = last(browserStackData)!;

  const filteredByVersion: readonly BrowserStackBuild[] = applyFilters(
    latest.BrowserStackAppAutomateBuilds,
    filterByVersion,
    filterByTeam,
    d => getBrowserStackBuildInfo(d).version
  );

  const timeouts = !!filteredByVersion.find(
    b => b.automation_build.status === TIMEOUT
  );
  const errors = !!filteredByVersion.find(
    b => b.automation_build.status === ERROR
  );

  const variant = errors ? 'error' : timeouts ? 'highlight' : undefined;
  const noData = !filteredByVersion.length;

  return (
    <Panel variant={variant} id={PANEL_ID}>
      <Panel.Title>
        <View style={styles.filteredContainer}>
          <Text>BrowserStack builds status</Text>

          {isFilteringActive && (
            <Text style={styles.filtered}>
              (filtered by:{' '}
              {[filterByVersion, filterByTeam].filter(Boolean).join(', ')})
            </Text>
          )}
        </View>
      </Panel.Title>

      <Panel.Actions>
        <ZoomButton
          zoomed={zoomed}
          onZoom={() => setZoomedPanel(PANEL_ID)}
          onZoomOut={() => closeZoomedPanel()}
        />

        <Download
          onPress={() =>
            downloadPanelData(
              filteredByVersion,
              `browserstack_builds${
                filterByVersion ? `_${filterByVersion}` : ''
              }.json`
            )
          }
        />

        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
        {filteredByVersion.map(build => {
          const { automation_build } = build;
          const buildName = automation_build.name;

          return (
            <View style={styles.row} key={automation_build.hashed_id}>
              <Tooltip label={automation_build.status}>
                <Text>
                  <StatusIcon variant={getVariant(automation_build)} />
                </Text>
              </Tooltip>

              <Text style={styles.text}>{buildName}</Text>
            </View>
          );
        })}

        {noData && <Panel.Empty />}
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
  filteredContainer: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'baseline',
  },
  filtered: {
    color: 'gray',
    fontSize: 12,
    fontWeight: 'normal',
    marginLeft: 4,
  },
}));
