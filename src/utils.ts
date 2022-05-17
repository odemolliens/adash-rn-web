import { createHash } from 'crypto';
import { format } from 'date-fns';
import domtoimage from 'dom-to-image';
import html2canvas from 'html2canvas';
import fileDownload from 'js-file-download';
import { get, uniq } from 'lodash';
import { Platform } from 'react-native';
import store from './store';

export const config = store;
export const isWeb = Platform.OS === 'web';

export const COLORS = [
  '#4dc9f6',
  '#f67019',
  '#f53794',
  '#537bc4',
  '#acc236',
  '#166a8f',
  '#00a950',
  '#8549ba',
  '#58595b',
];

export function shorthash(txt: string) {
  return createHash('sha256').update(txt).digest('hex').slice(0, 5);
}

export const TEAMS = [...config.get('teamsBar_teams', []), 'UNK'];

/**
 * Checks if 2 strings are equals (ignore case)
 *
 * @param str1
 * @param str2
 */
export const iEquals = (str1: string, str2: string) =>
  str1.toUpperCase() === str2.toUpperCase();

export type BrowserStackBuild = {
  readonly automation_build: {
    readonly name: string;
    readonly status: string;
    readonly hashed_id: string;
    readonly duration: number;
  };
};

export function formatDate(
  date: Date | number | string | null,
  formatOutput = 'dd/MM hh:mm'
) {
  if (!date) return;

  date = typeof date === 'string' ? new Date(date) : date;
  return format(date, formatOutput);
}

export function humanize(text: string) {
  return text.split(/(?=[A-Z])/).join(' ');
}

export function extractVersions(data: unknown) {
  const versionRegExp = /\/(?<version>\d+\.\d+\.\d+)/g; // matches 5.25.0 from feat/5.25.0/SYST-000-title
  const strData = JSON.stringify(data);
  const versions = uniq(strData.match(versionRegExp) || [])
    .map(v => v.replace(/\//g, ''))
    .flat()
    .sort();
  return versions.sort().reverse();
}

export function extractTeams(data: unknown) {
  const teamRegExp = new RegExp(`(?<team>${TEAMS.join('|')})`, 'g');
  const strData = JSON.stringify(data).toUpperCase();
  const teams = uniq(strData.match(teamRegExp)).flat().sort();
  return teams.length ? teams : ['UNK']; //Unknown team
}

export function getTeamColor(team: string) {
  return COLORS[TEAMS.indexOf(team.toUpperCase())];
}

export const fetcher = (...args: readonly any[]) =>
  fetch(...args).then(res => res.json());

export function applyFilters(
  data: readonly Record<string, any>[] = [],
  filterByVersion: string,
  team: string,
  filterKey: string | ((d: any) => string)
): readonly any[] {
  let filtered = data;
  if (filterByVersion) {
    filtered = data.filter(d =>
      typeof filterKey === 'function'
        ? filterKey(d).includes(filterByVersion)
        : get(d, filterKey).includes(filterByVersion)
    );
  }

  if (team) {
    filtered = filtered.filter(d => {
      const teams = extractTeams(
        typeof filterKey === 'function' ? filterKey(d) : get(d, filterKey)
      );
      return teams[0] === team;
    });
  }

  return filtered;
}

export function getBrowserStackBuildInfo(build: BrowserStackBuild) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, platform, branch, _1, team] = build.automation_build.name
    .split(' ')
    .filter(c => !['-', ''].includes(c));
  return {
    platform,
    branch,
    version: extractVersions(build.automation_build.name)[0],
    team: team,
  };
}

export function createDownloadableBlobJSON(data: unknown) {
  return new Blob([JSON.stringify(data)], { type: 'text/plain' });
}

export function downloadPanelData(data: unknown, filename: string) {
  fileDownload(createDownloadableBlobJSON(data), filename);
}

export function downloadPanelScreenshot(element: HTMLElement) {
  domtoimage.toPng(element).then(function (dataUrl: string) {
    const link = document.createElement('a');
    link.download = `${element.getAttribute('data-panel-id')}.png`;
    link.href = dataUrl;
    link.click();
  });
}

export function downloadPanelScreenshotOld(element: HTMLElement) {
  html2canvas(element, {
    backgroundColor: null,
    imageTimeout: 0,
    logging: true,
    onclone: (_, element: Element) => {
      const pBody = element.querySelector('[data-panel-body]')! as HTMLElement;
      pBody.style.aspectRatio = 'auto';
    },
  }).then(function (canvas) {
    const link = document.createElement('a');
    link.download = `${element.getAttribute('data-panel-id')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  });
}

export function getLast48hDate() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2);
}
