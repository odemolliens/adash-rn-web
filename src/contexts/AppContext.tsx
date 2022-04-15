import { isEmpty } from 'lodash';
import React, { ReactNode, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useLocalStorage } from 'usehooks-ts';
import { ALL_TEAMS } from '../components/TeamList';
import { ALL_VERSIONS } from '../components/VersionList';
import { useCollectedData } from '../hooks/useCollectedData';

type FlashMessage = {
  type: 'error' | 'success';
  message: string;
  panelId?: string;
};

type Threshold = {
  max: number;
};

type AppContextProps = {
  data: {
    statusData: Record<string, any>[];
    bitriseData: Record<string, any>[];
    gitlabData: Record<string, any>[];
    browserStackData: Record<string, any>[];
    thresholdsData: Record<string, Threshold>;
    codeMagicData: Record<string, any>[];
  };
  colorScheme: string;
  setColorScheme: (colorScheme: 'dark' | 'light') => void;
  filterByVersion: string;
  setFilterByVersion: (version: string) => void;
  filterByTeam: string;
  setFilterByTeam: (team: string) => void;
  isFilteringActive: boolean;
  zoomedPanel: string;
  setZoomedPanel: (panelName: string) => void;
  closeZoomedPanel: () => void;
  auth: null | { projectId: string; token: string };
  isAuthenticated: boolean;
  setAuth: (auth: string) => void;
  logout: () => void;
  flashMessage?: FlashMessage;
  setFlashMessage: (flashMessage: FlashMessage) => void;
  clearFlashMessage: () => void;
};

const AppContext = React.createContext({} as AppContextProps);

export const useAppContext = () => useContext(AppContext);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [filterByVersion, setFilterByVersion] = useState(ALL_VERSIONS);
  const [zoomedPanel, setZoomedPanel] = useState('');
  const [filterByTeam, setFilterByTeam] = useState(ALL_TEAMS);
  const isFilteringActive = !!filterByVersion || !!filterByTeam;
  const collectedData = useCollectedData();
  const defaultColorScheme = useColorScheme() || 'light';
  const [colorScheme, setColorScheme] = useLocalStorage(
    'colorScheme',
    defaultColorScheme
  );
  const [auth, setAuth] = useLocalStorage('auth', '');
  const [flashMessage, setFlashMessage] = useState({} as FlashMessage);
  const [projectId, token] = auth.split(':');

  const filterSetAuth = (auth: string) => {
    if (!auth.includes(':')) {
      alert('`ProjectId:Token` is not in the right format');
      return;
    }
    setAuth(auth);
  };

  return (
    <AppContext.Provider
      value={{
        data: collectedData,
        filterByVersion,
        setFilterByVersion,
        filterByTeam,
        setFilterByTeam,
        isFilteringActive,
        zoomedPanel,
        setZoomedPanel,
        closeZoomedPanel: () => setZoomedPanel(''),
        colorScheme,
        setColorScheme,
        auth: isEmpty(auth) ? null : { projectId, token },
        setAuth: filterSetAuth,
        isAuthenticated: !isEmpty(auth),
        logout: () => setAuth(''),
        flashMessage,
        setFlashMessage,
        clearFlashMessage: () => setFlashMessage({} as FlashMessage),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
