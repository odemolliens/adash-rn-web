import { Ionicons } from '@expo/vector-icons';
import { isEmpty } from 'lodash';
import { Tooltip } from 'native-base';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useInterval } from 'usehooks-ts';
import { useAppContext } from '../contexts/AppContext';
import { useFetch } from '../hooks/useCollectedData';
import { styleSheetFactory } from '../themes';
import { config, extractVersions } from '../utils';
import Chip from './Chip';

type VersionListProps = {
  loopCountdown: number;
  active?: boolean;
};

const SECOND = 1000;
export const ALL_VERSIONS = '';

export default function VersionList({
  loopCountdown,
  active = true,
}: VersionListProps) {
  const { filterByVersion, setFilterByVersion } = useAppContext();
  const [counter, setCounter] = useState(loopCountdown);
  const versionsRotationEnabled = config?.versionsBar?.rotationEnabled ?? true;
  const [loop, setLoop] = useState(versionsRotationEnabled);
  const { colorScheme } = useAppContext();
  const [styles, theme] = useTheme(themedStyles, colorScheme);

  const { data: gitlabData = [] } = useFetch(
    'http://localhost:3000/data/gitlab.json'
  );

  // add "All" button
  const versions = useMemo(
    () => [ALL_VERSIONS, ...extractVersions(gitlabData)],
    [gitlabData]
  );

  useInterval(
    () => {
      if (counter === 1) {
        const currentIndex = versions.indexOf(filterByVersion);
        const nextIndex = (currentIndex + 1) % versions.length;
        setFilterByVersion(versions[nextIndex]);
      }
      setCounter(counter => (counter === 1 ? loopCountdown : counter - 1));
    },
    loop && active ? SECOND : null
  );

  const hasData = !isEmpty(gitlabData);

  return (
    <View style={styles.versionsContainer}>
      {hasData &&
        versions.map(v => (
          <Chip
            key={v}
            onPress={() => {
              setLoop(false);
              setFilterByVersion(v);
            }}
            variant={filterByVersion === v ? 'highlight' : undefined}
          >
            {v ? v : 'All'}
          </Chip>
        ))}
      {hasData && (
        <Chip
          variant={loop ? 'highlight' : undefined}
          onPress={() => {
            setLoop(!loop);
            setCounter(loopCountdown);
          }}
        >
          <Tooltip label="Auto-switch between versions">
            <Pressable
              onPress={() => {
                setLoop(!loop);
                setCounter(loopCountdown);
              }}
            >
              <Ionicons
                name="ios-repeat"
                size={15}
                color={loop ? theme.textColor2 : theme.textColor}
              />
            </Pressable>
          </Tooltip>
        </Chip>
      )}

      {hasData && loop && (
        <Text style={[styles.counter, { marginTop: 4, marginLeft: -4 }]}>
          {counter}
        </Text>
      )}
    </View>
  );
}

const themedStyles = styleSheetFactory(theme => ({
  versionsContainer: { flexDirection: 'row' },
  counter: { color: theme.textColor },
}));
