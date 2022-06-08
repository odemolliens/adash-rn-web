import { Ionicons } from '@expo/vector-icons';
import { isEmpty } from 'lodash';
import { Box, HStack, Tooltip, VStack } from 'native-base';
import { Text } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import Panel from '../components/Panel';
import ScreenshotButton from '../components/ScreenshotButton';
import ZoomButton from '../components/ZoomButton';
import { useAppContext } from '../contexts/AppContext';
import useFetch from '../hooks/useFetch';
import { isElectron } from '../platform';
import { baseCss, styleSheetFactory } from '../themes';
import { config, formatDate } from '../utils';

const PANEL_ID = 'CodeQuality';

export default function CodeQuality() {
  const { loading, data = {} } = useFetch<Record<string, any>>(
    `/data/quality_report.json`
  );

  const latest = data;
  const hasData = !isEmpty(data);
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);

  function openArtifact(artifactName: string) {
    window.open(
      `${
        isElectron ? 'file:///' : config.get('web_metricsEndpoint')
      }/data/${artifactName}`
    );
  }

  return (
    <Panel id={PANEL_ID}>
      <Panel.Title>Code Quality</Panel.Title>

      <Panel.Actions>
        <ZoomButton panelId={PANEL_ID} />
        <ScreenshotButton panelId={PANEL_ID} />
      </Panel.Actions>

      <Panel.Body>
        {loading && !hasData && <Panel.Loading />}
        {!loading && !hasData && <Panel.Empty />}

        {hasData && (
          <VStack space={4}>
            {Object.entries(latest.report).map(([entry, value]: any) => {
              const hasAlert = Object.values(value).find(
                (e: any) => e.displayAlert
              );

              return (
                <VStack
                  key={entry}
                  p={4}
                  borderWidth={1}
                  borderStyle="dashed"
                  borderRadius={5}
                  style={{ borderColor: hasAlert ? '#FF2158' : 'gray' }}
                  space={3}
                >
                  <Text
                    style={[
                      styles.text,
                      baseCss.textBold,
                      baseCss.textUnderline,
                    ]}
                  >
                    {entry}
                  </Text>

                  <HStack space={12}>
                    {Object.entries(value).map(([entry1, value1]: any) => {
                      return (
                        <Box key={entry1}>
                          <HStack alignItems="center" space={4}>
                            <VStack>
                              <Text style={[styles.text, baseCss.textBold]}>
                                {entry1}
                              </Text>

                              <Text style={styles.text}>
                                value: {value1.value}
                              </Text>

                              <Text style={styles.text}>
                                old: {value1.oldValue}
                              </Text>
                            </VStack>

                            {value1.artifactName && (
                              <Tooltip label={value1.artifactName}>
                                <Text
                                  onPress={() =>
                                    openArtifact(value1.artifactName)
                                  }
                                >
                                  <Box
                                    style={{
                                      borderRadius: 50,
                                      backgroundColor: 'white',
                                      overflow: 'hidden',
                                      padding: 4,
                                      width: 30,
                                      height: 30,
                                      flex: 1,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <Ionicons
                                      name="md-code-download-outline"
                                      size={18}
                                    />
                                  </Box>
                                </Text>
                              </Tooltip>
                            )}
                          </HStack>
                        </Box>
                      );
                    })}
                  </HStack>
                </VStack>
              );
            })}
          </VStack>
        )}
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
}));
