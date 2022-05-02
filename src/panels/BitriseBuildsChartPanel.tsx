import { isEmpty, last, meanBy, uniqBy } from 'lodash';
import { useMemo, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { Text } from 'react-native';
import Download from '../components/Download';
import FilterDomain, {
  Domain,
  getDataByDomain,
} from '../components/FilterDomain';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import ZoomButton from '../components/ZoomButton';
import { useFetch } from '../hooks/useCollectedData';
import { baseCss } from '../themes';
import { COLORS, formatDate } from '../utils';

const PANEL_ID = 'BitriseBuildsChartPanel';

export default function BitriseBuildsChartPanel() {
  const { loading: loading1, data: bitriseData = [] } = useFetch(
    'http://localhost:3000/data/bitrise.json'
  );
  const { loading: loading2, data: thresholdsData = {} } = useFetch<
    Record<string, any>
  >('http://localhost:3000/data/thresholds.json');

  const loading = loading1 || loading2;
  const latest = last(bitriseData);
  const [domain, setDomain] = useState<Domain | undefined>();
  const data = useMemo(
    () =>
      getDataByDomain(bitriseData, domain).map(d => ({
        x: formatDate(d.createdAt),
        y: d.BitriseQueueSize,
      })),
    [bitriseData, domain]
  );

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
          y: thresholdsData['Bitrise Builds'].max,
        })),
        x => x.x
      )
    : [];

  const hasData = !isEmpty(data);

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>Bitrise Builds</Panel.Title>

      <Panel.Actions>
        <ZoomButton panelId={PANEL_ID} />
        {hasData && <Download data={data} filename="bitrise_builds.json" />}
        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      {hasData && (
        <Panel.Subtitle>
          Current Bitrise Builds:{' '}
          <Text style={baseCss.textBold}>{latest!.BitriseQueueSize}</Text>
        </Panel.Subtitle>
      )}

      <Panel.Body>
        {!loading && (
          <FilterDomain active={domain} onChange={d => setDomain(d)} />
        )}

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
                  label: '# of Builds',
                  data,
                  backgroundColor: COLORS[0],
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
