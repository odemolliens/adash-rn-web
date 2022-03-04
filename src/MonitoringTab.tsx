import { Button, Menu, VStack } from 'native-base';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import GridView from 'react-native-draggable-gridview';
import { useTheme } from 'react-native-themed-styles';
import { useLocalStorage } from 'usehooks-ts';
import AuthenticateMenuItem from './components/ConfigMenu/AuthenticateMenuItem';
import ConfigMenu from './components/ConfigMenu/ConfigMenu';
import EditGridSizeMenuItem from './components/ConfigMenu/EditGridSizeMenuItem';
import EditPanelsMenuItem from './components/ConfigMenu/EditPanelsMenuItem';
import Notifications from './components/Notifications';
import PanelsBar from './components/PanelsBar';
import TeamList from './components/TeamList';
import VersionList from './components/VersionList';
import { useAppContext } from './contexts/AppContext';
import {
  BitriseBuildsChartPanel,
  BitriseBuildsStatusPanel,
  BrowserStackBuildsChartPanel,
  BrowserStackBuildsStatusPanel,
  GitlabJobsChartPanel,
  GitlabMergeRequestsChartPanel,
  GitlabMergeRequestsClosedLast24hPanel,
  GitlabMergeRequestsListPanel,
  GitlabPipelinesChartPanel,
  GitlabPipelineSchedulesPanel,
  GitlabPipelinesListPanel,
  IssueListPanel,
  StatusOperationalChartPanel,
} from './panels';
import { applyChartTheme } from './panels/chartjs';
import { styleSheetFactory } from './themes';
import { config } from './utils';

const PANELS: Record<string, () => JSX.Element> = {
  IssueListPanel,
  StatusOperationalChartPanel,
  BitriseBuildsChartPanel,
  BitriseBuildsStatusPanel,
  BrowserStackBuildsChartPanel,
  BrowserStackBuildsStatusPanel,
  GitlabJobsChartPanel,
  GitlabMergeRequestsChartPanel,
  GitlabMergeRequestsClosedLast24hPanel,
  GitlabMergeRequestsListPanel,
  GitlabPipelinesChartPanel,
  GitlabPipelineSchedulesPanel,
  GitlabPipelinesListPanel,
};

export default function MonitoringTab() {
  const { width: maxWidth } = useWindowDimensions();
  const { colorScheme, zoomedPanel } = useAppContext();
  const [styles, theme] = useTheme(themedStyles, colorScheme);
  const [editing, setEditing] = useState(false);
  const [gridSize, setGridSize] = useLocalStorage(
    'config.tabs.monitoring.gridSize_' + config.id,
    config.tabs.monitoring.gridSize + ''
  );
  const hasZoomedPanel = !!zoomedPanel;

  applyChartTheme(theme);

  const [data, setData] = useLocalStorage(
    'config.tabs.monitoring.panels_' + config.id,
    config.tabs.monitoring.panels
  );

  const renderGridItem = (item: string) => (
    <View style={styles.gridItemContainer}>
      <VStack space={2} h="full">
        {editing && (
          <Button
            onPress={() =>
              setData((data: any) => data.filter((d: any) => d != item))
            }
          >
            Remove
          </Button>
        )}
        {React.createElement(PANELS[item])}
      </VStack>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView>
          <ScrollView
            contentContainerStyle={[styles.filtersContainer, { maxWidth }]}
            horizontal
          >
            <View style={styles.filtersInnerContainer}>
              <VersionList loopCountdown={60} active={!hasZoomedPanel} />
              <TeamList />
            </View>

            <View style={styles.dashboardActions}>
              <Notifications />

              <ConfigMenu>
                <Menu.Item>
                  <AuthenticateMenuItem />
                </Menu.Item>

                <Menu.Item>
                  <EditPanelsMenuItem
                    editing={editing}
                    onEditPress={() => setEditing(!editing)}
                  />
                </Menu.Item>

                <Menu.Item>
                  <EditGridSizeMenuItem
                    gridSize={gridSize}
                    onChange={setGridSize}
                  />
                </Menu.Item>
              </ConfigMenu>
            </View>
          </ScrollView>

          <PanelsBar
            availablePanels={Object.keys(PANELS)}
            currentPanels={data}
            editing={editing}
            onChange={setData}
          />

          <GridView
            selectedStyle={{}}
            key={data.length + gridSize}
            data={data}
            locked={() => !editing}
            numColumns={parseInt(gridSize)}
            renderLockedItem={renderGridItem}
            renderItem={renderGridItem}
            onReleaseCell={items => setData(items)}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const themedStyles = styleSheetFactory(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeAreaContainer: {
    height: '100%',
    justifyContent: 'space-between',
    width: '100%',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  filtersInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    flex: 1,
  },
  dashboardActions: { flexDirection: 'row', alignItems: 'center' },
  gridItemContainer: {
    flex: 1,
    margin: 6,
    position: 'relative',
  },
}));
