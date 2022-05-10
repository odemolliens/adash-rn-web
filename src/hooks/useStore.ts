import { useState } from 'react';

import { config } from '../utils';

export default function useStore(key: string, defaultValue?: any) {
  const [data, setData] = useState(config.get(key, defaultValue));

  function updateDate(newData: any) {
    if (typeof newData === 'function') {
      newData = newData(data);
    }
    config.set(key, newData);
    setData(newData);
  }

  return [data, updateDate];
}
