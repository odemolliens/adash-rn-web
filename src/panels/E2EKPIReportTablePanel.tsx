import { isEmpty, last } from 'lodash';
import { Button } from 'native-base';
import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Cell, Row, Table, TableWrapper } from 'react-native-table-component';
import { useTheme } from 'react-native-themed-styles';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import { useFetch } from '../hooks/useCollectedData';
import { styleSheetFactory } from '../themes';
import { config, formatDate } from '../utils';

const PANEL_ID = 'E2EKPIReportTablePanel';

export default function E2EKPIReportTablePanel() {
  const { loading, data: kpie2e = [] } = useFetch(
    `${config.get('metricsEndpoint')}/data/kpie2e.json`
  );

  const { colorScheme } = useAppContext();
  const [stylesTheme] = useTheme(themedStyles, colorScheme);
  const hasData = !isEmpty(kpie2e);
  const latest = last(kpie2e);

  let latestPlatformData = useMemo(() => {
    const tmp: Record<string, any> = {};

    if (!isEmpty(latest)) {
      for (const platform of ['ios', 'android']) {
        tmp[platform] = {
          table: {
            tableHead: ['Team Name', 'Total Tests', 'Pass %'],
            tableData: latest!.stats[platform].map((l: Record<string, any>) => [
              l.teamName,
              l.totalTests + '',
              l.passPercentage + '%',
            ]),
          },

          totalTests: latest!.stats[platform].reduce(
            (prev: number, curr: { totalTests: number }) =>
              prev + curr.totalTests,
            0
          ),

          avgPassPercentage: parseFloat(
            (
              latest!.stats[platform].reduce(
                (prev: number, curr: { passPercentage: number }) =>
                  prev + curr.passPercentage,
                0
              ) / latest!.stats[platform].length
            ).toFixed(2)
          ),
        };
      }
      return tmp;
    }
    return {};
  }, [hasData]);

  function onTeamPress(teamName: string) {
    window.open(
      `${config.get('metricsEndpoint')}/data/kpi-${teamName.toLowerCase()}.html`
    );
  }

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>E2E KPI Report Table</Panel.Title>

      <Panel.Actions>
        <ZoomButton panelId={PANEL_ID} />
        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
        {loading && !hasData && <Panel.Loading />}
        {!loading && !hasData && <Panel.Empty />}

        {hasData && !isEmpty(latestPlatformData) && (
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
        )}

        {hasData &&
          !isEmpty(latestPlatformData) &&
          ['iOS', 'Android'].map(platform => {
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

                  {latestPlatformData[
                    platform.toLowerCase()
                  ].table.tableData.map((rowData: any, index: number) => (
                    <TableWrapper key={index} style={{ flexDirection: 'row' }}>
                      {rowData.map(
                        (
                          cellData: any,
                          cellIndex: number,
                          { length }: { length: number }
                        ) => (
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
                                color:
                                  parseInt(cellData) >= 80 ? 'green' : 'red',
                              },
                            ]}
                          />
                        )
                      )}
                    </TableWrapper>
                  ))}
                </Table>
              </>
            );
          })}
      </Panel.Body>

      {hasData && (
        <Panel.Footer>
          Last update: {formatDate(latest!.createdAt)}
        </Panel.Footer>
      )}
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
