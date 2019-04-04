import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as os from "os";
import { format as formatUrl } from "url";
import "./server";

const DEV_ENV = process.env.NODE_ENV !== "production";
const REACT_DEVTOOLS = true;
const WIDTH = 1024;
const HEIGHT = 768;
const MENUBAR_HEIGHT = os.type() === "Darwin" ? 22 : 0;

let mainWindow: Electron.BrowserWindow;

function createMainWindow() {
  const window = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT + MENUBAR_HEIGHT,
  });

  if (DEV_ENV) {
    window.webContents.openDevTools();
  }

  if (DEV_ENV) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true,
      }),
    );
  }

  window.on("closed", () => {
    mainWindow = null as any;
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

app.on("ready", () => {
  mainWindow = createMainWindow();

  if (DEV_ENV && REACT_DEVTOOLS) {
    BrowserWindow.addDevToolsExtension(
      path.join(
        os.homedir(),
        "/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0",
      ),
    );
  }
});
