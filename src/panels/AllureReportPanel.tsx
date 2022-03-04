import { countBy, uniq } from 'lodash';
import { Tooltip } from 'native-base';
import { Text, View } from 'react-native';
import { Cell, Row, Table, TableWrapper } from 'react-native-table-component';
import { useTheme } from 'react-native-themed-styles';
import Chip from '../components/Chip';
import DiscloseView from '../components/DiscloseView';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import suites from '../data/allure/ios/suites.json';
import { styleSheetFactory } from '../themes';

const PANEL_ID = 'AllureReportPanel';

function extractDevices(test: {
  children?: unknown[];
  parameters?: string[];
}): string[] {
  if (test.children) {
    return uniq(test.children.map((t: any) => extractDevices(t)).flat());
  }

  if (test.parameters) {
    return test.parameters;
  }

  return [];
}

function getVariantFromStatus(status: string) {
  switch (status) {
    case 'passed':
      return 'success';
    case 'broken':
      return 'error';
    default:
      return 'highlight';
  }
}

export default function AllureReportPanel() {
  const { colorScheme, setZoomedPanel, closeZoomedPanel, zoomedPanel } =
    useAppContext();
  const zoomed = zoomedPanel === PANEL_ID;

  const devices = extractDevices(suites);
  const tests = suites.children;
  const [styles] = useTheme(themedStyles, colorScheme);

  const state = {
    tableHead: ['Test Name', ...devices],
    tableData: tests.map(t => [t.name, ...devices]),
  };

  const element = (index: number, cellIndex: number) => {
    const t = tests[index];
    const status = countBy(t.children.map((c: any) => c.status));

    if (cellIndex === 0) {
      return (
        <DiscloseView
          key={t.uid}
          header={
            <Tooltip label={t.name}>
              <Text style={styles.text}>
                {t.name.length > 70 ? t.name.slice(0, 70) + '...' : t.name}
              </Text>
            </Tooltip>
          }
        >
          {t.children.map(t1 => (
            <Text key={t1.uid} style={[styles.text, { marginLeft: 10 }]}>
              {t1.name} {t1.status}
            </Text>
          ))}
        </DiscloseView>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.text}>
          {Object.entries(status)
            .sort()
            .reverse()
            .map(([key, value]) => (
              <Chip variant={getVariantFromStatus(key)}>{value}</Chip>
            ))}
        </Text>
      </View>
    );
  };

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>Allure Suites</Panel.Title>

      <Panel.Actions>
        <ZoomButton
          zoomed={zoomed}
          onZoom={() => setZoomedPanel(PANEL_ID)}
          onZoomOut={() => closeZoomedPanel()}
        />

        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
        <Table borderStyle={{ borderColor: 'transparent' }}>
          <Row
            data={state.tableHead}
            style={styles.head}
            textStyle={styles.text}
            flexArr={[2, 1]}
          />
          {state.tableData.map((rowData, index) => (
            <TableWrapper key={index} style={styles.row}>
              {rowData.map((cellData: any, cellIndex: any) => (
                <Cell
                  flex={cellIndex !== 1 ? 2 : 1}
                  key={cellIndex}
                  data={element(index, cellIndex)}
                  textStyle={styles.text}
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
      </Panel.Body>
    </Panel>
  );
}

const themedStyles = styleSheetFactory(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { padding: 3, marginBottom: 1, color: theme.textColor },
  head: { height: 40, backgroundColor: '#808B97' },
  row: { flexDirection: 'row' },
}));
