import bitriseData from '../data/bitrise.json';
import browserStackData from '../data/browserstack.json';
import gitlabData from '../data/gitlab.json';
import notificationsData from '../data/notifications.json';
import statusData from '../data/status.json';
import thresholdsData from '../data/thresholds.json';
import codeMagicData from '../data/codeMagic.json';
import { useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';

export function useCollectedData() {
  return {
    statusData,
    bitriseData: bitriseData || [],
    gitlabData,
    browserStackData,
    thresholdsData,
    notificationsData,
    codeMagicData
  };
}

export function useFetchedData<T = Record<string, any>[]>(metric: string, defaultValue = []): { data: T, loading: boolean, error: null | string } {
  const [data, setData] = useState<T>(defaultValue as unknown as T);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  function fetchData() {
    fetch(`http://localhost:3000/data/${metric}`)
      .then((response) => response.json())
      .then((actualData) => {
        setData(actualData);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setData(null as unknown as T);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useInterval(() => fetchData(), 30 * 1000)

  useEffect(() => {
    fetchData()
  }, []);

  return { data, loading, error }
}
