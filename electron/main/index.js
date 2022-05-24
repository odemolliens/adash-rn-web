'use strict';

import { shell, simpleLogger } from 'adash-ts-helper';
import { app, BrowserWindow, dialog, ipcMain, Menu, protocol } from 'electron';
import fs from 'fs';
import * as path from 'path';
import { format as formatUrl } from 'url';

const Store = require('electron-store');
Store.initRenderer();

const config = new Store();

const sh = shell({ logger: simpleLogger() });

const console = {
  log(data) {
    mainWindow.webContents.send('consolelog', data);

    dialog.showMessageBox(null, {
      message: JSON.stringify(data),
    });
  },
};

const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;
let syncInterval;

function createMainWindow() {
  const browserWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true, webSecurity: false },
    width: 1920,
    height: 1080,
    sandbox: true,
  });

  ipcMain.on('reload', () => {
    mainWindow.webContents.reloadIgnoringCache();
  });

  protocol.interceptFileProtocol(
    'file',
    function (request, callback) {
      if (request.url.includes('data/')) {
        callback({
          path: isDevelopment
            ? request.url.substr(8)
            : path.normalize(
                `${process.resourcesPath}/${request.url.substr(7)}`
              ),
        });
      } else {
        callback({ path: request.url.substr(8) });
      }
    },
    function (err) {
      // nothing
      //if (err) console.log('Failed to register protocol');
    }
  );

  const mainMenuTemplate = [
    {
      label: 'Adash',
      submenu: [
        {
          label: 'Exit',
          click() {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo',
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut',
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy',
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste',
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectAll',
        },
      ],
    },
    {
      label: 'Tools',
      submenu: [
        { label: 'Toggle DevTools', role: 'toggleDevTools' },
        { label: 'Force Reload', role: 'forceReload' },
        {
          label: 'Clear Config',
          click() {
            config.clear();
          },
        },
        {
          label: 'Log Config',
          click() {
            console.log(config.store);
          },
        },
        {
          label: 'Sync metrics',
          click() {
            syncMetrics();
          },
        },
        {
          label: 'FAKE Sync metrics',
          click() {
            mainWindow.webContents.send('sync', 'FAKE Sync metrics');

            setTimeout(() => {
              mainWindow.webContents.send('syncend');
            }, 5 * 1000);
          },
        },
      ],
    },
  ];

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  if (isDevelopment) {
    browserWindow.webContents.openDevTools();
  }

  if (isDevelopment) {
    browserWindow.loadURL(
      `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
    );
  } else {
    browserWindow.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      })
    );
  }

  browserWindow.on('closed', () => {
    mainWindow = null;
  });

  browserWindow.webContents.on('devtools-opened', () => {
    browserWindow.focus();
    setImmediate(() => {
      browserWindow.focus();
    });
  });

  return browserWindow;
}

function syncMetrics() {
  const dataPath = isDevelopment
    ? 'data'
    : path.join(process.resourcesPath, 'data');

  let output;

  mainWindow.webContents.send('sync');

  if (!fs.existsSync(dataPath)) {
    console.log('Syncinc metrics... this could take a while');

    output = sh`git clone -b ${config.get(
      'app_metricsRepositoryBranch'
    )} ${config.get('app_metricsRepository')} ${dataPath};`;

    output && console.log(output);

    clearInterval(syncInterval);
    syncInterval = setInterval(() => {
      syncMetrics();
    }, 60 * 1000);
  } else {
    output = sh`cd ${dataPath} && git pull`;
  }

  mainWindow.webContents.send('syncend');
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  //if (process.platform !== 'darwin') {
  app.quit();
  //}
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});
