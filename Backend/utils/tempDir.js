const fs = require("fs");
const path = require("path");
const os = require("os");

const setupTempDir = () => {
  try {
    // Use system temp directory as base
    const baseTempDir = process.env.TEMP_DIR || os.tmpdir();
    
    // Create app-specific subdirectory
    const appTempDir = path.join(baseTempDir, 'event-management-temp');
    
    // Create directory with proper permissions
    if (!fs.existsSync(appTempDir)) {
      fs.mkdirSync(appTempDir, { 
        recursive: true,
        mode: 0o755 // Proper permissions for temp directory
      });
    }

    // Verify write permissions
    fs.accessSync(appTempDir, fs.constants.W_OK);
    
    return appTempDir;
  } catch (error) {
    console.error('Failed to setup temp directory:', error);
    // Fallback to /tmp for Linux/Unix systems
    const fallbackDir = '/tmp/event-management-temp';
    fs.mkdirSync(fallbackDir, { recursive: true, mode: 0o755 });
    return fallbackDir;
  }
};

module.exports = setupTempDir;