import { Text } from 'react-native';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import ZoomButton from '../components/ZoomButton';

const PANEL_ID = 'SonarPanel';

export default function SonarPanel() {
  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>Sonar</Panel.Title>

      <Panel.Actions>
        <ZoomButton panelId={PANEL_ID} />
        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
        <Text>TO BE IMPLEMENTED</Text>
      </Panel.Body>
    </Panel>
  );
}
