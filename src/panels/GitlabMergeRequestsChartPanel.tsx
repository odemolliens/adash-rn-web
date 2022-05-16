import { isEmpty, last, meanBy, uniqBy } from 'lodash';
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
import useFetch from '../hooks/useFetch';
import { baseCss } from '../themes';
import {
  applyFilters,
  COLORS,
  config,
  extractTeams,
  formatDate,
  getTeamColor,
} from '../utils';

type MergeRequest = {
  source_branch: string;
  id: number;
  web_url: string;
  title: string;
  author: {
    name: string;
  };
};

const PANEL_ID = 'GitlabMergeRequestsChartPanel';

export default function GitlabMergeRequestsChartPanel() {
  const [domain, setDomain] = useState<Domain | undefined>();

  const { loading: loading1, data: gitlabData = [] } =
    useFetch(`/data/gitlab.json`);
  const { loading: loading2, data: thresholdsData = {} } = useFetch<
    Record<string, any>
  >(`/data/thresholds.json`);

  const loading = loading1 || loading2;
  const { filterByVersion, filterByTeam, isFilteringActive } = useAppContext();
  const latest = last(gitlabData);
  const dataByDomain = useMemo(
    () => getDataByDomain(gitlabData, domain),
    [gitlabData, domain]
  );

  const data = dataByDomain.map(d => ({
    x: formatDate(d.createdAt),
    y: applyFilters(
      d.GitLabOpenMergeRequests,
      filterByVersion,
      filterByTeam,
      'source_branch'
    ).length,
  }));

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
          y: thresholdsData['GitLab Open MR'].max,
        })),
        x => x.x
      )
    : [];

  const dataByTeam: {
    createdAt: number;
    data: Record<string, MergeRequest[]>;
  }[] = [];

  const teams: string[] = [];

  dataByDomain.forEach(d => {
    const teamMr: Record<string, MergeRequest[]> = {};

    d.GitLabOpenMergeRequests.forEach((e: MergeRequest) => {
      const team = extractTeams(e.title)[0];

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
            ? applyFilters(
                obj.data[t],
                filterByVersion,
                filterByTeam,
                'source_branch'
              ).length
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

  const hasData = !isEmpty(gitlabData);

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>
        <View style={css.filteredContainer}>
          <Text>Gitlab MRs</Text>

          {isFilteringActive && (
            <Text style={css.filtered}>
              (filtered by:{' '}
              {[filterByVersion, filterByTeam].filter(Boolean).join(', ')})
            </Text>
          )}
        </View>
      </Panel.Title>

      {hasData && (
        <Panel.Subtitle>
          Current Gitlab opened merge requests:{' '}
          <Text style={baseCss.textBold}>{last(data)?.y}</Text>
        </Panel.Subtitle>
      )}

      <Panel.Actions>
        <ZoomButton panelId={PANEL_ID} />

        {hasData && (
          <Download
            data={datasets}
            filename={`gitlab_open_mr_chart${
              filterByVersion ? `_${filterByVersion}` : ''
            }.json`}
          />
        )}

        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

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
