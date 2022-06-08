import { Button, HStack, ScrollView } from 'native-base';
import { humanize } from '../utils';

type PanelsBarProps = {
  availablePanels: string[];
  defaultPanels: string[];
  currentPanels: string[];
  editing: boolean;
  onChange: Function;
};

export default function PanelsBar({
  availablePanels,
  defaultPanels,
  currentPanels,
  editing,
  onChange,
}: PanelsBarProps) {
  if (!editing) return null;

  return (
    <ScrollView horizontal>
      <HStack
        space={4}
        px="2"
        mt="4"
        alignItems="center"
        justifyContent="center"
      >
        <Button variant="outline" onPress={() => onChange(defaultPanels)}>
          Reset
        </Button>

        {availablePanels
          .filter(key => !currentPanels.includes(key))
          .map(key => {
            return (
              <Button
                variant="outline"
                key={key}
                onPress={() =>
                  onChange((prevData: string[]) => [key, ...prevData])
                }
              >
                {humanize(key.replace('Panel', ''))}
              </Button>
            );
          })}
      </HStack>
    </ScrollView>
  );
}
