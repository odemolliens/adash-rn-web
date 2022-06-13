import { Text } from 'react-native';

export default function () {
  return (
    <>
      {!process.env.NODE_ENV ||
        (process.env.NODE_ENV === 'development' && (
          <Text style={{ padding: 4 }}>DEV MODE</Text>
        ))}
    </>
  );
}
