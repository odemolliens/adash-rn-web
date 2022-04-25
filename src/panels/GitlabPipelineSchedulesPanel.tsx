import { last } from 'lodash';
import { HStack, Switch, Tooltip } from 'native-base';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import * as GitlabHelper from '../api/gitlab_helper';
import Download from '../components/Download';
import Panel from '../components/Panel';
import PlayButton from '../components/PlayButton';
import ScreenshotButton from '../components/ScreenshotButton';
import StatusIcon from '../components/StatusIcon';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import { styleSheetFactory } from '../themes';
import { downloadPanelData, formatDate } from '../utils';

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
  const {
    data: { gitlabData },
    setZoomedPanel,
    zoomedPanel,
    closeZoomedPanel,
    isAuthenticated,
    clearFlashMessage,
    colorScheme,
    setFlashMessage,
    auth,
  } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);
  const zoomed = zoomedPanel === PANEL_ID;
  const latest = last(gitlabData)!;
  const [showInactive, setShowInactive] = useState(false);
  const [runList, setRunList] = useState<string[]>([]);
  const filtered = latest.GitlabPipelineSchedules.filter((p: any) =>
    showInactive ? true : p.active
  );

  const runPipeline = async ({ id }: { id: string }) => {
    try {
      await GitlabHelper.runScheduledPipelineById(
        auth!.projectId,
        id,
        auth!.token
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

        <ZoomButton
          zoomed={zoomed}
          onZoom={() => setZoomedPanel(PANEL_ID)}
          onZoomOut={() => closeZoomedPanel()}
        />

        <Download
          onPress={() =>
            downloadPanelData(filtered, 'gitlab_pipeline_schedules.json')
          }
        />

        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
        {filtered.map((ps: PipelineSchedule) => {
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
                    confirm(`Are you sure you want to run ${ps.description}`) &&
                      runPipeline(ps);
                  }}
                />
              )}
            </View>
          );
        })}
      </Panel.Body>

      <Panel.Footer>Last update: {formatDate(latest!.createdAt)}</Panel.Footer>
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
