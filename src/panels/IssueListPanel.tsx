import { isEmpty } from 'lodash';
import { HStack, Switch, Tooltip } from 'native-base';
import { useEffect, useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import * as GitlabHelper from '../api/gitlab_helper';
import ConfigurationButton from '../components/ConfigurationButton';
import Download from '../components/Download';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import StatusIcon from '../components/StatusIcon';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import useFetchIssueList from '../hooks/useFetchIssueList';
import { registerPanelConfigs } from '../panelsStore';
import { baseCss, styleSheetFactory } from '../themes';
import { config, formatDate } from '../utils';

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

registerPanelConfigs({
  [PANEL_ID]: {
    label: 'GitLab (IssueList)',
    configs: [
      {
        type: 'string',
        label: 'Project Id',
        configKey: 'IssueListPanel_projectId',
      },
      {
        type: 'string',
        label: 'Token',
        configKey: 'IssueListPanel_token',
      },
    ],
  },
});

export default function IssueListPanel() {
  const { colorScheme, setFlashMessage, clearFlashMessage, hasZoomedPanel } =
    useAppContext();

  const [styles] = useTheme(themedStyles, colorScheme);
  const [showCritical, setShowCritical] = useState(true);

  const {
    data: issues = [],
    loading,
    error,
    lastUpdate,
  } = useFetchIssueList(
    config.get('IssueListPanel_projectId'),
    config.get('IssueListPanel_token')
  );

  useEffect(() => {
    clearFlashMessage();

    if (error) {
      setFlashMessage({
        type: 'error',
        message: String(error),
        panelId: PANEL_ID,
      });
    }
  }, [error]);

  const hasData = !isEmpty(issues);
  const inError = !hasData;
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

        <ZoomButton panelId={PANEL_ID} />

        {lastUpdate && (
          <Download
            data={issues}
            filename={`issues_${formatDate(lastUpdate)}.json`}
          />
        )}

        <ScreenshotButton panelId={PANEL_ID} />
        {!hasZoomedPanel && <ConfigurationButton />}
      </Panel.Actions>

      {hasData && (
        <Panel.Subtitle>
          Current active issues:{' '}
          <Text style={baseCss.textBold}>{issues.length}</Text>
        </Panel.Subtitle>
      )}

      <Panel.Body>
        {loading && !hasData && <Panel.Loading />}
        {!loading && !hasData && <Panel.Empty />}

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
