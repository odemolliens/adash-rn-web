import { useDisclose } from 'native-base';
import { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

type DiscloseViewProps = { header: ReactNode; children: ReactNode };

export default function DiscloseView({ header, children }: DiscloseViewProps) {
  const { isOpen, onToggle } = useDisclose(false);

  return (
    <>
      <Pressable onPress={onToggle}>
        <View>{header}</View>
      </Pressable>

      <View style={[!isOpen && { height: 0, overflow: 'hidden' }]}>
        {children}
      </View>
    </>
  );
}
