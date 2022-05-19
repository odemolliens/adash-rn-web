import { isEmpty, last } from 'lodash';
import { HStack, Switch, Tooltip } from 'native-base';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import * as GitlabHelper from '../api/gitlab_helper';
import ConfigurationButton from '../components/ConfigurationButton';
import Download from '../components/Download';
import Panel from '../components/Panel';
import PlayButton from '../components/PlayButton';
import ScreenshotButton from '../components/ScreenshotButton';
import StatusIcon from '../components/StatusIcon';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import useFetch from '../hooks/useFetch';
import { styleSheetFactory } from '../themes';
import { config, formatDate } from '../utils';

type PipelineSchedule = {
  id: string;
  description: string;
  active: boolean;
  next_run_at: string;
};

function getVariant(active: boolean) {
  switch (active) {
    case false:
      return 'warning';

    case true:
      return 'success';

    default:
      return 'highlight';
  }
}

const PANEL_ID = 'GitlabPipelineSchedulesPanel';

export default function GitlabPipelineSchedulesPanel() {
  const { addPanelsConfigurations, hasZoomedPanel } = useAppContext();

  useEffect(() => {
    addPanelsConfigurations({
      [PANEL_ID]: {
        label: 'Gitlab (PipelineSchedulesPanel)',
        configs: [
          {
            type: 'string',
            label: 'Project id',
            configKey: 'GitlabPipelineSchedulesPanel_projectId',
          },
          {
            type: 'string',
            label: 'Token',
            configKey: 'GitlabPipelineSchedulesPanel_token',
          },
        ],
      },
    });
  }, []);

  const [showInactive, setShowInactive] = useState(false);
  const [runList, setRunList] = useState<string[]>([]);

  const { loading, data: gitlabData = [] } = useFetch(`/data/gitlab.json`);

  const { clearFlashMessage, colorScheme, setFlashMessage } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);
  const latest = last(gitlabData);

  const filtered = latest?.GitlabPipelineSchedules.filter((p: any) =>
    showInactive ? true : p.active
  );

  const hasData = !isEmpty(filtered);

  const runPipeline = async ({ id }: { id: string }) => {
    try {
      await GitlabHelper.runScheduledPipelineById(
        config.get('GitlabPipelineSchedulesPanel_projectId'),
        id,
        config.get('GitlabPipelineSchedulesPanel_token')
      );

      setFlashMessage({
        type: 'success',
        message: 'Pipeline triggered for running',
        panelId: PANEL_ID,
      });

      setRunList(prev => [...prev, id]);

      setTimeout(() => {
        setRunList(prev => prev.filter(p => p !== id));
      }, 30 * 1000);

      clearFlashMessage();
    } catch (e) {
      setFlashMessage({ type: 'error', message: String(e), panelId: PANEL_ID });
    }
  };

  const isAuthenticated =
    config.get('GitlabPipelineSchedulesPanel_projectId') &&
    config.get('GitlabPipelineSchedulesPanel_token');

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>Gitlab Pipeline Schedules</Panel.Title>

      <Panel.Actions>
        <Pressable onPress={() => setShowInactive(!showInactive)}>
          <HStack alignItems="center" style={{ marginRight: 4 }}>
            <Text style={styles.toggleText}>Show Inactive</Text>
            <Switch size="sm" isChecked={showInactive} />
          </HStack>
        </Pressable>

        <ZoomButton panelId={PANEL_ID} />

        {hasData && (
          <Download data={filtered} filename="gitlab_pipeline_schedules.json" />
        )}

        <ScreenshotButton panelId={PANEL_ID} />
        {!hasZoomedPanel && <ConfigurationButton />}
      </Panel.Actions>

      <Panel.Body>
        {loading && !hasData && <Panel.Loading />}
        {!loading && !hasData && <Panel.Empty />}

        {hasData &&
          filtered.map((ps: PipelineSchedule) => {
            return (
              <View style={styles.row} key={ps.id}>
                <View style={[{ flex: 1 }, styles.row]}>
                  <Tooltip label={ps.active ? 'active' : 'inactive'}>
                    <Text>
                      <StatusIcon variant={getVariant(ps.active)} />
                    </Text>
                  </Tooltip>

                  <Text style={styles.text}>
                    {ps.description} - Next run at: {formatDate(ps.next_run_at)}
                  </Text>
                </View>

                {isAuthenticated && (
                  <PlayButton
                    running={runList.includes(ps.id)}
                    onPress={() => {
                      confirm(
                        `Are you sure you want to run ${ps.description}`
                      ) && runPipeline(ps);
                    }}
                  />
                )}
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
  toggleText: { color: theme.textColor },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
