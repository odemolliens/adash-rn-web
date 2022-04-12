import { last, meanBy, uniqBy } from 'lodash';
import { useMemo, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { StyleSheet, Text, View } from 'react-native';
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
import {
  applyFilters,
  COLORS,
  downloadPanelData,
  extractTeams,
  formatDate,
  getTeamColor,
} from '../utils';

const PANEL_ID = 'GitlabJobsChartPanel';

type Job = {
  ref: string;
};

export default function GitlabJobsChartPanel() {
  const {
    filterByVersion,
    filterByTeam,
    isFilteringActive,
    data: { gitlabData, thresholdsData },
    setZoomedPanel,
    closeZoomedPanel,
    zoomedPanel,
  } = useAppContext();
  const zoomed = zoomedPanel === PANEL_ID;
  const latest = last(gitlabData)!;
  const [domain, setDomain] = useState<Domain | undefined>();

  const dataByDomain = useMemo(
    () => getDataByDomain(gitlabData, domain),
    [last(gitlabData)!.createdAt, domain]
  );

  const data = dataByDomain.map(d => ({
    x: formatDate(d.createdAt),
    y: applyFilters(d.GitlabJobQueue, filterByVersion, filterByTeam, 'ref')
      .length,
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
      y: thresholdsData['GitLab Jobs'].max,
    })),
    x => x.x
  );

  const dataByTeam: {
    createdAt: number;
    data: Record<string, Job[]>;
  }[] = [];

  const teams: string[] = [];

  dataByDomain.forEach(d => {
    const teamMr: Record<string, Job[]> = {};

    d.GitlabJobQueue.forEach((e: Job) => {
      const team = extractTeams(e.ref)[0];

      if (!teamMr[team]) {
        teamMr[team] = [];
      }

      teamMr[team].push(e);

      if (!teams.includes(team)) {
        teams.push(team);
      }
    });

    dataByTeam.push({ createdAt: d.createdAt, data: teamMr });
  });

  const datasets = Object.assign(
    {},
    ...teams.sort().map(t => {
      const collect = [];
      for (const obj of dataByTeam) {
        collect.push({
          x: formatDate(obj.createdAt),
          y: obj.data[t]
            ? applyFilters(obj.data[t], filterByVersion, filterByTeam, 'ref')
                .length
            : 0,
        });
      }
      return { [t]: collect };
    })
  );

  let datasetsPlot = Object.entries(datasets).map(entry => ({
    label: entry[0],
    data: entry[1],
    backgroundColor: getTeamColor(entry[0]),
  }));

  if (filterByTeam) {
    datasetsPlot = datasetsPlot.filter(d => d.label === filterByTeam);
  }

  const noData =
    datasetsPlot.reduce((previousValue, currentValue) => {
      return (
        previousValue +
        (currentValue.data as { y: number }[]).reduce((a, b) => a + b.y, 0)
      );
    }, 0) === 0;

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>
        <View style={css.filteredContainer}>
          <Text>Gitlab Jobs</Text>

          {isFilteringActive && (
            <Text style={css.filtered}>
              (filtered by:{' '}
              {[filterByVersion, filterByTeam].filter(Boolean).join(', ')})
            </Text>
          )}
        </View>
      </Panel.Title>

      <Panel.Subtitle>
        Current Gitlab Jobs:{' '}
        <Text style={baseCss.textBold}>
          {last(dataByDomain)?.GitlabJobQueueSize}
        </Text>
      </Panel.Subtitle>

      <Panel.Actions>
        <ZoomButton
          zoomed={zoomed}
          onZoom={() => setZoomedPanel(PANEL_ID)}
          onZoomOut={() => closeZoomedPanel()}
        />

        <Download
          onPress={() =>
            downloadPanelData(
              datasets,
              `gitlab_jobs${filterByVersion ? `_${filterByVersion}` : ''}.json`
            )
          }
        />

        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

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
              scales: {
                y: { beginAtZero: true, stacked: true },
                x: { stacked: true },
              },
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
                ...datasetsPlot,
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
