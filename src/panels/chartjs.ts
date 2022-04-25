import { Chart, defaults, registerables } from 'chart.js';

Chart.register(...registerables);

export function applyChartTheme(theme: any) {
  // eslint-disable-next-line functional/immutable-data
  defaults.color = theme.textColor;

  // eslint-disable-next-line functional/immutable-data
  defaults.borderColor = theme.textColor2;
}
