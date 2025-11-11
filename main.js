const path = require('path');
const { app, BrowserWindow, nativeImage, session, systemPreferences } = require('electron');

const CHATGPT_URL = 'https://chatgpt.com/';
const APP_NAME = 'ChatGPT';
const ICON_SIZE = 512;
const SESSION_PARTITION = 'persist:chatgpt';
const iconPath = path.join(__dirname, 'assets', 'icon.png');
const userDataPath = path.join(app.getPath('appData'), APP_NAME);
const SAFARI_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15';

let appIcon = nativeImage.createFromPath(iconPath);
if (!appIcon.isEmpty()) {
  const { width, height } = appIcon.getSize();
  if (width !== ICON_SIZE || height !== ICON_SIZE) {
    appIcon = appIcon.resize({ width: ICON_SIZE, height: ICON_SIZE });
  }
}

app.setName(APP_NAME);
app.setPath('userData', userDataPath);

function setupPermissionHandling() {
  const allowedPermissions = new Set([
    'media',
    'camera',
    'microphone',
    'audioCapture',
    'videoCapture',
    'display-capture',
    'wakeLock',
    'screen-wake-lock',
    'idleDetection',
  ]);

  const mediaPromptPermissions = new Set([
    'media',
    'camera',
    'microphone',
    'audioCapture',
    'videoCapture',
  ]);

  const chatgptSession = session.fromPartition(SESSION_PARTITION);

  const requestSystemMediaAccess = async (permission) => {
    if (process.platform !== 'darwin') {
      return true;
    }

    if (permission === 'microphone' || permission === 'audioCapture') {
      return systemPreferences.askForMediaAccess('microphone');
    }

    if (permission === 'camera' || permission === 'videoCapture') {
      return systemPreferences.askForMediaAccess('camera');
    }

    if (permission === 'media') {
      const micGranted = await systemPreferences.askForMediaAccess('microphone');
      const camGranted = await systemPreferences.askForMediaAccess('camera');
      return micGranted && camGranted;
    }

    return true;
  };

  chatgptSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (!allowedPermissions.has(permission)) {
      callback(false);
      return;
    }

    if (mediaPromptPermissions.has(permission)) {
      requestSystemMediaAccess(permission)
        .then((granted) => callback(Boolean(granted)))
        .catch(() => callback(false));
      return;
    }

    callback(true);
  });

  chatgptSession.setPermissionCheckHandler((webContents, permission, requestingOrigin) => {
    if (allowedPermissions.has(permission)) {
      return true;
    }

    return false;
  });
}

function createMainWindow() {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    title: APP_NAME,
    icon: appIcon.isEmpty() ? undefined : appIcon,
    webPreferences: {
      partition: SESSION_PARTITION,
    },
  });

  window.webContents.setUserAgent(SAFARI_USER_AGENT);
  window.loadURL(CHATGPT_URL, { userAgent: SAFARI_USER_AGENT });
}

app.whenReady().then(() => {
  setupPermissionHandling();
  session.fromPartition(SESSION_PARTITION).setUserAgent(SAFARI_USER_AGENT);
  if (process.platform === 'darwin' && !appIcon.isEmpty()) {
    app.dock.setIcon(appIcon);
  }

  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  const chatgptSession = session.fromPartition(SESSION_PARTITION);
  chatgptSession.flushStorageData();
});
