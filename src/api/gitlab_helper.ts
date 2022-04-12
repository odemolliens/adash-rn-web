import { getLast48hDate } from '../utils';

import NetworkHelper from './network_helper';

export const BASE_URL = 'https://gitlab.com/api/v4';

export const PROJECT_RUN_SCHEDULED_PIPELINE_ENDPOINT = (
  projectId: string,
  pipelineId: string
) => `/projects/${projectId}/pipeline_schedules/${pipelineId}/play`;

export const PROJECT_ISSUES_ENDPOINT = (projectId: string) =>
  `/projects/${projectId}/issues`;

/**
 * Run Scheduled Pipeline
 *
 * @param projectId
 * @param pipelineId
 * @param token
 */
export const runScheduledPipelineById = async (
  projectId: string,
  pipelineId: string,
  token: string
) => {
  const { data } = await NetworkHelper.post(
    `${BASE_URL}${PROJECT_RUN_SCHEDULED_PIPELINE_ENDPOINT(
      projectId,
      pipelineId
    )}`,
    {},
    {
      headers: {
        'PRIVATE-TOKEN': `${token}`,
      },
    }
  );

  return data;
};

export type Issue = {
  readonly id: number;
  readonly title: string;
  readonly web_url: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly labels: readonly string[];
  readonly assignee: { readonly name: string } | null;
  readonly closed_at: string;
  readonly state: 'opened' | 'closed';
};

/**
 * Get Issues
 *
 * @param token
 * @param params
 */
export const getIssues = async (
  projectId: string,
  token: string,
  params?: Record<string, unknown>,
  headers?: Record<string, string>
) => {
  const { data } = await NetworkHelper.get<readonly Issue[]>(
    `${BASE_URL}${PROJECT_ISSUES_ENDPOINT(projectId)}`,
    {
      headers: {
        'PRIVATE-TOKEN': `${token}`,
        ...headers,
      },
      params: {
        ...params,
        issue_type: 'incident',
      },
    }
  );
  const last48hours = getLast48hDate();

  return data.filter(issue => {
    return (
      issue.state === 'opened' ||
      (issue.state === 'closed' && new Date(issue.closed_at) > last48hours)
    );
  });
};
