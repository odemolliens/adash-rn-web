import { isEmpty, last } from 'lodash';
import { useMemo } from 'react';
import { Linking, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import Download from '../components/Download';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import useFetch from '../hooks/useFetch';
import { baseCss, styleSheetFactory } from '../themes';
import { applyFilters, config, formatDate } from '../utils';

const PANEL_ID = 'GitlabMergeRequestsClosedLast24hPanel';

export default function GitlabMergeRequestsClosedLast24hPanel() {
  const { loading, data: gitlabData = [] } = useFetch(`/data/gitlab.json`);

  const { filterByVersion, filterByTeam, isFilteringActive } = useAppContext();
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);
  const latest = last(gitlabData);
  const data = useMemo(
    () =>
      last(
        gitlabData.map(d =>
          applyFilters(
            d.GitLabClosedMergeRequests,
            filterByVersion,
            filterByTeam,
            'source_branch'
          )
        )
      ),
    [gitlabData, filterByVersion, filterByTeam]
  );
  const hasData = !isEmpty(data);

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>
        <View style={styles.filteredContainer}>
          <Text>Gitlab MRs closed in 24h</Text>

          {isFilteringActive && (
            <Text style={styles.filtered}>
              (filtered by:{' '}
              {[filterByVersion, filterByTeam].filter(Boolean).join(', ')})
            </Text>
          )}
        </View>
      </Panel.Title>

      {hasData && (
        <Panel.Subtitle>
          Gitlab merge requests closed in the last 24h:{' '}
          <Text style={baseCss.textBold}>{data!.length}</Text>
        </Panel.Subtitle>
      )}

      <Panel.Actions>
        <ZoomButton panelId={PANEL_ID} />

        {hasData && (
          <Download
            data={data}
            filename={`gitlab_mr_closed_24h${
              filterByVersion ? `_${filterByVersion}` : ''
            }.json`}
          />
        )}

        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
        {loading && !hasData && <Panel.Loading />}
        {!loading && !hasData && <Panel.Empty />}

        {hasData &&
          data!.map(mr => (
            <View key={mr.id} style={{ marginBottom: 1 }}>
              <Text
                style={styles.text}
                onPress={() => Linking.openURL(mr.web_url)}
              >
                {mr.title} - @{mr.author.name}
              </Text>
            </View>
          ))}
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
