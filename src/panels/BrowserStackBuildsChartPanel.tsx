import { isEmpty, last, meanBy, uniqBy } from 'lodash';
import { Chart } from 'react-chartjs-2';
import { StyleSheet, Text, View } from 'react-native';
import Download from '../components/Download';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import { useFetchedData } from '../hooks/useCollectedData';
import { baseCss } from '../themes';
import {
  applyFilters,
  COLORS,
  downloadPanelData,
  formatDate,
  getBrowserStackBuildInfo,
} from '../utils';

const PANEL_ID = 'BrowserStackBuildsChartPanel';

export default function BrowserStackBuildsChartPanel() {
  const { data: browserStackData, loading: loading1 } =
    useFetchedData('browserstack.json');
  const { data: thresholdsData, loading: loading2 } =
    useFetchedData<Record<string, any>>('thresholds.json');
  const loading = loading1 || loading2;
  const { filterByVersion, filterByTeam, isFilteringActive } = useAppContext();
  const latest = last(browserStackData);

  const filteredByVersion = applyFilters(
    latest?.BrowserStackAppAutomateBuilds,
    filterByVersion,
    filterByTeam,
    d => d.automation_build.name
  );

  const data = filteredByVersion.map(d => ({
    x: getBrowserStackBuildInfo(d).team,
    y: Math.round(d.automation_build.duration / 60),
    name: d.automation_build.name,
  }));

  const androidData = data.filter(d => d.name.includes('Android'));
  const iosData = data.filter(d => d.name.includes('iOS'));

  const averageData = uniqBy(
    data.map(d => ({
      x: d.x,
      y: Math.round(meanBy(data, d1 => d1.y)),
    })),
    x => x.x
  );

  const thresholdLineData = !isEmpty(thresholdsData)
    ? uniqBy(
        data.map(d => ({
          x: d.x,
          y: thresholdsData['Bitrise Durations'].max / 60, //seconds to minutes
        })),
        x => x.x
      )
    : [];

  const hasData = !isEmpty(data);

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>
        <View style={css.filteredContainer}>
          <Text>BrowserStack Build durations</Text>

          {isFilteringActive && (
            <Text style={css.filtered}>
              (filtered by:{' '}
              {[filterByVersion, filterByTeam].filter(Boolean).join(', ')})
            </Text>
          )}
        </View>
      </Panel.Title>

      <Panel.Actions>
        <ZoomButton panelId={PANEL_ID} />

        {hasData && (
          <Download
            data={filteredByVersion}
            filename={`bitrise_builds_duration${
              filterByVersion ? `_${filterByVersion}` : ''
            }.json`}
          />
        )}

        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Subtitle>
        <Text style={baseCss.textItalic}>Duration is expressed in minutes</Text>
      </Panel.Subtitle>

      <Panel.Body>
        {loading && !hasData && <Panel.Loading />}
        {!loading && !hasData && <Panel.Empty />}

        {hasData && (
          <Chart
            type="bar"
            options={{
              plugins: {
                legend: {
                  labels: {
                    usePointStyle: true,
                  },
                },
              },
              scales: { y: { beginAtZero: true } },
              responsive: true,
            }}
            data={{
              datasets: [
                {
                  label: 'Threshold',
                  data: thresholdLineData,
                  backgroundColor: 'red',
                  type: 'line',
                  borderColor: 'red',
                  borderDash: [3, 5],
                  borderWidth: 1,
                  stack: 'Threshold',
                  pointStyle: 'rect',
                },
                {
                  label: 'Average',
                  data: averageData,
                  backgroundColor: COLORS[4],
                  type: 'line',
                  borderColor: COLORS[4],
                  borderDash: [3, 5],
                  borderWidth: 1,
                  stack: 'Average',
                },
                {
                  label: 'Android',
                  data: androidData,
                  backgroundColor: COLORS[0],
                },
                {
                  label: 'iOS',
                  data: iosData,
                  backgroundColor: COLORS[1],
                },
              ],
            }}
          />
        )}
      </Panel.Body>

      {hasData && (
        <Panel.Footer>
          Last update: {formatDate(latest!.createdAt)}
        </Panel.Footer>
      )}
    </Panel>
  );
}

const css = StyleSheet.create({
  filteredContainer: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'baseline',
  },
  filtered: {
    color: 'gray',
    fontSize: 12,
    fontWeight: 'normal',
    marginLeft: 4,
  },
});
