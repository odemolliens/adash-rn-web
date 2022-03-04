import { Ionicons } from '@expo/vector-icons';

export type StatusIconVariant =
  | 'highlight'
  | 'error'
  | 'warning'
  | 'success'
  | 'low'
  | 'medium'
  | 'high'
  | 'monitor'
  | 'progress';

type StatusIconProps = {
  variant?: StatusIconVariant;
  size?: number;
  onPress?: () => void;
};

const getVariantProps = (variant?: StatusIconVariant) => {
  switch (variant) {
    case 'success':
    case 'monitor':
      return { color: '#0FC389', name: 'md-checkmark-circle' as const };

    case 'warning':
    case 'medium':
      return { color: '#FFD134', name: 'md-alert-circle' as const };

    case 'progress':
      return {
        color: '#ffffff',
        name: 'md-ellipsis-horizontal-circle' as const,
      };

    case 'error':
    case 'high':
      return { color: '#FF2158', name: 'md-close-circle-sharp' as const };

    default:
      return { color: '#ffffff', name: 'md-checkmark-circle' as const };
  }
};

export default function StatusIcon({
  variant,
  size = 32,
  onPress,
}: StatusIconProps) {
  return (
    <Ionicons {...getVariantProps(variant)} size={size} onPress={onPress} />
  );
}
