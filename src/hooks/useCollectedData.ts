import bitriseData from '../data/bitrise.json';
import browserStackData from '../data/browserstack.json';
import gitlabData from '../data/gitlab.json';
import notificationsData from '../data/notifications.json';
import statusData from '../data/status.json';
import thresholdsData from '../data/thresholds.json';
import codeMagicData from '../data/codeMagic.json';

export function useCollectedData() {
  return {
    statusData,
    bitriseData,
    gitlabData,
    browserStackData,
    thresholdsData,
    notificationsData,
    codeMagicData
  };
}
