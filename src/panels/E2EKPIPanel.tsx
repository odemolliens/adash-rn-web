import { last, meanBy, uniqBy } from 'lodash';
import { Chart } from 'react-chartjs-2';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import kpie2e from '../data/kpie2e.json';
import { styleSheetFactory } from '../themes';
import { COLORS, formatDate } from '../utils';

const PANEL_ID = 'E2EKPIPanel';

export default function E2EKPIPanel() {
  const { colorScheme, setZoomedPanel, closeZoomedPanel, zoomedPanel } =
    useAppContext();
  const zoomed = zoomedPanel === PANEL_ID;
  const [stylesTheme] = useTheme(themedStyles, colorScheme);

  const iOSdata = kpie2e.map(d => ({
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

  const androidData = kpie2e.map(d => ({
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

  const averageData = uniqBy(
    [...androidData, ...iOSdata].map(d => ({
      x: d.x,
      y: Math.round(meanBy([...androidData, ...iOSdata], d1 => d1.y)),
    })),
    x => x.x
  );

  const thresholdLineData = uniqBy(
    [...androidData, ...iOSdata].map(d => ({
      x: d.x,
      y: 80,
    })),
    x => x.x
  );

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>E2E KPI Avg. Pass Percentage</Panel.Title>

      <Panel.Actions>
        <ZoomButton
          zoomed={zoomed}
          onZoom={() => setZoomedPanel(PANEL_ID)}
          onZoomOut={closeZoomedPanel}
        />
        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
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
                label: '% Avg. iOS Pass percentage',
                data: iOSdata,
                backgroundColor: COLORS[0],
              },
              {
                label: '% Avg. Android Pass percentage',
                data: androidData,
                backgroundColor: COLORS[1],
              },
            ],
          }}
        />
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
