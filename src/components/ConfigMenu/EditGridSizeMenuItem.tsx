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
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Button onPress={() => onChange(Number(gridSize) - 1 + '')}>-</Button>

      <Text>Grid Size: {gridSize}</Text>
      <Button onPress={() => onChange(Number(gridSize) + 1 + '')}>+</Button>
    </View>
  );
}
