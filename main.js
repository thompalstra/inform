const {app, BrowserWindow} = require('electron')

const path = require('path')
const url = require('url')

var windows = {
    main: null,
    splash: null
};

function init(){

    process.env.GOOGLE_API_KEY = 'AIzaSyCWCBkyQ98EIiW0N506ySFahY8U12Jbfkk'

    windows.splash = createSplashWindow();
    windows.main = createMainWindow();
    windows.main.on('closed', function(){
        windows.main = null;
        app.quit();
    });
    windows.main.splash = windows.splash;
}

function createSplashWindow(){
    return createWindow( '/app/views/splash.html',  { frame: false, width: 400, height: 400, show: true } );
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
    // win.on('closed', function(){
    //     console.log('closed');
    //     // console.log(this)
    //     // this = null;
    // }.bind(this));
    // win.on('closed', () => {
    //     this = null
    // }.bind(win));

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
