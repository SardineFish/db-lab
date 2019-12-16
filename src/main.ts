import electron, { BrowserWindow, app } from "electron";

let win: BrowserWindow;
function createWindow()
{
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile("./pages/console.html");

}
app.on('ready', createWindow);

app.on("activate", () =>
{
    if (win == null)
    {
        createWindow();
    }
});