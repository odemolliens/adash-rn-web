import { ipcRenderer } from 'electron';

export const isElectron = true;

ipcRenderer.on('consolelog', (_, data) => {
  console.log('From Electron', data);
});


export function forceReload() {
  ipcRenderer.send('reload');
}