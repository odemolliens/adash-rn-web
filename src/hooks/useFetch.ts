import { isEmpty } from 'lodash';
import useSWRImmutable from 'swr/immutable';
import { isElectron } from '../platform';
import { config, fetcher } from '../utils';

export default function useFetch<T = readonly Record<string, any>[]>(
  metricsPath: string
): { readonly data: T; readonly loading: boolean; readonly error: any } {
  const options = {
    refreshInterval: 60 * 1000,
  };

  const url = isElectron ? 'file:///' : config.get('web_metricsEndpoint')

  const { data, error } = useSWRImmutable(new URL(metricsPath, url).href, fetcher, options);

  return {
    data: data as T,
    loading: !error && isEmpty(data),
    error,
  };
}
