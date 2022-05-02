import { uniq } from 'lodash';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { useFetch } from '../hooks/useCollectedData';
import { extractTeams, getTeamColor } from '../utils';
import Chip from './Chip';

export const ALL_TEAMS = '';

export default function TeamList() {
  const { filterByTeam, setFilterByTeam } = useAppContext();

  const { data: gitlabData = [] } = useFetch(
    'http://localhost:3000/data/gitlab.json'
  );

  // add "All" button

  const teams = useMemo(
    () => uniq([ALL_TEAMS, ...extractTeams(gitlabData), 'UNK']),
    [gitlabData]
  );

  if (teams.length <= 2) {
    return null;
  }

  return (
    <View style={css.teamsContainer}>
      {teams.map((v, i) => (
        <Chip
          key={v}
          onPress={() => {
            setFilterByTeam(v);
          }}
          variant={filterByTeam === v ? 'highlight' : undefined}
        >
          {i !== 0 && (
            <View
              style={{
                width: 15,
                height: 15,
                backgroundColor: getTeamColor(v),
                borderRadius: 50,
                overflow: 'hidden',
                marginRight: 6,
              }}
            />
          )}
          {v ? v : 'All'}
        </Chip>
      ))}
    </View>
  );
}

const css = StyleSheet.create({
  teamsContainer: { flexDirection: 'row' },
});
