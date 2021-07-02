// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 150,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "icon.png"),
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  //hide menu bar
  mainWindow.setMenuBarVisibility(false);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  mainWindow.webContents.once("did-finish-load", () => {
    mainWindow.webContents.send("sys-info", getSystemInfo());
  });

  ipcMain.on("request-info", (evt, args) => {
    evt.sender.send("sys-info", getSystemInfo());
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function getSystemInfo() {
  const memoryInfo = process.getSystemMemoryInfo();
  const ramFreePercent = ((memoryInfo.free / memoryInfo.total) * 100).toFixed(
    2
  );
  const percentCPUUsage = process.getCPUUsage().percentCPUUsage.toFixed(2);

  const systemInfo = {
    memory: {
      free: memoryInfo.free,
      total: memoryInfo.total,
      ramFreePercent,
    },
    cpu: {
      percentCPUUsage,
    },
  };
  return systemInfo;
}
