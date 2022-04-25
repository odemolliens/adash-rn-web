import { HStack, Switch, Tooltip } from 'native-base';
import { useEffect, useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useInterval } from 'usehooks-ts';
import * as GitlabHelper from '../api/gitlab_helper';
import Download from '../components/Download';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import StatusIcon from '../components/StatusIcon';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import { baseCss, styleSheetFactory } from '../themes';
import { downloadPanelData, formatDate } from '../utils';
import Constants from 'expo-constants';

const config = Constants.manifest?.extra!;
const PANEL_ID = 'IssueListPanel';

function getVariantByLabel(issue: GitlabHelper.Issue) {
  if (issue.state === 'closed') {
    return 'success';
  }
  if (issue.assignee !== null) {
    return 'progress';
  }
  if (issue.labels.includes('low')) {
    return undefined;
  } else if (issue.labels.includes('medium')) {
    return 'warning';
  } else if (issue.labels.includes('high')) {
    return 'error';
  }
}

export default function IssueListPanel() {
  const {
    colorScheme,
    zoomedPanel,
    setZoomedPanel,
    closeZoomedPanel,
    setFlashMessage,
    clearFlashMessage,
  } = useAppContext();
  const zoomed = zoomedPanel === PANEL_ID;
  const [styles] = useTheme(themedStyles, colorScheme);
  const [issues, setIssues] = useState<GitlabHelper.Issue[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | undefined>();
  const [showCritical, setShowCritical] = useState(true);

  const fetchIssues = async () => {
    try {
      setIssues(
        await GitlabHelper.getIssues(
          config.GitLab.projectId,
          config.GitLab.token
        )
      );

      setLastUpdate(new Date());

      clearFlashMessage();
    } catch (e) {
      setFlashMessage({ type: 'error', message: String(e), panelId: PANEL_ID });
    }
  };

  useInterval(fetchIssues, 60 * 1000);

  useEffect(() => {
    fetchIssues();
  }, []);

  const noData = issues.length === 0;
  const inError = !noData;
  const filtered = issues.filter((i: any) =>
    showCritical ? i.labels.includes('high') : true
  );

  return (
    <Panel variant={inError ? 'error' : undefined} id={PANEL_ID}>
      <Panel.Title>Active Issues</Panel.Title>

      <Panel.Actions>
        <Pressable onPress={() => setShowCritical(!showCritical)}>
          <HStack alignItems="center" style={{ marginRight: 4 }}>
            <Text style={styles.toggleText}>Show only critical</Text>
            <Switch size="sm" isChecked={showCritical} />
          </HStack>
        </Pressable>

        <ZoomButton
          zoomed={zoomed}
          onZoom={() => setZoomedPanel(PANEL_ID)}
          onZoomOut={() => closeZoomedPanel()}
        />

        {lastUpdate && (
          <Download
            onPress={() =>
              downloadPanelData(issues, `issues_${formatDate(lastUpdate)}.json`)
            }
          />
        )}

        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      {!noData && (
        <Panel.Subtitle>
          Current active issues:{' '}
          <Text style={baseCss.textBold}>{issues.length}</Text>
        </Panel.Subtitle>
      )}

      <Panel.Body>
        {filtered.map(issue => {
          const onPress = () => Linking.openURL(issue.web_url);

          return (
            <View style={styles.row} key={issue.id}>
              <Tooltip label={`${issue.title} ${issue.labels.join(', ')}`}>
                <Text>
                  <StatusIcon
                    variant={getVariantByLabel(issue)}
                    onPress={onPress}
                  />
                </Text>
              </Tooltip>

              <Text style={styles.text} onPress={onPress}>
                {issue.title.slice(7)} - {formatDate(issue.created_at)}
              </Text>
            </View>
          );
        })}

        {noData && <Panel.Empty />}
      </Panel.Body>

      <Panel.Footer>
        Last update: {lastUpdate ? formatDate(lastUpdate) : 'updating...'}
      </Panel.Footer>
    </Panel>
  );
}

const themedStyles = styleSheetFactory(theme => ({
  text: { padding: 3, marginBottom: 1, color: theme.textColor },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: { color: theme.textColor },
}));
