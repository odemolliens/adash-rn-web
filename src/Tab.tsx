import { get } from 'lodash';
import { Menu } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import GridView from 'react-native-draggable-gridview';
import { useTheme } from 'react-native-themed-styles';
import { useDebounce } from 'usehooks-ts';
import { applyChartTheme } from './chartjs';
import ConfigMenu from './components/ConfigMenu/ConfigMenu';
import EditGridSizeMenuItem from './components/ConfigMenu/EditGridSizeMenuItem';
import EditPanelsMenuItem from './components/ConfigMenu/EditPanelsMenuItem';
import GridItem from './components/GridItem';
import Notifications from './components/Notifications';
import PanelsBar from './components/PanelsBar';
import TeamList from './components/TeamList';
import VersionList from './components/VersionList';
import { useAppContext } from './contexts/AppContext';
import useStore from './hooks/useStore';
import { styleSheetFactory } from './themes';
import { config } from './utils';

export default function Tab({ configKey }: { configKey: string }) {
  const { colorScheme, hasZoomedPanel } = useAppContext();
  const [styles, theme] = useTheme(themedStyles, colorScheme);
  const [editing, setEditing] = useState(false);
  const { width: maxWidth } = useWindowDimensions();
  const [gridSize, setGridSize] = useStore<string>(
    `tabs_${configKey}_gridSize`
  );
  const [data, setData] = useStore<string[]>(`tabs_${configKey}_panels`);
  const [isVersionsBarHidden] = useStore('versionsBar_hidden', false);
  const [isTeamsBarHidden] = useStore('teamsBar_hidden', false);
  const debouncedWidth = useDebounce<number>(maxWidth, 2000);
  const defaultPanelsForTab = useMemo(
    () => get(config.defaultConfigs(), `tabs_${configKey}_panels`),
    [configKey]
  );

  useEffect(() => {
    applyChartTheme(theme);
  }, []);

  function renderItem(item: string) {
    return <GridItem item={item} editing={editing} onRemove={setData} />;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView>
          <ScrollView
            contentContainerStyle={[styles.filtersContainer, { maxWidth }]}
            horizontal
          >
            <View style={styles.filtersInnerContainer}>
              {!isVersionsBarHidden && (
                <VersionList loopCountdown={60} active={!hasZoomedPanel} />
              )}
              {!isTeamsBarHidden && <TeamList />}
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
            availablePanels={config.get('availablePanels')}
            defaultPanels={defaultPanelsForTab}
            currentPanels={data}
            editing={editing}
            onChange={setData}
          />

          <GridView
            width={debouncedWidth}
            selectedStyle={{}}
            key={`${data.length}${gridSize}${debouncedWidth}`}
            data={data}
            locked={() => !editing}
            numColumns={parseInt(gridSize)}
            renderLockedItem={renderItem}
            renderItem={renderItem}
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
    flex: 1,
    overflowX: 'auto',
  },
  dashboardActions: { flexDirection: 'row', alignItems: 'center' },
}));
