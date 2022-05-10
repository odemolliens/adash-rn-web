import Constants from 'expo-constants';
import Store from 'electron-store';

const store = new Store({
  defaults: Constants.manifest.extra,
});

export default {
  get: (key, defaultValue) => store.get(key.replace(/\./g, '_'), defaultValue),
  set: (key, value) => store.set(key.replace(/\./g, '_'), value),
  clear: () => store.clear(),
  allConfigs: () => store.store,
  defaultConfigs: () => Constants.manifest.extra,
};
