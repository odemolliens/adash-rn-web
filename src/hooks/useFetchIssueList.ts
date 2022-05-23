import { isEmpty } from 'lodash';
import { useState } from 'react';
import useSWRImmutable from 'swr/immutable';

import * as GitlabHelper from '../api/gitlab_helper';
import { useAppContext } from '../contexts/AppContext';
import { getLast48hDate } from '../utils';

export const PROJECT_ISSUES_ENDPOINT = (projectId: string) =>
  `/projects/${projectId}/issues`;

const fetcher = ({
  projectId,
  token,
}: {
  readonly projectId: string;
  readonly token: string;
}) => GitlabHelper.getIssues(projectId, token);

export default function useFetchIssueList(
  projectId: string,
  token: string
): {
  readonly data?: readonly GitlabHelper.Issue[];
  readonly loading: boolean;
  readonly error: any;
  readonly lastUpdate?: number;
} {
  const { addSyncing, removeSyncing } = useAppContext();
  const [lastUpdate, setLastUpdate] = useState<number>();

  const options = {
    refreshInterval: 5 * 60 * 1000,
    onSuccess: () => {
      setLastUpdate(Date.now());
      removeSyncing('IssueList');
    },
    onError: () => {
      addSyncing({
        key: 'IssueList',
        message: 'Error fetching Gitlab issues... ',
        error: true,
      });
    },
  };

  const { data, error } = useSWRImmutable(
    { projectId, token },
    params => {
      addSyncing({ key: 'IssueList', message: 'Fetching Gitlab issues...' });
      return fetcher(params);
    },
    options
  );

  const last48hours = getLast48hDate();
  const dataFiltered = (data || []).filter(issue => {
    return (
      issue.state === 'opened' ||
      (issue.state === 'closed' && new Date(issue.closed_at) > last48hours)
    );
  });

  return {
    data: dataFiltered,
    loading: !error && isEmpty(data),
    error,
    lastUpdate,
  };
}
