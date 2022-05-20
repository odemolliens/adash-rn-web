import React, { ReactNode, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ALL_TEAMS } from '../components/TeamList';
import { ALL_VERSIONS } from '../components/VersionList';
import useStore from '../hooks/useStore';

type FlashMessage = {
  type: 'error' | 'success';
  message: string;
  panelId?: string;
};

type AppContextProps = {
  colorScheme: string;
  setColorScheme: (colorScheme: 'dark' | 'light') => void;
  filterByVersion: string;
  setFilterByVersion: (version: string) => void;
  filterByTeam: string;
  setFilterByTeam: (team: string) => void;
  isFilteringActive: boolean;
  zoomedPanel: string;
  isZoomed: (panelName: string) => boolean;
  setZoomedPanel: (panelName: string) => void;
  closeZoomedPanel: () => void;
  flashMessage?: FlashMessage;
  setFlashMessage: (flashMessage: FlashMessage) => void;
  clearFlashMessage: () => void;
  configId: string;
  setConfigId: (configId: string) => void;
  hasZoomedPanel: boolean;
};

const AppContext = React.createContext({} as AppContextProps);

export const useAppContext = () => useContext(AppContext);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [configId, setConfigId] = useState('');
  const [filterByVersion, setFilterByVersion] = useState(ALL_VERSIONS);
  const [zoomedPanel, setZoomedPanel] = useState('');
  const [filterByTeam, setFilterByTeam] = useState(ALL_TEAMS);
  const isFilteringActive = !!filterByVersion || !!filterByTeam;
  const defaultColorScheme = useColorScheme() || 'dark';
  const [colorScheme, setColorScheme] = useStore(
    'themes_defaultTheme',
    defaultColorScheme
  );
  const [flashMessage, setFlashMessage] = useState({} as FlashMessage);

  function closeZoomedPanel() {
    setZoomedPanel('');
  }

  function clearFlashMessage() {
    setFlashMessage({} as FlashMessage);
  }

  function isZoomed(panelName: string) {
    return zoomedPanel === panelName;
  }

  return (
    <AppContext.Provider
      value={{
        filterByVersion,
        setFilterByVersion,
        filterByTeam,
        setFilterByTeam,
        isFilteringActive,
        zoomedPanel,
        setZoomedPanel,
        isZoomed,
        closeZoomedPanel,
        colorScheme,
        setColorScheme,
        flashMessage,
        setFlashMessage,
        clearFlashMessage,
        configId,
        setConfigId,
        hasZoomedPanel: !!zoomedPanel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
