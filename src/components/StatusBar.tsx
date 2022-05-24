import { isEmpty, last } from 'lodash';
import { Text, View } from 'react-native';
import { useAppContext } from '../contexts/AppContext';

export default function () {
  const { syncing } = useAppContext();

  if (isEmpty(syncing)) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: last(syncing)!.error ? '#FF2158' : '#0FC389',
        padding: 4,
        position: 'absolute',
        bottom: 48,
        left: 0,
        right: 'auto',
      }}
    >
      <Text style={{ color: 'white' }}>{last(syncing)!.message}</Text>
    </View>
  );
}
