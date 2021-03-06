import { isEmpty } from 'lodash';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { getTeamColor, getTeams } from '../utils';
import Chip from './Chip';

export const ALL_TEAMS = '';

export default function TeamList() {
  const { filterByTeam, setFilterByTeam } = useAppContext();
  const [showAll, setShowAll] = useState<boolean>(false);

  // add "All" button
  const teams = [ALL_TEAMS, ...getTeams()];

  return (
    <View style={css.teamsContainer}>
      <Chip
        onPress={() => {
          setFilterByTeam(ALL_TEAMS);
        }}
        variant={isEmpty(filterByTeam) ? 'highlight' : undefined}
      >
        All
      </Chip>

      {teams.slice(1, showAll ? undefined : 5).map((v, i) => (
        <Chip
          key={v}
          onPress={() => {
            setFilterByTeam(v);
          }}
          variant={filterByTeam === v ? 'highlight' : undefined}
        >
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
          {v}
        </Chip>
      ))}

      {teams.length >= 5 && (
        <Chip
          onPress={() => {
            setShowAll(!showAll);
          }}
          variant={
            !showAll && teams.indexOf(filterByTeam) > 5
              ? 'highlight'
              : undefined
          }
        >
          {!showAll ? '...' : '>'}
        </Chip>
      )}
    </View>
  );
}

const css = StyleSheet.create({
  teamsContainer: { flexDirection: 'row', overflowX: 'auto' },
});
