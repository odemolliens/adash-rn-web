import { StyleSheet, View } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { getTeamColor, TEAMS } from '../utils';
import Chip from './Chip';

export const ALL_TEAMS = '';

export default function TeamList() {
  const { filterByTeam, setFilterByTeam } = useAppContext();

  // add "All" button
  const teams = [ALL_TEAMS, ...TEAMS];

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
