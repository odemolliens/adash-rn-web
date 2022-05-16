import { capitalize, get } from 'lodash';
import {
  Box,
  Button,
  HStack,
  Input,
  ScrollView,
  Switch,
  VStack,
} from 'native-base';
import { Fragment, useState } from 'react';
import { Text } from 'react-native';
import { useAppContext } from './contexts/AppContext';
import { isElectron } from './platform';
import { baseCss } from './themes';
import { config, shorthash } from './utils';

export default function ConfigurationTab() {
  const { setConfigId } = useAppContext();
  const [newConfig, setNewConfig] = useState<Record<string, unknown>>({});

  function handleReset() {
    setNewConfig({});
    config.clear();
  }

  function saveChanges() {
    for (const [key, value] of Object.entries(newConfig)) {
      config.set(key, value);
    }

    setConfigId(shorthash(JSON.stringify(config.allConfigs())));
  }

  return (
    <ScrollView contentContainerStyle={{ margin: 'auto', paddingVertical: 12 }}>
      <VStack space={6}>
        <HStack space={12} alignSelf="center">
          <VStack space={6}>
            <VStack space={2}>
              <Text style={[baseCss.textBold]}>Versions Bar</Text>
              <HStack alignItems="center" space={4}>
                <Text>Rotation Enabled</Text>
                <Switch
                  size="sm"
                  isChecked={get(
                    newConfig,
                    'versionsBar_rotationEnabled',
                    config.get('versionsBar_rotationEnabled', false)
                  )}
                  onValueChange={value => {
                    setNewConfig(prev => ({
                      ...prev,
                      versionsBar_rotationEnabled: value,
                    }));
                  }}
                />
              </HStack>

              <HStack alignItems="center" space={4}>
                <Text>Hidden</Text>
                <Switch
                  size="sm"
                  isChecked={get(
                    newConfig,
                    'versionsBar_hidden',
                    config.get('versionsBar_hidden', false)
                  )}
                  onValueChange={value => {
                    setNewConfig(prev => ({
                      ...prev,
                      versionsBar_hidden: value,
                    }));
                  }}
                />
              </HStack>
            </VStack>

            <VStack space={2}>
              <Text style={[baseCss.textBold]}>Teams Bar</Text>
              <HStack alignItems="center" space={4}>
                <Text>Hidden</Text>
                <Switch
                  size="sm"
                  isChecked={get(
                    newConfig,
                    'teamsBar_hidden',
                    config.get('teamsBar_hidden', false)
                  )}
                  onValueChange={value => {
                    setNewConfig(prev => ({
                      ...prev,
                      teamsBar_hidden: value,
                    }));
                  }}
                />
              </HStack>

              <HStack alignItems="center" justifyContent="space-between">
                <Text>Teams</Text>
                <Input
                  mx="3"
                  placeholder="Input"
                  w="75%"
                  maxWidth="300px"
                  value={get(
                    newConfig,
                    'teamsBar_teams',
                    config.get('teamsBar_teams', [])
                  ).join(',')}
                  onChangeText={text => {
                    setNewConfig(prev => ({
                      ...prev,
                      teamsBar_teams: text.split(','),
                    }));
                  }}
                />
              </HStack>
            </VStack>

            <VStack space={2}>
              <Text style={[baseCss.textBold]}>GitLab (IssueList)</Text>
              <HStack alignItems="center" justifyContent="space-between">
                <Text>Project Id</Text>
                <Box alignItems="end">
                  <Input
                    mx="3"
                    placeholder="Input"
                    w="75%"
                    maxWidth="300px"
                    value={get(
                      newConfig,
                      'GitLab_projectId',
                      config.get('GitLab_projectId')
                    )}
                    onChangeText={text => {
                      setNewConfig(prev => ({
                        ...prev,
                        GitLab_projectId: text,
                      }));
                    }}
                  />
                </Box>
              </HStack>

              <HStack alignItems="center" justifyContent="space-between">
                <Text>Token</Text>
                <Box alignItems="end">
                  <Input
                    mx="3"
                    placeholder="Input"
                    w="75%"
                    maxWidth="300px"
                    value={get(
                      newConfig,
                      'GitLab_token',
                      config.get('GitLab_token')
                    )}
                    onChangeText={text => {
                      setNewConfig(prev => ({ ...prev, GitLab_token: text }));
                    }}
                  />
                </Box>
              </HStack>
            </VStack>

            {!isElectron && (
              <VStack space={2}>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text style={[baseCss.textBold]}>Metrics Endpoint</Text>
                  <Box alignItems="end">
                    <Input
                      mx="3"
                      placeholder="Input"
                      w="75%"
                      maxWidth="300px"
                      value={get(
                        newConfig,
                        'web_metricsEndpoint',
                        config.get('web_metricsEndpoint')
                      )}
                      onChangeText={text => {
                        setNewConfig(prev => ({
                          ...prev,
                          web_metricsEndpoint: text,
                        }));
                      }}
                    />
                  </Box>
                </HStack>
              </VStack>
            )}

            {isElectron && (
              <VStack space={2}>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text style={[baseCss.textBold]}>Metrics Repository</Text>
                  <Box alignItems="end">
                    <Input
                      mx="3"
                      placeholder="Input"
                      w="75%"
                      maxWidth="300px"
                      value={get(
                        newConfig,
                        'app_metricsRepository',
                        config.get('app_metricsRepository')
                      )}
                      onChangeText={text => {
                        setNewConfig(prev => ({
                          ...prev,
                          app_metricsRepository: text,
                        }));
                      }}
                    />
                  </Box>
                </HStack>
              </VStack>
            )}

            {isElectron && (
              <VStack space={2}>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text style={[baseCss.textBold]}>
                    Metrics Repository Branch
                  </Text>
                  <Box alignItems="end">
                    <Input
                      mx="3"
                      placeholder="Input"
                      w="75%"
                      maxWidth="300px"
                      value={get(
                        newConfig,
                        'app_metricsRepositoryBranch',
                        config.get('app_metricsRepositoryBranch')
                      )}
                      onChangeText={text => {
                        setNewConfig(prev => ({
                          ...prev,
                          app_metricsRepositoryBranch: text,
                        }));
                      }}
                    />
                  </Box>
                </HStack>
              </VStack>
            )}
          </VStack>

          <VStack space={2}>
            <Text style={[baseCss.textBold]}>
              Themes (require reload of the app to apply the changes)
            </Text>

            <HStack alignItems="center" space={4}>
              <Text>
                Default Theme{' '}
                <Text style={[baseCss.textBold]}>
                  {get(
                    newConfig,
                    'themes_defaultTheme',
                    config.get('themes_defaultTheme', 'dark')
                  )}
                </Text>
              </Text>
              <Switch
                size="sm"
                isChecked={
                  get(
                    newConfig,
                    'themes_defaultTheme',
                    config.get('themes_defaultTheme', 'dark')
                  ) === 'dark'
                }
                onValueChange={value => {
                  setNewConfig(prev => ({
                    ...prev,
                    themes_defaultTheme: value ? 'dark' : 'light',
                  }));
                }}
              />
            </HStack>

            {['dark', 'light'].map(theme => {
              return (
                <VStack space={2} key={theme}>
                  <Text style={[baseCss.textBold]}>{capitalize(theme)}</Text>

                  {[
                    'backgroundColor',
                    'accentBackgroundColor',
                    'accentBackgroundColor2',
                    'textColor',
                    'textColor2',
                  ].map(property => (
                    <Fragment key={`${theme}${property}`}>
                      <HStack
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Text>{property}</Text>
                        <HStack alignItems="center" space={3}>
                          <Input
                            placeholder="Input"
                            w="100px"
                            value={get(
                              newConfig,
                              `themes_${theme}_${property}`,
                              config.get(`themes_${theme}_${property}`)
                            )}
                            onChangeText={text => {
                              setNewConfig(prev => ({
                                ...prev,
                                [`themes_${theme}_${property}`]: text,
                              }));
                            }}
                          />

                          <input
                            type="color"
                            value={get(
                              newConfig,
                              `themes_${theme}_${property}`,
                              config.get(`themes_${theme}_${property}`)
                            )}
                            onChange={e => {
                              setNewConfig(prev => ({
                                ...prev,
                                [`themes_${theme}_${property}`]: e.target.value,
                              }));
                            }}
                          />
                        </HStack>
                      </HStack>
                    </Fragment>
                  ))}
                </VStack>
              );
            })}
          </VStack>
        </HStack>

        <HStack space={4} alignSelf="center">
          <Button onPress={() => handleReset()}>Reset</Button>
          <Button onPress={() => saveChanges()}>Save</Button>
        </HStack>
      </VStack>
    </ScrollView>
  );
}
