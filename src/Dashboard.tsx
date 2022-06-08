import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { extendTheme, NativeBaseProvider } from 'native-base';
import React, { lazy, Suspense, useMemo } from 'react';
import { View } from 'react-native';
import DevModeBar from './components/DevModeBar';
import StatusBar from './components/StatusBar';
import ZoomPanel from './components/ZoomPanel';
import ConfigurationTab from './ConfigurationTab';
import { useAppContext } from './contexts/AppContext';
import useStore from './hooks/useStore';
import Screen from './Tab';
import { config } from './utils';

const Tab = createBottomTabNavigator();

export default function Dashboard() {
  const { zoomedPanel, closeZoomedPanel, hasZoomedPanel } = useAppContext();
  const ZoomedPanelComponent = useMemo(
    () => lazy(() => import(`./panels/${zoomedPanel}`)),
    [zoomedPanel]
  );

  const [tabs] = useStore('tabs', []);

  const statusBarHidden = config.get('statusBar_hidden', false);

  return (
    <View style={{ overflow: 'hidden', flex: 1 }}>
      <DevModeBar />

      <NativeBaseProvider theme={nativeBasetheme}>
        <NavigationContainer>
          <Tab.Navigator screenOptions={{ headerShown: false }}>
            {tabs.map((key: string) => (
              <Tab.Screen
                key={key}
                name={key.toUpperCase()}
                options={{ tabBarIcon: () => null }}
              >
                {props => <Screen {...props} configKey={key} />}
              </Tab.Screen>
            ))}

            <Tab.Screen
              name="CONFIGURATION"
              options={{ tabBarIcon: () => null }}
              component={ConfigurationTab}
            />
          </Tab.Navigator>
        </NavigationContainer>

        <ZoomPanel isOpen={hasZoomedPanel} onClose={() => closeZoomedPanel()}>
          <Suspense fallback={null}>
            {hasZoomedPanel && <ZoomedPanelComponent />}
          </Suspense>
        </ZoomPanel>
      </NativeBaseProvider>

      {!statusBarHidden && <StatusBar />}
    </View>
  );
}

const nativeBasetheme = extendTheme({
  components: {
    Menu: {
      baseStyle: {
        backgroundColor: '#E5E7EB',
      },
    },
  },
});
