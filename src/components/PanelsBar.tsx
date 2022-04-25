import { Button, HStack, ScrollView } from 'native-base';

type PanelsBarProps = {
  availablePanels: string[];
  currentPanels: string[];
  editing: boolean;
  onChange: Function;
};

export default function PanelsBar({
  availablePanels,
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
        <Button variant="outline" onPress={() => onChange(availablePanels)}>
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
                {key
                  .replace('Panel', '')
                  .split(/(?=[A-Z])/)
                  .join(' ')}
              </Button>
            );
          })}
      </HStack>
    </ScrollView>
  );
}
