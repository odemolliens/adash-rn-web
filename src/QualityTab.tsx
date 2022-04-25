import { Button, Menu } from 'native-base';
import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import GridView from 'react-native-draggable-gridview';
import { useTheme } from 'react-native-themed-styles';
import { useLocalStorage } from 'usehooks-ts';
import ConfigMenu from './components/ConfigMenu/ConfigMenu';
import EditGridSizeMenuItem from './components/ConfigMenu/EditGridSizeMenuItem';
import EditPanelsMenuItem from './components/ConfigMenu/EditPanelsMenuItem';
import Notifications from './components/Notifications';
import Panel from './components/Panel';
import PanelsBar from './components/PanelsBar';
import TeamList from './components/TeamList';
import { useAppContext } from './contexts/AppContext';
import {
  AllureReportPanel,
  SonarPanel,
  E2EKPIPanel,
  E2EKPIReportTablePanel,
} from './panels';
import { applyChartTheme } from './panels/chartjs';
import { styleSheetFactory } from './themes';
import { config, shorthash } from './utils';

const PANELS: Record<string, () => JSX.Element> = {
  AllureReportPanel,
  SonarPanel,
  E2EKPIPanel,
  E2EKPIReportTablePanel,
};

export default function MonitoringTab() {
  const { width: maxWidth } = useWindowDimensions();
  const { colorScheme } = useAppContext();
  const [styles, theme] = useTheme(themedStyles, colorScheme);
  const [editing, setEditing] = useState(false);

  applyChartTheme(theme);

  const configId = shorthash(JSON.stringify(config));

  const [gridSize, setGridSize] = useLocalStorage(
    'config.tabs.quality.gridSize_' + configId,
    config.tabs.quality.gridSize + ''
  );

  const [data, setData] = useLocalStorage(
    'config.tabs.quality.panels_' + configId,
    config.tabs.quality.panels
  );

  const renderGridItem = (item: string) => (
    <View style={styles.gridItemContainer}>
      {editing && (
        <Button
          onPress={() =>
            setData((data: any) => data.filter((d: any) => d != item))
          }
          style={{ marginBottom: 5 }}
        >
          Remove
        </Button>
      )}

      <ErrorBoundary
        FallbackComponent={({ error }) => (
          <Panel id={item} variant="error">
            <Panel.Title>{item}</Panel.Title>
            <Panel.Error>
              Something went wrong:
              <br />
              {error.message}
            </Panel.Error>
          </Panel>
        )}
      >
        {React.createElement(PANELS[item])}
      </ErrorBoundary>
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
              <View style={{ flex: 1 }} />
              <TeamList />
            </View>

            <View style={styles.dashboardActions}>
              <Notifications />

              <ConfigMenu>
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
    padding: 4,
    justifyContent: 'space-between',
    width: '100%',
  },
  panelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -8,
    marginRight: -8,
    padding: 8,
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
    margin: 8,
  },
}));
