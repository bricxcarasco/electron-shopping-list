const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

let mainWindow;
let addWindow;

// Create  menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

// If MAC, add empty object in menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// Add developers tool of not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developers Tool',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}

// Handle create add window 
const createAddWindow = () => {
    // Create a window
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        },
        width: 300,
        height: 200,
        title: 'Add Shopping List'
    });
    
    // Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'sub-windows/add-window.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Garbage coolection handle
    addWindow.on('close', () => {
        addWindow = null;
    });
}

// Catch item:add
ipcMain.on('item:add', (event, item) => {
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

// Listen for app to be ready
app.on('ready', () => {
    // Create a window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main-window.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Quit app when closed
    mainWindow.on('closed', () => {
        app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert the menu
    Menu.setApplicationMenu(mainMenu);
});