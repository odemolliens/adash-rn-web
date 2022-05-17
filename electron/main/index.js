'use strict';

import { shell, simpleLogger } from 'adash-ts-helper';
import { app, BrowserWindow, dialog, Menu, protocol } from 'electron';
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

function createMainWindow() {
  const browserWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true, webSecurity: false },
    width: 1280,
    height: 768,
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
      if (err) console.error('Failed to register protocol');
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

  setImmediate(() => {
    console.log('Syncinc metrics... this could take a while');

    let output;
    if (!fs.existsSync(dataPath)) {
      output = sh`git clone -b ${config.get(
        'app_metricsRepositoryBranch'
      )} ${config.get('app_metricsRepository')} ${dataPath};`;
    } else {
      output = sh`cd ${dataPath} && git pull`;
    }

    output && console.log(output);
  });
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
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
