import { isEmpty } from 'lodash';
import useSWRImmutable from 'swr/immutable';

import { config, fetcher } from '../utils';

export function useFetch<T = readonly Record<string, any>[]>(
  url: string
): { readonly data: T; readonly loading: boolean; readonly error: any } {
  const options = {
    refreshInterval: 60 * 1000,
  };
  const { data, error } = useSWRImmutable(
    url.replace(config.get('metricsEndpoint'), 'file://'),
    fetcher,
    options
  );

  return {
    data: data as T,
    loading: !error && isEmpty(data),
    error,
  };
}
