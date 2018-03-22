const {app, BrowserWindow} = require('electron')

const path = require('path')
const url = require('url')

var windows = {
    main: null,
    splash: null
};

function init(){
    windows.splash = createSplashWindow();
    windows.main = createMainWindow();
    windows.main.splash = windows.splash;
}

function createSplashWindow(){
    return createWindow( '/app/views/splash.html',  { width: 400, height: 400, show: true } );
}

function createMainWindow(){
    return createWindow( '/app/views/layouts/main.html',  { width: 800, height: 600, show: false }, true );
}

function createWindow ( _url, options, hasConsole ) {

    if( typeof hasConsole == 'undefined' ){
        hasConsole = true;
    }

    var win = new BrowserWindow(options);
    win.loadURL(url.format({
        pathname: path.join(__dirname, _url),
        protocol: 'file:',
        slashes: true
    }))

    if( hasConsole ){
        win.webContents.openDevTools();
    }

    win.on('closed', () => {
        win = null
    });

    return win;
}

app.on('ready', init)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        init()
    }
})
