import React from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

type ZoomPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  children: any;
};

export default function ZoomPanel({
  isOpen,
  onClose,
  children,
}: ZoomPanelProps) {
  const { width } = useWindowDimensions();

  return isOpen ? (
    <View style={css.container}>
      <Pressable onPress={onClose} style={css.backdrop} />
      <View style={[css.innerContainer, { width: width / 1.5 }]}>
        {children}
      </View>
    </View>
  ) : null;
}

const css = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    opacity: 0.6,
  },
  innerContainer: { margin: 'auto' },
});
