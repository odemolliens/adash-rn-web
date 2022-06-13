import Constants from 'expo-constants';
import { get, isEmpty } from 'lodash';
import store2 from 'store2';

export default {
  get: (key, defaultValue) => {
    key = key.replace(/\./g, '_');
    return store2.get(key, get(Constants.manifest.extra, key, defaultValue));
  },
  set: (key, value) => store2.set(key.replace(/\./g, '_'), value),
  clear: () => store2(false),
  defaultConfigs: () => Constants.manifest.extra,
  allConfigs: () =>
    isEmpty(store2.getAll()) ? Constants.manifest.extra : store2.getAll(),
};
