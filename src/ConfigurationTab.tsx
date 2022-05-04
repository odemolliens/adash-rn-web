import { get } from 'lodash';
import { Box, Button, HStack, Input, Switch, VStack } from 'native-base';
import { useState } from 'react';
import { Text } from 'react-native';
import { useAppContext } from './contexts/AppContext';
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
    <>
      <VStack space={6}>
        <VStack space={2}>
          <Text>Versions Bar</Text>
          <HStack alignItems="center" space={4}>
            <Text>Rotation Enabled</Text>
            <Switch
              size="sm"
              isChecked={get(
                newConfig,
                'versionsBar.rotationEnabled',
                config.get('versionsBar.rotationEnabled', false)
              )}
              onValueChange={value => {
                setNewConfig(prev => ({
                  ...prev,
                  'versionsBar.rotationEnabled': value,
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
                'versionsBar.hidden',
                config.get('versionsBar.hidden', false)
              )}
              onValueChange={value => {
                setNewConfig(prev => ({
                  ...prev,
                  'versionsBar.hidden': value,
                }));
              }}
            />
          </HStack>
        </VStack>

        <VStack space={2}>
          <Text>Teams Bar</Text>
          <HStack alignItems="center" space={4}>
            <Text>Hidden</Text>
            <Switch
              size="sm"
              isChecked={get(
                newConfig,
                'teamsBar.hidden',
                config.get('teamsBar.hidden', false)
              )}
              onValueChange={value => {
                setNewConfig(prev => ({ ...prev, 'teamsBar.hidden': value }));
              }}
            />
          </HStack>
        </VStack>

        <VStack space={2}>
          <Text>GitLab</Text>
          <HStack alignItems="center" space={4}>
            <Text>Project Id</Text>
            <Box alignItems="center">
              <Input
                mx="3"
                placeholder="Input"
                w="75%"
                maxWidth="300px"
                value={get(
                  newConfig,
                  'GitLab.projectId',
                  config.get('GitLab.projectId')
                )}
                onChangeText={text => {
                  setNewConfig(prev => ({ ...prev, 'GitLab.projectId': text }));
                }}
              />
            </Box>
          </HStack>

          <HStack alignItems="center" space={4}>
            <Text>Token</Text>
            <Box alignItems="center">
              <Input
                mx="3"
                placeholder="Input"
                w="75%"
                maxWidth="300px"
                value={get(
                  newConfig,
                  'GitLab.token',
                  config.get('GitLab.token')
                )}
                onChangeText={text => {
                  setNewConfig(prev => ({ ...prev, 'GitLab.token': text }));
                }}
              />
            </Box>
          </HStack>
        </VStack>

        <VStack space={2}>
          <HStack alignItems="center" space={4}>
            <Text>Metrics Endpoint</Text>
            <Box alignItems="center">
              <Input
                mx="3"
                placeholder="Input"
                w="75%"
                maxWidth="300px"
                value={get(
                  newConfig,
                  'metricsEndpoint',
                  config.get('metricsEndpoint')
                )}
                onChangeText={text => {
                  setNewConfig(prev => ({ ...prev, metricsEndpoint: text }));
                }}
              />
            </Box>
          </HStack>

          <HStack alignItems="center" space={4}>
            <Text>Teams</Text>
            <Box alignItems="center">
              <Input
                mx="3"
                placeholder="Input"
                w="100%"
                value={get(newConfig, 'teams', config.get('teams')).join(',')}
                onChangeText={text => {
                  setNewConfig(prev => ({ ...prev, teams: text.split(',') }));
                }}
              />
            </Box>
          </HStack>
        </VStack>

        <HStack space={4}>
          <Button onPress={() => handleReset()}>Reset</Button>
          <Button onPress={() => saveChanges()}>Save</Button>
        </HStack>
      </VStack>
    </>
  );
}
