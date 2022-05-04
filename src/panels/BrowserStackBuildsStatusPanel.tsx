import { isEmpty, last } from 'lodash';
import { Tooltip } from 'native-base';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import Download from '../components/Download';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import StatusIcon from '../components/StatusIcon';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import { useFetch } from '../hooks/useCollectedData';
import { styleSheetFactory } from '../themes';
import {
  applyFilters,
  config,
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
  const { loading, data = [] } = useFetch(
    `${config.get('metricsEndpoint')}/data/browserstack.json`
  );

  const { filterByVersion, filterByTeam, isFilteringActive } = useAppContext();
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);
  const latest = last(data);

  const filteredByVersion = useMemo(
    () =>
      applyFilters(
        latest?.BrowserStackAppAutomateBuilds.filter(
          (d: any) => !isEmpty(getBrowserStackBuildInfo(d).version)
        ),
        filterByVersion,
        filterByTeam,
        d => d.automation_build.name
      ),
    [latest?.BrowserStackAppAutomateBuilds, filterByVersion, filterByTeam]
  );

  const timeouts = !!filteredByVersion.find(
    b => b.automation_build.status === TIMEOUT
  );
  const errors = !!filteredByVersion.find(
    b => b.automation_build.status === ERROR
  );

  const hasData = !isEmpty(filteredByVersion);
  const variant = errors ? 'error' : timeouts ? 'highlight' : undefined;

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
        <ZoomButton panelId={PANEL_ID} />

        {hasData && (
          <Download
            data={filteredByVersion}
            filename={`browserstack_builds${
              filterByVersion ? `_${filterByVersion}` : ''
            }.json`}
          />
        )}

        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
        {loading && !hasData && <Panel.Loading />}
        {!loading && !hasData && <Panel.Empty />}

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
      </Panel.Body>

      {hasData && (
        <Panel.Footer>
          Last update: {formatDate(latest!.createdAt)}
        </Panel.Footer>
      )}
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
