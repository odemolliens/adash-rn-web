import { Text } from 'react-native';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';

const PANEL_ID = 'SonarPanel';

export default function SonarPanel() {
  const { setZoomedPanel, closeZoomedPanel, zoomedPanel } = useAppContext();
  const zoomed = zoomedPanel === PANEL_ID;

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>Sonar</Panel.Title>

      <Panel.Actions>
        <ZoomButton
          zoomed={zoomed}
          onZoom={() => setZoomedPanel(PANEL_ID)}
          onZoomOut={closeZoomedPanel}
        />
        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
        <Text>TO BE IMPLEMENTED</Text>
      </Panel.Body>
    </Panel>
  );
}
