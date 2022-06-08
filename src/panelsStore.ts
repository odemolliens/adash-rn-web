import createReact from 'zustand';
import create from 'zustand/vanilla';

type State = {
  readonly panelsConfigurations: Record<string, any>;
  readonly register: (
    panelConfig: Record<string, Record<string, unknown>>
  ) => void;
};

const panelsStore = create<State>(set => ({
  panelsConfigurations: {},
  register: panelConfig =>
    set(state => ({
      panelsConfigurations: { ...state.panelsConfigurations, ...panelConfig },
    })),
}));

export const usePanelsStore = createReact(panelsStore);

export const registerPanelConfigs = (panelConfig: Record<string, any>) =>
  usePanelsStore.getState().register(panelConfig);
