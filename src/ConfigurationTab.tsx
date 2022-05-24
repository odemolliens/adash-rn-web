import { capitalize } from 'lodash';
import {
  Box,
  Button,
  HStack,
  Input,
  ScrollView,
  Switch,
  VStack,
} from 'native-base';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text } from 'react-native';
import { usePanelsStore } from './panelsStore';
import { forceReload, isElectron } from './platform';
import { baseCss } from './themes';
import { config } from './utils';

export default function ConfigurationTab() {
  useEffect(() => {
    // load panels
    config.get('availablePanels').map((panel: string) => {
      import(`./panels/${panel}`);
    });
  }, []);

  const panelsConfigurations = usePanelsStore(
    state => state.panelsConfigurations
  );

  const { register, handleSubmit, control, watch, reset } = useForm({
    defaultValues: config.allConfigs(),
  });

  const onSubmit = (data: any) => {
    for (const [key, value] of Object.entries(data)) {
      config.set(key, value);
    }
    forceReload();
  };

  function handleReset() {
    config.clear();
    reset();
    forceReload();
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

                <Controller
                  control={control}
                  name={'versionsBar_rotationEnabled'}
                  defaultValue={config.get(
                    'versionsBar_rotationEnabled',
                    false
                  )}
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      size="sm"
                      isChecked={value}
                      onValueChange={onChange}
                    />
                  )}
                />
              </HStack>

              <HStack alignItems="center" space={4}>
                <Text>Hidden</Text>

                <Controller
                  control={control}
                  name={'versionsBar_hidden'}
                  defaultValue={config.get('versionsBar_hidden', false)}
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      size="sm"
                      isChecked={value}
                      onValueChange={onChange}
                    />
                  )}
                />
              </HStack>
            </VStack>

            <VStack space={2}>
              <Text style={[baseCss.textBold]}>Teams Bar</Text>
              <HStack alignItems="center" space={4}>
                <Text>Hidden</Text>

                <Controller
                  control={control}
                  name={'teamsBar_hidden'}
                  defaultValue={config.get('teamsBar_hidden', false)}
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      size="sm"
                      isChecked={value}
                      onValueChange={onChange}
                    />
                  )}
                />
              </HStack>

              <HStack alignItems="center" justifyContent="space-between">
                <Text>Teams</Text>
                <Controller
                  control={control}
                  name={'teamsBar_teams'}
                  defaultValue={config.get('teamsBar_teams', [])}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      mx="3"
                      placeholder="Input"
                      w="75%"
                      maxWidth="300px"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={text => onChange(text.split(','))}
                    />
                  )}
                />
              </HStack>
            </VStack>

            <VStack space={2}>
              <Text style={[baseCss.textBold]}>Status Bar</Text>

              <HStack alignItems="center" space={4}>
                <Text>Hidden</Text>

                <Controller
                  control={control}
                  name={'statusBar_hidden'}
                  defaultValue={config.get('statusBar_hidden', false)}
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      size="sm"
                      isChecked={value}
                      onValueChange={onChange}
                    />
                  )}
                />
              </HStack>
            </VStack>

            {!isElectron && (
              <VStack space={2}>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text style={[baseCss.textBold]}>Metrics Endpoint</Text>
                  <Box alignItems="end">
                    <Controller
                      control={control}
                      name={'web_metricsEndpoint'}
                      defaultValue={config.get('web_metricsEndpoint', '')}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          mx="3"
                          placeholder="Input"
                          w="75%"
                          maxWidth="300px"
                          value={value}
                          onBlur={onBlur}
                          onChangeText={onChange}
                        />
                      )}
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
                    <Controller
                      control={control}
                      name={'app_metricsRepository'}
                      defaultValue={config.get('app_metricsRepository', '')}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          mx="3"
                          placeholder="Input"
                          w="75%"
                          maxWidth="300px"
                          value={value}
                          onBlur={onBlur}
                          onChangeText={onChange}
                        />
                      )}
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
                    <Controller
                      control={control}
                      name={'app_metricsRepositoryBranch'}
                      defaultValue={config.get(
                        'app_metricsRepositoryBranch',
                        ''
                      )}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          mx="3"
                          placeholder="Input"
                          w="75%"
                          maxWidth="300px"
                          value={value}
                          onBlur={onBlur}
                          onChangeText={onChange}
                        />
                      )}
                    />
                  </Box>
                </HStack>
              </VStack>
            )}

            <fieldset style={{ padding: 12 }}>
              <legend>
                <Text>Panels configurations</Text>
              </legend>
              <VStack space={4}>
                {Object.entries(panelsConfigurations).map(
                  ([key, pConfig]: [string, Record<string, any>]) => {
                    return (
                      <VStack space={2} key={key}>
                        <Text style={[baseCss.textBold]}>{pConfig.label}</Text>

                        {pConfig.configs.map(
                          (ppConfig: Record<string, string>) => {
                            return (
                              <HStack
                                alignItems="center"
                                justifyContent="space-between"
                                key={ppConfig.label}
                              >
                                <Text>{ppConfig.label}</Text>
                                <Box alignItems="end">
                                  <Controller
                                    control={control}
                                    name={ppConfig.configKey}
                                    defaultValue={config.get(
                                      ppConfig.configKey,
                                      ''
                                    )}
                                    render={({
                                      field: { onChange, onBlur, value },
                                    }) => (
                                      <Input
                                        mx="3"
                                        placeholder="Input"
                                        w="75%"
                                        maxWidth="300px"
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                      />
                                    )}
                                  />
                                </Box>
                              </HStack>
                            );
                          }
                        )}
                      </VStack>
                    );
                  }
                )}
              </VStack>
            </fieldset>
          </VStack>

          <VStack space={2}>
            <Text style={[baseCss.textBold]}>
              Themes (require reload of the app to apply the changes)
            </Text>

            <HStack alignItems="center" space={4}>
              <Text>
                Default Theme{' '}
                <Text style={[baseCss.textBold]}>
                  {watch('themes_defaultTheme')}
                </Text>
              </Text>

              <Controller
                control={control}
                name={'themes_defaultTheme'}
                defaultValue={config.get('themes_defaultTheme', 'dark')}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    size="sm"
                    isChecked={value === 'dark'}
                    onValueChange={value => onChange(value ? 'dark' : 'light')}
                  />
                )}
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
                    <HStack
                      key={`${theme}${property}`}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Text>{property}</Text>
                      <HStack alignItems="center" space={3}>
                        <Controller
                          control={control}
                          name={`themes_${theme}_${property}`}
                          defaultValue={config.get(
                            `themes_${theme}_${property}`,
                            ''
                          )}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                              placeholder="Input"
                              w="100px"
                              value={value}
                              onBlur={onBlur}
                              onChangeText={onChange}
                            />
                          )}
                        />

                        <input
                          type="color"
                          defaultValue={config.get(
                            `themes_${theme}_${property}`,
                            ''
                          )}
                          {...register(`themes_${theme}_${property}`)}
                        />
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              );
            })}
          </VStack>
        </HStack>

        <HStack space={4} alignSelf="center">
          <Button onPress={handleReset}>Reset</Button>
          <Button onPress={handleSubmit(onSubmit)}>Save</Button>
        </HStack>
      </VStack>
    </ScrollView>
  );
}
