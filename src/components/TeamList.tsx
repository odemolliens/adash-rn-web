import { last, uniq } from 'lodash';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { extractTeams, getTeamColor } from '../utils';
import Chip from './Chip';

export const ALL_TEAMS = '';

export default function TeamList() {
  const { filterByTeam, setFilterByTeam, data } = useAppContext();

  // add "All" button

  const teams = useMemo(() => {
    console.log('HERE TEAMS');
    return uniq([ALL_TEAMS, ...extractTeams(data.gitlabData), 'UNK']);
  }, [last(data.gitlabData)!.createdAt]);

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
