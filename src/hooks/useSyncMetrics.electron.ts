import { ipcRenderer } from 'electron';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

export default function () {
  const [syncing, setSyncing] = useState<readonly Record<string, string>[]>([]);

  function removeSyncing(key: string) {
    setSyncing(prev => prev.filter(s => s.key !== key));
  }

  function addSyncing(sync: Record<string, string>) {
    setSyncing(prev => [...prev.filter(s => s.key !== sync.key), sync]);
  }

  useEffect(() => {
    ipcRenderer.on('sync', (_, data) => {
      addSyncing({
        key: 'gitpull',
        message: !isEmpty(data) ? data : 'Syncing metrics...',
      });
    });

    ipcRenderer.on('syncend', () => {
      removeSyncing('gitpull');
    });

    return () => {
      ipcRenderer.removeAllListeners('sync');
      ipcRenderer.removeAllListeners('syncend');
    };
  }, [syncing]);

  return { syncing, addSyncing, removeSyncing };
}
