import { last } from 'lodash';
import { Button } from 'native-base';
import { StyleSheet, Text } from 'react-native';
import { Cell, Row, Table, TableWrapper } from 'react-native-table-component';
import { useTheme } from 'react-native-themed-styles';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import kpie2e from '../data/kpie2e.json';
import { styleSheetFactory } from '../themes';
import { useAssets } from 'expo-asset';

const PANEL_ID = 'E2EKPIReportTablePanel';

export default function E2EKPIReportTablePanel() {
  const { colorScheme, setZoomedPanel, closeZoomedPanel, zoomedPanel } =
    useAppContext();
  const zoomed = zoomedPanel === PANEL_ID;
  const [stylesTheme] = useTheme(themedStyles, colorScheme);

  const latest: { stats: { [key: string]: any } } = last(kpie2e)!;

  let latestPlatformData: {
    [key: string]: {
      totalTests: number;
      avgPassPercentage: number;
      table: { tableHead: string[]; tableData: [string[]] };
    };
  } = {};

  for (const platform of ['ios', 'android']) {
    latestPlatformData[platform] = {
      table: {
        tableHead: ['Team Name', 'Total Tests', 'Pass %'],
        tableData: latest.stats[platform].map((l: Record<string, any>) => [
          l.teamName,
          l.totalTests + '',
          l.passPercentage + '%',
        ]),
      },

      totalTests: latest.stats[platform].reduce(
        (prev: number, curr: { totalTests: number }) => prev + curr.totalTests,
        0
      ),

      avgPassPercentage: parseFloat(
        (
          latest.stats[platform].reduce(
            (prev: number, curr: { passPercentage: number }) =>
              prev + curr.passPercentage,
            0
          ) / latest.stats[platform].length
        ).toFixed(2)
      ),
    };
  }
  const teams = latest.stats.ios.map((r: any) => r.teamName);
  const [assets] = useAssets(
    teams.map((team: string) =>
      require(`../../src/data/kpi-${team.toLowerCase()}.html`)
    )
  );

  function onTeamPress(teamName: string) {
    let child = window.open('about:blank', 'myChild');
    child!.document.write(assets?.[teams.indexOf(teamName)].localUri || '');
    child!.document.close();
  }

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>E2E KPI Report Table</Panel.Title>

      <Panel.Actions>
        <ZoomButton
          zoomed={zoomed}
          onZoom={() => setZoomedPanel(PANEL_ID)}
          onZoomOut={closeZoomedPanel}
        />
        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
        <Text style={stylesTheme.text}>
          PFA the mochawesome reports having{' '}
          <Text
            style={{
              fontWeight: 'bold',
            }}
          >
            {latestPlatformData.android.totalTests}
          </Text>{' '}
          tests in Android running on{' '}
          <Text
            style={{
              fontWeight: 'bold',
              color:
                latestPlatformData.android.avgPassPercentage >= 80
                  ? 'green'
                  : 'red',
            }}
          >
            {latestPlatformData.android.avgPassPercentage}%
          </Text>{' '}
          and{' '}
          <Text
            style={{
              fontWeight: 'bold',
            }}
          >
            {latestPlatformData.ios.totalTests}
          </Text>{' '}
          tests in iOS running on{' '}
          <Text
            style={{
              fontWeight: 'bold',
              color:
                latestPlatformData.ios.avgPassPercentage >= 80
                  ? 'green'
                  : 'red',
            }}
          >
            {latestPlatformData.ios.avgPassPercentage}%
          </Text>
          .
        </Text>

        {['iOS', 'Android'].map(platform => {
          return (
            <>
              <Text style={[stylesTheme.text, { marginTop: 20 }]}>
                {platform} Run
              </Text>
              <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                <Row
                  data={
                    latestPlatformData[platform.toLowerCase()].table.tableHead
                  }
                  style={styles.head}
                  textStyle={styles.text}
                />

                {latestPlatformData[platform.toLowerCase()].table.tableData.map(
                  (rowData, index) => (
                    <TableWrapper key={index} style={{ flexDirection: 'row' }}>
                      {rowData.map((cellData, cellIndex, { length }) => (
                        <Cell
                          key={cellIndex}
                          data={
                            cellIndex === 0 ? (
                              <Button onPress={() => onTeamPress(cellData)}>
                                {cellData}
                              </Button>
                            ) : (
                              cellData
                            )
                          }
                          textStyle={[
                            styles.text2,
                            cellIndex === length - 1 && {
                              color: parseInt(cellData) >= 80 ? 'green' : 'red',
                            },
                          ]}
                        />
                      ))}
                    </TableWrapper>
                  )
                )}
              </Table>
            </>
          );
        })}
      </Panel.Body>
    </Panel>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
  text2: { margin: 6, color: 'white' },
});

const themedStyles = styleSheetFactory(theme => ({
  text: { marginBottom: 3, color: theme.textColor },
}));
