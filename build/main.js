"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
let win;
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile("./pages/console.html");
}
electron_1.app.on('ready', createWindow);
electron_1.app.on("activate", () => {
    if (win == null) {
        createWindow();
    }
});
