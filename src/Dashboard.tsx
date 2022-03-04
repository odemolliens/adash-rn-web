import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { extendTheme, NativeBaseProvider } from 'native-base';
import { View } from 'react-native';
import ZoomPanel from './components/ZoomPanel';
import { useAppContext } from './contexts/AppContext';
import MonitoringTab from './MonitoringTab';
import * as PANELS from './panels';
import QualityTab from './QualityTab';

const Tab = createBottomTabNavigator();

export default function Dashboard() {
  const { zoomedPanel, closeZoomedPanel } = useAppContext();
  const hasZoomedPanel = !!zoomedPanel;
  const ZoomedPanelComponent = (PANELS as Record<string, () => JSX.Element>)[
    zoomedPanel
  ];

  return (
    <View style={{ overflow: 'hidden', flex: 1 }}>
      <NativeBaseProvider theme={nativeBasetheme}>
        <NavigationContainer>
          <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
              name="Monitoring"
              component={MonitoringTab}
              options={{ tabBarIcon: () => null }}
            />

            <Tab.Screen
              name="Quality"
              component={QualityTab}
              options={{ tabBarIcon: () => null }}
            />
          </Tab.Navigator>
        </NavigationContainer>

        <ZoomPanel isOpen={hasZoomedPanel} onClose={() => closeZoomedPanel()}>
          {hasZoomedPanel && <ZoomedPanelComponent />}
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
