import { meanBy, uniqBy } from 'lodash';
import { useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import FilterDomain, {
  Domain,
  getDataByDomain,
} from '../components/FilterDomain';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import kpie2e from '../data/kpie2e.json';
import { styleSheetFactory } from '../themes';
import { applyFilters, COLORS, formatDate } from '../utils';

const PANEL_ID = 'E2EKPIPanel';

export default function E2EKPIPanel() {
  const {
    colorScheme,
    setZoomedPanel,
    closeZoomedPanel,
    zoomedPanel,
    filterByTeam,
    isFilteringActive,
  } = useAppContext();
  const zoomed = zoomedPanel === PANEL_ID;
  const [stylesTheme] = useTheme(themedStyles, colorScheme);

  const [domain, setDomain] = useState<Domain | undefined>();
  const dataByDomain = getDataByDomain(kpie2e, domain);

  const dataByTeam = dataByDomain.map(d => ({
    ...d,
    stats: {
      ios: applyFilters(d.stats.ios, '', filterByTeam, 'teamName'),
      android: applyFilters(d.stats.android, '', filterByTeam, 'teamName'),
    },
  }));

  const iOSPassPercentage = dataByDomain.map(d => ({
    x: formatDate(d.createdAt),
    y: parseFloat(
      (
        d.stats.ios.reduce(
          (prev: number, curr: { passPercentage: number }) =>
            prev + curr.passPercentage,
          0
        ) / d.stats.ios.length
      ).toFixed(2)
    ),
  }));

  const androidPassPercentage = dataByDomain.map(d => ({
    x: formatDate(d.createdAt),
    y: parseFloat(
      (
        d.stats.android.reduce(
          (prev: number, curr: { passPercentage: number }) =>
            prev + curr.passPercentage,
          0
        ) / d.stats.android.length
      ).toFixed(2)
    ),
  }));

  const androidDataTotal = dataByTeam.map(d => ({
    x: formatDate(d.createdAt),
    y: d.stats.android.reduce(
      (prev: number, curr: { totalTests: number }) => prev + curr.totalTests,
      0
    ),
  }));

  const androidDataPass = dataByTeam.map(d => ({
    x: formatDate(d.createdAt),
    y: d.stats.android.reduce((prev: number, curr: any) => prev + curr.pass, 0),
  }));

  const androidDataFail = dataByTeam.map(d => ({
    x: formatDate(d.createdAt),
    y: d.stats.android.reduce((prev: number, curr: any) => prev + curr.fail, 0),
  }));

  const iOSTotal = dataByTeam.map(d => ({
    x: formatDate(d.createdAt),
    y: d.stats.ios.reduce(
      (prev: number, curr: any) => prev + curr.totalTests,
      0
    ),
  }));

  const iOSPass = dataByTeam.map(d => ({
    x: formatDate(d.createdAt),
    y: d.stats.ios.reduce((prev: number, curr: any) => prev + curr.pass, 0),
  }));

  const iOSFail = dataByTeam.map(d => ({
    x: formatDate(d.createdAt),
    y: d.stats.ios.reduce(
      (prev: number, curr: { fail: number }) => prev + curr.fail,
      0
    ),
  }));

  const averagePassPercentage = uniqBy(
    [...androidPassPercentage, ...iOSPassPercentage].map(d => ({
      x: d.x,
      y: Math.round(
        meanBy([...androidPassPercentage, ...iOSPassPercentage], d1 => d1.y)
      ),
    })),
    x => x.x
  );

  const thresholdLinePassPercentage = uniqBy(
    [...androidPassPercentage, ...iOSPassPercentage].map(d => ({
      x: d.x,
      y: 80,
    })),
    x => x.x
  );

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>
        <View style={css.filteredContainer}>
          <Text>E2E KPI Avg. Pass Percentage</Text>

          {isFilteringActive && (
            <Text style={css.filtered}>
              (filtered by: {[filterByTeam].filter(Boolean).join(', ')})
            </Text>
          )}
        </View>
      </Panel.Title>

      <Panel.Actions>
        <ZoomButton
          zoomed={zoomed}
          onZoom={() => setZoomedPanel(PANEL_ID)}
          onZoomOut={closeZoomedPanel}
        />
        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
        <FilterDomain active={domain} onChange={d => setDomain(d)} />

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
                data: thresholdLinePassPercentage,
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
                data: averagePassPercentage,
                backgroundColor: COLORS[4],
                type: 'line',
                borderColor: COLORS[4],
                borderDash: [3, 5],
                borderWidth: 1,
                stack: 'Average',
              },
              {
                label: '% Avg. Android Pass percentage',
                data: androidPassPercentage,
                backgroundColor: COLORS[1],
              },
              {
                label: '% Avg. iOS Pass percentage',
                data: iOSPassPercentage,
                backgroundColor: COLORS[0],
              },
            ],
          }}
        />

        <Text style={[stylesTheme.text, { marginTop: 20 }]}>iOS Run</Text>

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
              y: { beginAtZero: true },
              x: {},
            },
            responsive: true,
          }}
          data={{
            datasets: [
              {
                label: '# Tests',
                data: iOSTotal,
                backgroundColor: COLORS[1],
              },
              {
                label: '# Pass',
                data: iOSPass,
                backgroundColor: 'green',
              },
              {
                label: '# Fail',
                data: iOSFail,
                backgroundColor: 'red',
              },
            ],
          }}
        />

        <Text style={[stylesTheme.text, { marginTop: 20 }]}>Android</Text>

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
              y: { beginAtZero: true },
              x: {},
            },
            responsive: true,
          }}
          data={{
            datasets: [
              {
                label: '# Tests',
                data: androidDataTotal,
                backgroundColor: COLORS[1],
              },
              {
                label: '# Pass',
                data: androidDataPass,
                backgroundColor: 'green',
              },
              {
                label: '# Fail',
                data: androidDataFail,
                backgroundColor: 'red',
              },
            ],
          }}
        />
      </Panel.Body>
    </Panel>
  );
}

const themedStyles = styleSheetFactory(theme => ({
  text: { marginBottom: 3, color: theme.textColor },
}));

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
