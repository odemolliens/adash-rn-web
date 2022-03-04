import { useWindowDimensions } from 'react-native';

export default function useBreapoint() {
  const { width } = useWindowDimensions();

  switch (true) {
    case width >= 2000:
      return '3xl';

    case width >= 1536:
      return '2xl';

    case width >= 1280:
      return 'xl';

    case width >= 1024:
      return 'lg';

    case width >= 768:
      return 'md';

    default:
      return 'sm';
  }
}
