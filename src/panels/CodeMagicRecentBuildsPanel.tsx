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
  extractTeams,
  extractVersions,
  formatDate,
} from '../utils';

const ERROR = 'failed';
const SUCCESS = 'finished';
const IN_PROGRESS = 'in-progress';
const ABORTED = 'canceled';

const PANEL_ID = 'CodeMagicRecentBuildsPanel';

function getVariant(build: { status: string }) {
  switch (build.status) {
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

export default function CodeMagicRecentBuildsPanel() {
  const { loading, data: codeMagicData = [] } = useFetch(
    'http://localhost:3000/data/codemagic.json'
  );

  const { filterByVersion, filterByTeam, isFilteringActive } = useAppContext();
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);
  const latest = last(codeMagicData);

  const filteredByVersionAndTeam = useMemo(
    () =>
      applyFilters(
        latest?.CodeMagicRecentBuilds,
        filterByVersion,
        filterByTeam,
        d => d.branch
      ),
    [latest?.CodeMagicRecentBuilds, filterByVersion, filterByTeam]
  );

  const hasData = !isEmpty(filteredByVersionAndTeam);

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>
        <View style={styles.filteredContainer}>
          <Text>CodeMagic Recent Builds</Text>

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
            data={filteredByVersionAndTeam}
            filename="codemagic_recet_builds.json"
          />
        )}

        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
        {loading && !hasData && <Panel.Loading />}
        {!loading && !hasData && <Panel.Empty />}

        {hasData &&
          filteredByVersionAndTeam.map((b: any) => {
            return (
              <View style={styles.row} key={b._id}>
                <Tooltip label={b.status}>
                  <Text>
                    <StatusIcon variant={getVariant(b)} />
                  </Text>
                </Tooltip>

                <Text style={styles.text}>
                  {`${b.fileWorkflowId.replaceAll('_', ' ').toUpperCase()} - ${
                    extractTeams(b.branch)[0]
                  } - ${
                    extractVersions(b.branch)[0]
                  } - Created At: ${formatDate(b.createdAt)} Finished At: ${
                    b.finishedAt ? formatDate(b.finishedAt) : 'Not finished'
                  }`}
                </Text>
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
