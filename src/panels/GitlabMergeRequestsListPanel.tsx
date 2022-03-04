import { last } from 'lodash';
import { Linking, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import Download from '../components/Download';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import { baseCss, styleSheetFactory } from '../themes';
import { applyFilters, downloadPanelData, formatDate } from '../utils';

const PANEL_ID = 'GitlabMergeRequestsListPanel';

export default function GitlabMergeRequestsListPanel() {
  const {
    filterByVersion,
    filterByTeam,
    isFilteringActive,
    data: { gitlabData },
    zoomedPanel,
    setZoomedPanel,
    closeZoomedPanel,
  } = useAppContext();
  const zoomed = zoomedPanel === 'GitlabMergeRequestsListPanel';
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);
  const latest = last(gitlabData)!;
  const data = last(
    gitlabData.map(d =>
      applyFilters(
        d.GitLabOpenMergeRequests,
        filterByVersion,
        filterByTeam,
        'source_branch'
      )
    )
  )!;

  const noData = !data.length;

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>
        <View style={styles.filteredContainer}>
          <Text>Gitlab MRs list</Text>

          {isFilteringActive && (
            <Text style={styles.filtered}>
              (filtered by:{' '}
              {[filterByVersion, filterByTeam].filter(Boolean).join(', ')})
            </Text>
          )}
        </View>
      </Panel.Title>

      <Panel.Subtitle>
        Current Gitlab opened merge requests:{' '}
        <Text style={baseCss.textBold}>{data!.length}</Text>
      </Panel.Subtitle>

      <Panel.Actions>
        <ZoomButton
          zoomed={zoomed}
          onZoom={() => setZoomedPanel('GitlabMergeRequestsListPanel')}
          onZoomOut={() => closeZoomedPanel()}
        />

        <Download
          onPress={() =>
            downloadPanelData(
              data,
              `gitlab_open_mr${
                filterByVersion ? `_${filterByVersion}` : ''
              }.json`
            )
          }
        />

        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
        {data.map(mr => (
          <View key={mr.id} style={{ marginBottom: 1 }}>
            <Text
              style={styles.text}
              onPress={() => Linking.openURL(mr.web_url)}
            >
              {mr.title} - @{mr.author.name}
            </Text>
          </View>
        ))}

        {noData && <Panel.Empty />}
      </Panel.Body>

      <Panel.Footer>Last update: {formatDate(latest.createdAt)}</Panel.Footer>
    </Panel>
  );
}

const themedStyles = styleSheetFactory(theme => ({
  text: { padding: 3, marginBottom: 1, color: theme.textColor },
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
