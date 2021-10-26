const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

let splashScreen;
let mainwin;
let loadMainWindow = () => {
    mainwin = new BrowserWindow({
        minWidth: 475,
        minHeight: 700,
        width: 475,
        height: 700,
        resizable: false,
        fullscreenable: false,
        maximizable: false,
        minimizable: true,
        autoHideMenuBar: true,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    if (process.env.ELECTRON_START_URL)
        mainwin.webContents.openDevTools();

    let startUrl = process.env.ELECTRON_START_URL.trim() ?
        process.env.ELECTRON_START_URL.trim()
        :
        url.format({
            pathname: path.join(__dirname, '/build/index.html'),
            protocol: 'file:',
            slashes: true,
        });
    mainwin.loadURL(startUrl);

    // if main window is ready to show, then destroy the splash window and show up the main window
    mainwin.once('ready-to-show', () => {
        setTimeout(() => {
            splashScreen.destroy();
            mainwin.show();
        }, 1000);
    });

};

let loadSplash = () => {
    splashScreen = new BrowserWindow({
        width: 100,
        height: 100,
        resizable: false,
        fullscreenable: false,
        alwaysOnTop: true,
        maximizable: false,
        minimizable: false,
        transparent: true,
        frame: false,
        center: true,
        autoHideMenuBar: true,
    });
    let startUrl = process.env.ELECTRON_START_URL.trim() ?
        (process.env.ELECTRON_START_URL.trim() + "/splash.html")
        :
        url.format({
            pathname: path.join(__dirname, '/build/splash.html'),
            protocol: 'file:',
            slashes: true,
        });
    splashScreen.loadURL(startUrl);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    loadSplash();
    loadMainWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.

    if (BrowserWindow.getAllWindows().length === 0)
        loadMainWindow();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.