import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { extendTheme, NativeBaseProvider } from 'native-base';
import React, { lazy, Suspense, useMemo } from 'react';
import { View } from 'react-native';
import ZoomPanel from './components/ZoomPanel';
import ConfigurationTab from './ConfigurationTab';
import { useAppContext } from './contexts/AppContext';
import useStore from './hooks/useStore';
import Screen from './Tab';

const Tab = createBottomTabNavigator();

export default function Dashboard() {
  const { zoomedPanel, closeZoomedPanel, configId, hasZoomedPanel } =
    useAppContext();
  const ZoomedPanelComponent = useMemo(
    () => lazy(() => import(`./panels/${zoomedPanel}`)),
    [zoomedPanel]
  );

  const [tabs] = useStore('tabs', []);

  return (
    <View style={{ overflow: 'hidden', flex: 1 }} key={configId}>
      <NativeBaseProvider theme={nativeBasetheme}>
        <NavigationContainer>
          <Tab.Navigator screenOptions={{ headerShown: false }}>
            {tabs.map((key: string) => (
              <Tab.Screen
                key={key}
                name={key.toUpperCase()}
                options={{ tabBarIcon: () => null /*, lazy: false*/ }}
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
