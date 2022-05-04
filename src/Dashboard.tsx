import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { extendTheme, NativeBaseProvider } from 'native-base';
import React, { lazy, Suspense, useMemo } from 'react';
import { View } from 'react-native';
import ZoomPanel from './components/ZoomPanel';
import ConfigurationTab from './ConfigurationTab';
import { useAppContext } from './contexts/AppContext';
import Screen from './Tab';
import { config } from './utils';

const Tab = createBottomTabNavigator();

export default function Dashboard() {
  const { zoomedPanel, closeZoomedPanel, configId } = useAppContext();
  const hasZoomedPanel = !!zoomedPanel;
  const ZoomedPanelComponent = useMemo(
    () => lazy(() => import(`./panels/${zoomedPanel}`)),
    [zoomedPanel]
  );

  return (
    <View style={{ overflow: 'hidden', flex: 1 }} key={configId}>
      <NativeBaseProvider theme={nativeBasetheme}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="CONFIGURATION"
          >
            {Object.entries(config.get('tabs')).map(([key]) => (
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
