import { Button, Menu, VStack } from 'native-base';
import React, {
  Fragment,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
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
import AuthenticateMenuItem from './components/ConfigMenu/AuthenticateMenuItem';
import ConfigMenu from './components/ConfigMenu/ConfigMenu';
import EditGridSizeMenuItem from './components/ConfigMenu/EditGridSizeMenuItem';
import EditPanelsMenuItem from './components/ConfigMenu/EditPanelsMenuItem';
import Notifications from './components/Notifications';
import Panel from './components/Panel';
import PanelsBar from './components/PanelsBar';
import TeamList from './components/TeamList';
import VersionList from './components/VersionList';
import { useAppContext } from './contexts/AppContext';
import useStore from './hooks/useStore';
import { styleSheetFactory } from './themes';
import { config, humanize } from './utils';

type RenderGridItemProps = {
  item: string;
  editing: boolean;
  onRemove: (fn: any) => void;
};

const RenderGridItem = React.memo(
  ({ item, editing, onRemove }: RenderGridItemProps) => {
    const { colorScheme } = useAppContext();
    const [styles] = useTheme(themedStyles, colorScheme);
    const panel = useMemo(() => lazy(() => import(`./panels/${item}`)), [item]);

    return (
      <View style={styles.gridItemContainer}>
        <VStack space={2} h="full">
          {editing && (
            <Button
              onPress={() =>
                onRemove((data: any) => data.filter((d: any) => d != item))
              }
            >
              Remove
            </Button>
          )}

          <ErrorBoundary
            FallbackComponent={({ error }) => (
              <Panel id={item} variant="error">
                <Panel.Title>{humanize(item)}</Panel.Title>
                <Panel.Error>
                  Something went wrong:
                  <br />
                  {error.message}
                </Panel.Error>
              </Panel>
            )}
          >
            <Suspense fallback={null}>{React.createElement(panel)}</Suspense>
          </ErrorBoundary>
        </VStack>
      </View>
    );
  }
);

export default function Tab({ configKey }: { configKey: string }) {
  const { colorScheme, hasZoomedPanel } = useAppContext();
  const [styles, theme] = useTheme(themedStyles, colorScheme);
  const [editing, setEditing] = useState(false);
  const { width: maxWidth } = useWindowDimensions();
  const [gridSize, setGridSize] = useStore(`tabs.${configKey}.gridSize`);
  const [data, setData] = useStore(`tabs.${configKey}.panels`);
  const [isVersionsBarHidden] = useStore('versionsBar.hidden', false);
  const [isTeamsBarHidden] = useStore('teamsBar.hidden', false);
  const throttledWidth = useDebounce<number>(maxWidth, 3000);

  useEffect(() => {
    applyChartTheme(theme);
  }, []);

  function renderItem(item: string) {
    return <RenderGridItem item={item} editing={editing} onRemove={setData} />;
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
            availablePanels={config.get('availablePanels')}
            currentPanels={data}
            editing={editing}
            onChange={setData}
          />

          <Fragment key={throttledWidth}>
            <GridView
              selectedStyle={{}}
              key={data.length + gridSize}
              data={data}
              locked={() => !editing}
              numColumns={parseInt(gridSize)}
              renderLockedItem={renderItem}
              renderItem={renderItem}
              onReleaseCell={items => setData(items)}
            />
          </Fragment>
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
