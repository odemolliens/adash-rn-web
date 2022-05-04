import Constants from 'expo-constants';
import Store from 'electron-store';

const store = new Store({
  defaults: Constants.manifest.extra,
});

export default {
  get: (key, defaultValue) => store.get(key, defaultValue),
  set: (key, value) => store.set(key, value),
  clear: () => store.clear(),
  allConfigs: () => store.store,
  defaultConfigs: Constants.manifest.extra,
};
