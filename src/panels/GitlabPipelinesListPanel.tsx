import { last } from 'lodash';
import React from 'react';
import { Linking, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import Download from '../components/Download';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import { baseCss, styleSheetFactory } from '../themes';
import { applyFilters, downloadPanelData, formatDate } from '../utils';

const PANEL_ID = 'GitlabPipelinesListPanel';

export default function GitlabPipelinesListPanel() {
  const {
    filterByVersion,
    filterByTeam,
    isFilteringActive,
    data: { gitlabData },
    setZoomedPanel,
    zoomedPanel,
    closeZoomedPanel,
  } = useAppContext();
  const zoomed = zoomedPanel === PANEL_ID;
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);
  const latest = last(gitlabData)!;
  const data = last(
    gitlabData.map(d =>
      applyFilters(d.GitlabPipelineQueue, filterByVersion, filterByTeam, 'ref')
    )
  )!;

  const noData = !data.length;

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
        <Text style={baseCss.textBold}>{data!.length}</Text>
      </Panel.Subtitle>

      <Panel.Actions>
        <ZoomButton
          zoomed={zoomed}
          onZoom={() => setZoomedPanel(PANEL_ID)}
          onZoomOut={() => closeZoomedPanel()}
        />

        <Download
          onPress={() =>
            downloadPanelData(
              data,
              `gitlab_pipelines${
                filterByVersion ? `_${filterByVersion}` : ''
              }.json`
            )
          }
        />

        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
        {data.map(p => (
          <View key={p.id} style={{ marginBottom: 1 }}>
            <Text
              style={[styles.text, { padding: 3 }]}
              onPress={() => Linking.openURL(p.web_url)}
            >
              Ref: {p.ref} - {p.status}
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
