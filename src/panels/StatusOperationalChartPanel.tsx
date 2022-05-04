import { isEmpty, last } from 'lodash';
import { Tooltip } from 'native-base';
import { useMemo } from 'react';
import { Linking, Text, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import Download from '../components/Download';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import StatusIcon from '../components/StatusIcon';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import { useFetch } from '../hooks/useCollectedData';
import { baseCss, styleSheetFactory } from '../themes';
import { config, formatDate, iEquals } from '../utils';

const ERROR = 'error';
const OPERATIONAL = 'operational';
const IN_PROGRESS = 'in-progress';
const ABORTED = 'aborted';

const PANEL_ID = 'StatusOperationalChartPanel';

function getVariant(status: string) {
  switch (status) {
    case ERROR:
      return 'error';

    case ABORTED:
    case IN_PROGRESS:
      return 'warning';

    case OPERATIONAL:
      return 'success';

    default:
      return 'error';
  }
}

export default function StatusOperationalChartPanel() {
  const { loading, data: statusData = [] } = useFetch(
    `${config.get('metricsEndpoint')}/data/status.json`
  );
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);
  const latest = last(statusData);
  const hasData = !isEmpty(statusData);
  const dataset = useMemo(
    () =>
      !isEmpty(latest)
        ? Object.entries(latest as Record<string, any>)
            .map(([key, value]) => ({
              service: key,
              status: statusData.map(d => ({
                createdAt: formatDate(d.createdAt),
                status: d[key],
              })),
              url: value.url,
              current: value,
            }))
            .filter(s => s.service !== 'createdAt')
        : [],
    [latest]
  );

  const currentStatus = dataset
    .map(d => d.current)
    .find(s => !iEquals(s.status, 'operational'))
    ? 'Incident'
    : 'Operational';

  const inError = currentStatus === 'Incident';

  return (
    <Panel variant={inError ? 'error' : undefined} id={PANEL_ID}>
      <Panel.Title>Status</Panel.Title>

      <Panel.Subtitle>
        Current status:{' '}
        <Text
          style={[baseCss.textBold, { color: inError ? '#FF3843' : undefined }]}
        >
          {currentStatus}
        </Text>
      </Panel.Subtitle>

      <Panel.Actions>
        <ZoomButton panelId={PANEL_ID} />
        {hasData && <Download data={statusData} filename="status.json" />}
        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
        {loading && !hasData && <Panel.Loading />}
        {!loading && !hasData && <Panel.Empty />}

        {hasData &&
          dataset.map(value => {
            const onPress = () => Linking.openURL(value.url);

            return (
              <View style={styles.row} key={value.service}>
                <Text style={[styles.text]} onPress={onPress}>
                  {value.service}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {value.status.slice(-7).map((s, i, { length }) => {
                    const last = i + 1 === length;

                    return (
                      <Tooltip
                        label={`${s.createdAt} - ${s.status.status} `}
                        key={i}
                      >
                        <Text onPress={onPress}>
                          <StatusIcon
                            variant={getVariant(s.status.status)}
                            size={last ? undefined : 22}
                          />
                        </Text>
                      </Tooltip>
                    );
                  })}
                </View>
              </View>
            );
          })}
      </Panel.Body>

      {hasData && (
        <Panel.Footer>
          Last update: {formatDate(latest!.createdAt)}
        </Panel.Footer>
      )}
    </Panel>
  );
}

const themedStyles = styleSheetFactory(theme => ({
  text: { padding: 3, marginBottom: 1, color: theme.textColor },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
