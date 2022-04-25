import { last, meanBy, uniqBy } from 'lodash';
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
import { useAppContext } from '../contexts/AppContext';
import { baseCss } from '../themes';
import { COLORS, downloadPanelData, formatDate } from '../utils';

const PANEL_ID = 'BitriseBuildsChartPanel';

export default function BitriseBuildsChartPanel() {
  const {
    data: { bitriseData, thresholdsData },
    zoomedPanel,
    setZoomedPanel,
    closeZoomedPanel,
  } = useAppContext();
  const zoomed = zoomedPanel === PANEL_ID;
  const latest = last(bitriseData)!;
  const [domain, setDomain] = useState<Domain | undefined>();
  const dataByDomain = useMemo(
    () => getDataByDomain(bitriseData, domain),
    [latest.createdAt, domain]
  );

  const data = dataByDomain.map(d => ({
    x: formatDate(d.createdAt),
    y: d.BitriseQueueSize,
  }));

  const averageData = uniqBy(
    data.map(d => ({
      x: d.x,
      y: Math.round(meanBy(data, d1 => d1.y)),
    })),
    x => x.x
  );

  const thresholdLineData = uniqBy(
    data.map(d => ({
      x: d.x,
      y: thresholdsData['Bitrise Builds'].max,
    })),
    x => x.x
  );

  const noData = !data.length;

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>Bitrise Builds</Panel.Title>

      <Panel.Actions>
        <ZoomButton
          zoomed={zoomed}
          onZoom={() => setZoomedPanel(PANEL_ID)}
          onZoomOut={() => closeZoomedPanel()}
        />

        <Download
          onPress={() => downloadPanelData(data, 'bitrise_builds.json')}
        />

        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      {!noData && (
        <Panel.Subtitle>
          Current Bitrise Builds:{' '}
          <Text style={baseCss.textBold}>{latest.BitriseQueueSize}</Text>
        </Panel.Subtitle>
      )}

      <Panel.Body>
        <FilterDomain active={domain} onChange={d => setDomain(d)} />

        {!noData && (
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

        {noData && <Panel.Empty />}
      </Panel.Body>

      <Panel.Footer>Last update: {formatDate(latest.createdAt)}</Panel.Footer>
    </Panel>
  );
}
