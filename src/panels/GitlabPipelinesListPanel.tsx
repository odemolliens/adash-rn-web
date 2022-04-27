import { isEmpty, last } from 'lodash';
import React from 'react';
import { Linking, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import Download from '../components/Download';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import { useFetchedData } from '../hooks/useCollectedData';
import { baseCss, styleSheetFactory } from '../themes';
import { applyFilters, formatDate } from '../utils';

const PANEL_ID = 'GitlabPipelinesListPanel';

export default function GitlabPipelinesListPanel() {
  const { data: gitlabData, loading } = useFetchedData('gitlab.json');
  const { filterByVersion, filterByTeam, isFilteringActive } = useAppContext();
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);
  const latest = last(gitlabData);
  const filteredByVersionAndTeam = last(
    gitlabData.map(d =>
      applyFilters(d.GitlabPipelineQueue, filterByVersion, filterByTeam, 'ref')
    )
  );
  const hasData = !isEmpty(filteredByVersionAndTeam);

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>
        <View style={styles.filteredContainer}>
          <Text>Gitlab Pipelines list</Text>

          {isFilteringActive && (
            <Text style={styles.filtered}>
              (filtered by:{' '}
              {[filterByVersion, filterByTeam].filter(Boolean).join(', ')})
            </Text>
          )}
        </View>
      </Panel.Title>

      <Panel.Subtitle>
        Current Gitlab pipelines:{' '}
        <Text style={baseCss.textBold}>{filteredByVersionAndTeam?.length}</Text>
      </Panel.Subtitle>

      <Panel.Actions>
        <ZoomButton panelId={PANEL_ID} />

        {hasData && (
          <Download
            data={filteredByVersionAndTeam}
            filename={`gitlab_pipelines${
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
          filteredByVersionAndTeam!.map(p => (
            <View key={p.id} style={{ marginBottom: 1 }}>
              <Text
                style={[styles.text, { padding: 3 }]}
                onPress={() => Linking.openURL(p.web_url)}
              >
                Ref: {p.ref} - {p.status}
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
