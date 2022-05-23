import { useState } from 'react';

export default function () {
  const [syncing, setSyncing] = useState<readonly Record<string, string>[]>([]);

  function removeSyncing(key: string) {
    setSyncing(prev => prev.filter(s => s.key !== key));
  }

  function addSyncing(sync: Record<string, string>) {
    setSyncing(prev => [...prev.filter(s => s.key !== sync.key), sync]);
  }

  return { syncing, addSyncing, removeSyncing };
}
