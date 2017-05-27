let electron = require('electron');

const {
  app,
  BrowserWindow,
  Menu,
  ipcMain
} = electron;

let mainWindow;
let mainMenu;
let addWindow;

app.on('ready', () => {
  console.log('We started electron app');
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);

  mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});

function addTodoWindow() {
  addWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: 'Add new todo'
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on('close', () => addWindow = null);
}

function clearTodoList() {
  mainWindow.webContents.send('todo:clear');
}


const menuTemplate = [{
  label: 'file',
  submenu: [{
      label: 'New todo',
      accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
      click() {
        addTodoWindow();
      }
    },
    {
      label: 'clear Todo list',
      accelerator: process.platform === 'darwin' ? 'Command+U' : 'Ctrl+U',
      click() {
        clearTodoList();
      }
    },
    {
      label: 'close',
      click() {
        app.quit();
      }
    }
  ]
}]


if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'development',
    accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
    submenu: [{
      label: 'dev-tools',
      click(item, focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    }]
  })
}
