import { Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useAppContext } from '../contexts/AppContext';
import { baseCss, styleSheetFactory } from '../themes';

type FilterDomainProps = {
  active?: Domain;
  onChange: (domain: Domain) => void;
};

export type Domain = 'day' | 'week' | 'month';

export const DEFAULT_DOMAIN = 'week';

export default function FilterDomain({
  active = DEFAULT_DOMAIN,
  onChange,
}: FilterDomainProps) {
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);

  return (
    <View style={styles.container}>
      <Text style={styles.viewBy}>view by:</Text>
      {['day', 'week', 'month'].map((d, i, { length }) => {
        const last = i + 1 === length;

        return (
          <Text
            key={d}
            style={[
              { borderRightWidth: last ? 0 : 1.5 },
              styles.domain,
              active === d && baseCss.textUnderline,
            ]}
            onPress={() => onChange(d as Domain)}
          >
            {d}
          </Text>
        );
      })}
    </View>
  );
}

const themedStyles = styleSheetFactory(theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  viewBy: {
    color: theme.textColor,
  },
  domain: {
    paddingHorizontal: 8,
    borderRightColor: theme.textColor,
    height: 18,
    color: theme.textColor,
  },
}));

export function getDataByDomain(data: any[], domain: Domain = DEFAULT_DOMAIN) {
  const today = new Date();
  let date: Date;

  if (domain === 'day') {
    date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  } else if (domain === 'week') {
    date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  } else if (domain === 'month') {
    date = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  }

  return data.filter(row => new Date(row.createdAt) >= date);
}
