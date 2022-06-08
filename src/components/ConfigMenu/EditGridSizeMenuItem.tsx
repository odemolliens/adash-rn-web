import { Button } from 'native-base';
import { Text, View } from 'react-native';

type EditGridSizeMenuItemProps = {
  gridSize: string;
  onChange: (value: string) => void;
};

export default function EditGridSizeMenuItem({
  gridSize,
  onChange,
}: EditGridSizeMenuItemProps) {
  const currentGridSize = Number(gridSize);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Button
        onPress={() =>
          onChange(
            (currentGridSize - 1 > 0 ? currentGridSize - 1 : currentGridSize) +
              ''
          )
        }
      >
        -
      </Button>

      <Text>Grid Size: {gridSize}</Text>
      <Button onPress={() => onChange(currentGridSize + 1 + '')}>+</Button>
    </View>
  );
}
