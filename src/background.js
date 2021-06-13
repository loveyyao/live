'use strict'

import {
  app,
  protocol,
  BrowserWindow,
  screen,
  Menu,
  Tray,
  ipcMain
} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
let appTray = null
async function createWindow() {
  // Create the browser window.
  const trayIcon = path.join(__dirname, '../build/tray.png')
  appTray = new Tray(trayIcon)
  const trayMenuTemplate = [
    {
      label: '退出',
      click: function () {
        app.quit()
      }
    }
  ]
  //图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
  //设置此托盘图标的悬停提示内容
  appTray.setToolTip('看板娘')
  //设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu)
  const winW = screen.getPrimaryDisplay().workAreaSize.width
  const winH = screen.getPrimaryDisplay().workAreaSize.height
  const win = new BrowserWindow({
    width: 250,
    height: 250,
    frame: false,
    x: winW - 250,
    y: winH - 250,
    transparent: true,
    skipTaskbar: false,
    title: '看板娘',
    icon: trayIcon,
    webPreferences: {

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  // app.dock.setIcon(trayIcon)
  appTray.on('click', function () {
    win.isVisible() ? win.hide() : win.show();
  })
  win.setAlwaysOnTop(true)

  ipcMain.on('close-win', function () {
    win.hide()
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
