import { createHash } from 'crypto';

import { format } from 'date-fns';
import Constants from 'expo-constants';
import html2canvas from 'html2canvas';
import fileDownload from 'js-file-download';
import { get, uniq } from 'lodash';

export const config = Constants.manifest?.extra!;

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

export const TEAMS = [...config.teams, 'UNK'];

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

export function extractVersions(data: unknown) {
  const versionRegExp = /\/(?<version>\d+\.\d{2}\.\d)/g; // matches 5.25.0 from feat/5.25.0/SYST-000-title
  const strData = JSON.stringify(data);
  //const versions = uniq(findMatches(versionRegExp, strData).flat());
  const versions = uniq(strData.match(versionRegExp)).map(v => v.replaceAll('/', '')).flat().sort()
  return versions.sort().reverse();
}

export function extractTeams(data: unknown) {
  const teamRegExp = new RegExp(`(?<team>${TEAMS.join('|')})`, 'g');
  const strData = JSON.stringify(data).toUpperCase();
  //const teams = uniq(findMatches(teamRegExp, strData).flat()).sort();
  const teams = uniq(strData.match(teamRegExp)).flat().sort()
  return teams.length ? teams : ['UNK']; //Unknown team
}

export function getTeamColor(team: string) {
  return COLORS[TEAMS.indexOf(team.toUpperCase())];
}

export function applyFilters(
  data: readonly any[],
  filterByVersion: string,
  team: string,
  filterKey: string | ((d: any) => string)
) {
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
  const [_, platform, branch, _1, team] = build.automation_build.name.split(' ').filter(c => !['-', ''].includes(c));
  return {
    platform, branch,
    version: extractVersions(branch)[0],
    team: team
  }
}

export function createDownloadableBlobJSON(data: unknown) {
  return new Blob([JSON.stringify(data)], { type: 'text/plain' });
}

export function downloadPanelData(data: unknown, filename: string) {
  fileDownload(createDownloadableBlobJSON(data), filename);
}

export function downloadPanelScreenshot(element: HTMLElement) {
  html2canvas(element as HTMLElement, {
    backgroundColor: null,
    imageTimeout: 0,
    logging: false,
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
