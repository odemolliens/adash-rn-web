import { Button, VStack } from 'native-base';
import React, { lazy, Suspense, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useAppContext } from '../contexts/AppContext';
import { styleSheetFactory } from '../themes';
import { humanize } from '../utils';
import Panel from './Panel';

type GridItemProps = {
  item: string;
  editing: boolean;
  onRemove: (fn: any) => void;
};

export default React.memo(({ item, editing, onRemove }: GridItemProps) => {
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);
  const panel = useMemo(() => lazy(() => import(`../panels/${item}`)), [item]);

  return (
    <View style={styles.gridItemContainer}>
      <VStack space={2} h="full">
        {editing && (
          <Button
            onPress={() =>
              onRemove((data: any) => data.filter((d: any) => d != item))
            }
          >
            Remove
          </Button>
        )}

        <ErrorBoundary
          FallbackComponent={({ error }) => (
            <Panel id={item} variant="error">
              <Panel.Title>{humanize(item)}</Panel.Title>
              <Panel.Error>
                Something went wrong:
                <br />
                {error.message}
              </Panel.Error>
            </Panel>
          )}
        >
          <Suspense fallback={null}>{React.createElement(panel)}</Suspense>
        </ErrorBoundary>
      </VStack>
    </View>
  );
});

const themedStyles = styleSheetFactory(theme => ({
  gridItemContainer: {
    flex: 1,
    margin: 6,
    position: 'relative',
  },
}));
