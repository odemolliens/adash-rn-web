import { useState } from 'react';

import { config } from '../utils';

export default function useStore<T>(
  key: string,
  defaultValue?: T
): readonly [T, (newVal: T) => void] {
  const [data, setData] = useState(config.get(key, defaultValue));

  function updateDate(newData: T) {
    if (typeof newData === 'function') {
      newData = newData(data);
    }
    config.set(key, newData);
    setData(newData);
  }

  return [data, updateDate];
}
