import { isEmpty } from 'lodash';
import useSWRImmutable from 'swr/immutable';

import { useAppContext } from '../contexts/AppContext';
import { isElectron } from '../platform';
import { config, fetcher } from '../utils';

export default function useFetch<T = readonly Record<string, any>[]>(
  metricsPath: string
): { readonly data: T; readonly loading: boolean; readonly error: any } {
  const { removeSyncing, addSyncing } = useAppContext();

  const options = {
    refreshInterval: 5 * 60 * 1000,
    onSuccess: () => {
      removeSyncing(metricsPath);
    },
    onError: () => {
      addSyncing({
        key: metricsPath,
        message: 'Error fetching metrics... ' + metricsPath,
        error: true,
      });
    },
  };

  const url = isElectron ? 'file:///' : config.get('web_metricsEndpoint');

  const { data, error } = useSWRImmutable(
    new URL(metricsPath, url).href,
    url => {
      addSyncing({
        key: metricsPath,
        message: 'Fetching metrics... ' + metricsPath,
      });
      return fetcher(url);
    },
    options
  );

  return {
    data: data as T,
    loading: !error && isEmpty(data),
    error,
  };
}
