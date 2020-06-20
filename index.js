const electron = require('electron');
const { app, BrowserWindow, Menu } = require('electron');
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
                label: 'Clear Items'
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

// Handle create add window 
const createAddWindow = () => {
    // Create a window
    addWindow = new BrowserWindow({
        width: 200,
        height: 300,
        title: 'Add Shopping List'
    });
    
    // Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'add-window.html'),
        protocol: 'file:',
        slashes: true
    }));
}

// Listen for app to be ready
app.on('ready', () => {
    // Create a window
    mainWindow = new BrowserWindow({});
    
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main-window.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert the menu
    Menu.setApplicationMenu(mainMenu);
});