import { isEmpty, last, meanBy, uniqBy } from 'lodash';
import { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import { StyleSheet, Text } from 'react-native';
import Download from '../components/Download';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import ZoomButton from '../components/ZoomButton';
import useFetch from '../hooks/useFetch';
import { baseCss } from '../themes';
import { COLORS, config, formatDate, getBrowserStackBuildInfo } from '../utils';

const PANEL_ID = 'BrowserStackBuildsChartPanel';

export default function BrowserStackBuildsChartPanel() {
  const { loading: loading1, data: browserStackData = [] } = useFetch(
    `/data/browserstack.db`
  );
  const { loading: loading2, data: thresholdsData = {} } =
    useFetch<Record<string, any>>(`/data/thresholds.db`);

  const loading = loading1 || loading2;
  const latest = last(browserStackData);

  const data: any[] = useMemo(
    () =>
      latest?.BrowserStackAppAutomateBuilds.filter(
        (d: any) => !!getBrowserStackBuildInfo(d).version
      ).map((d: any) => ({
        x: getBrowserStackBuildInfo(d).team,
        y: Math.round(d.automation_build.duration / 60),
        name: d.automation_build.name,
      })) || [],
    [latest]
  );

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
          y: thresholdsData['BrowserStack Durations'].max / 60, //seconds to minutes
        })),
        x => x.x
      )
    : [];

  const hasData = !isEmpty(data);

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>BrowserStack Build durations</Panel.Title>

      <Panel.Actions>
        <ZoomButton panelId={PANEL_ID} />

        {hasData && (
          <Download
            data={data}
            filename={`browserstack_builds_duration.json`}
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
              normalized: true,
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
