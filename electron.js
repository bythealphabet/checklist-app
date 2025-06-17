const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let serverProcess;
let serverReady = false;

function checkServerReady(port = 3000, maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const checkServer = () => {
      if (serverReady) {
        resolve();
        return;
      }
      
      attempts++;
      console.log(`Checking server... attempt ${attempts}`);
      
      const req = http.get(`http://localhost:${port}`, (res) => {
        console.log('Server is ready!');
        serverReady = true;
        resolve();
      });
      
      req.on('error', (err) => {
        if (attempts >= maxAttempts) {
          console.error('Server failed to start after maximum attempts');
          reject(err);
        } else {
          console.log(`Server not ready yet, retrying in 1 second...`);
          setTimeout(checkServer, 1000);
        }
      });
      
      req.setTimeout(1000, () => {
        req.destroy();
        if (attempts >= maxAttempts) {
          reject(new Error('Server timeout'));
        } else {
          setTimeout(checkServer, 1000);
        }
      });
    };
    
    checkServer();
  });
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false // Allow loading local content
    },
    icon: path.join(__dirname, 'assets', 'icon.png'), // Optional: add an icon
    title: 'SolarGard Checklist',
    show: false // Don't show until ready
  });

  // Show loading message
  mainWindow.loadURL('data:text/html,<html><body style="font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5;"><h2 style="color: #2563eb;">Starting SolarGard Checklist...</h2><p>Please wait while the application loads.</p><div style="margin-top: 20px;"><div style="width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #2563eb; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div></div><style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style></body></html>');
  mainWindow.show();

  // Start the Express server
  console.log('Starting Express server...');
  serverProcess = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'pipe'
  });

  // Handle server output
  serverProcess.stdout.on('data', (data) => {
    console.log(`Server: ${data.toString()}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server Error: ${data.toString()}`);
  });

  serverProcess.on('error', (error) => {
    console.error('Failed to start server:', error);
    mainWindow.loadURL('data:text/html,<html><body style="font-family: Arial; text-align: center; padding: 50px; color: red;"><h2>Error Starting Server</h2><p>Failed to start the application server. Please try again.</p><p>Error: ' + error.message + '</p></body></html>');
  });

  // Wait for server to be ready, then load the app
  checkServerReady()
    .then(() => {
      console.log('Loading application...');
      // Add a small delay to ensure server is fully ready
      setTimeout(() => {
        mainWindow.loadURL('http://localhost:3000');
      }, 500);
    })
    .catch((error) => {
      console.error('Server failed to start:', error);
      mainWindow.loadURL('data:text/html,<html><body style="font-family: Arial; text-align: center; padding: 50px; color: red;"><h2>Server Failed to Start</h2><p>The application server could not be started. Please check the console for errors.</p><p>Error: ' + error.message + '</p></body></html>');
    });

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Add error handling for web contents
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorCode, errorDescription, validatedURL);
    
    // Don't show error for data URLs (loading screen)
    if (validatedURL && validatedURL.startsWith('data:')) {
      return;
    }
    
    mainWindow.loadURL('data:text/html,<html><body style="font-family: Arial; text-align: center; padding: 50px; color: red;"><h2>Failed to Load Application</h2><p>Error Code: ' + errorCode + '</p><p>Error: ' + errorDescription + '</p><p>URL: ' + validatedURL + '</p><p>Please try restarting the application.</p></body></html>');
  });

  // Handle successful load
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // Kill the server process
  if (serverProcess) {
    console.log('Killing server process...');
    serverProcess.kill('SIGTERM');
    setTimeout(() => {
      if (serverProcess && !serverProcess.killed) {
        serverProcess.kill('SIGKILL');
      }
    }, 5000);
  }
  
  // On macOS, keep the app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create a window when the dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle app termination
app.on('before-quit', () => {
  if (serverProcess) {
    console.log('App quitting, killing server...');
    serverProcess.kill('SIGTERM');
  }
});

process.on('exit', () => {
  if (serverProcess) {
    serverProcess.kill('SIGKILL');
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
}); 