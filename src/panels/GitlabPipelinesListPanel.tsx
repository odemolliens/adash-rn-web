import { isEmpty, last } from 'lodash';
import React, { useMemo } from 'react';
import { Linking, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import Download from '../components/Download';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import { useFetch } from '../hooks/useCollectedData';
import { baseCss, styleSheetFactory } from '../themes';
import { applyFilters, config, formatDate } from '../utils';

const PANEL_ID = 'GitlabPipelinesListPanel';

export default function GitlabPipelinesListPanel() {
  const { loading, data: gitlabData = [] } = useFetch(
    `${config.get('metricsEndpoint')}/data/gitlab.json`
  );

  const { filterByVersion, filterByTeam, isFilteringActive } = useAppContext();
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);
  const hasData = !isEmpty(gitlabData);
  const latest = last(gitlabData);
  const filteredByVersionAndTeam = useMemo(
    () =>
      last(
        gitlabData.map(d =>
          applyFilters(
            d.GitlabPipelineQueue,
            filterByVersion,
            filterByTeam,
            'ref'
          )
        )
      ),
    [latest, filterByVersion, filterByTeam]
  );

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
