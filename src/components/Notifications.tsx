import { Ionicons } from '@expo/vector-icons';
import { Menu, Pressable, Tooltip } from 'native-base';
import { Text, useWindowDimensions, View } from 'react-native';
import { useTheme } from 'react-native-themed-styles';
import { useAppContext } from '../contexts/AppContext';
import { useFetch } from '../hooks/useCollectedData';
import { baseCss, styleSheetFactory } from '../themes';
import { config, formatDate } from '../utils';
import Chip from './Chip';
import StatusIcon, { StatusIconVariant } from './StatusIcon';

type Notification = {
  createdAt: number;
  title: string;
  unread: boolean;
  type: string;
};

export default function Notifications() {
  const { height } = useWindowDimensions();
  const { data: notificationsData = [] } = useFetch(
    `${config.metricsEndpoint}/data/notifications.json`
  );

  const { colorScheme } = useAppContext();
  const [styles, theme] = useTheme(themedStyles, colorScheme);

  const notificationsMarked = notificationsData.map(n => ({
    ...n,
    unread: new Date(n.createdAt).getDate() === new Date().getDate(),
  }));

  const counter = notificationsMarked.filter(n => n.unread).length;
  const hasNotifications = counter > 0;

  return (
    <View style={styles.container}>
      <Menu
        w="300"
        maxHeight={height - 150}
        trigger={triggerProps => {
          return (
            <Tooltip label="Notifications">
              <Pressable
                accessibilityLabel="More options menu"
                {...triggerProps}
              >
                <Chip variant={hasNotifications ? 'highlight' : undefined}>
                  <Ionicons
                    name="notifications-outline"
                    size={15}
                    color={
                      hasNotifications ? theme.textColor2 : theme.textColor
                    }
                  />
                </Chip>

                {hasNotifications && (
                  <Text
                    style={[
                      baseCss.textBold,
                      baseCss.textCenter,
                      styles.notificationsIcon,
                    ]}
                  >
                    {counter}
                  </Text>
                )}
              </Pressable>
            </Tooltip>
          );
        }}
      >
        {notificationsMarked.reverse().map((n, i) => (
          <Menu.Item key={i}>
            <NotificationItem notification={n} />
          </Menu.Item>
        ))}
      </Menu>
    </View>
  );
}

type NotificationItemProps = {
  notification: Notification;
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const { colorScheme } = useAppContext();
  const [styles] = useTheme(themedStyles, colorScheme);

  return (
    <View style={styles.notification}>
      <View style={{ padding: 10 }}>
        <StatusIcon variant={notification.type as StatusIconVariant} />
      </View>

      <View
        style={{
          flex: 1,
        }}
      >
        <Text style={[baseCss.textBold]}>{notification.title}</Text>
        <Text>{formatDate(notification.createdAt)}</Text>
      </View>

      <View
        style={[
          styles.notificationDot,
          notification.unread && { backgroundColor: '#2E89FF' },
        ]}
      />
    </View>
  );
}

const themedStyles = styleSheetFactory(() => ({
  container: { flexDirection: 'row', position: 'relative' },
  notificationsIcon: {
    position: 'absolute',
    right: 2,
    top: 2,
    width: 20,
    height: 20,
    backgroundColor: 'red',
    color: '#fff',
    borderRadius: 50,
    overflow: 'hidden',
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 5,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  notificationDot: {
    width: 12,
    height: 12,
    overflow: 'hidden',
    borderRadius: 50,
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
}));
