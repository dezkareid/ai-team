const path = require('path');

function syncVersion(packageJsonPath, extensionJsonPath, fs = require('fs')) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const extensionJson = JSON.parse(fs.readFileSync(extensionJsonPath, 'utf8'));

    if (extensionJson.version !== packageJson.version) {
      const oldVersion = extensionJson.version;
      extensionJson.version = packageJson.version;
      fs.writeFileSync(extensionJsonPath, JSON.stringify(extensionJson, null, 2) + '\n');
      return { updated: true, oldVersion, newVersion: packageJson.version };
    }
    return { updated: false, version: packageJson.version };
  } catch (error) {
    throw new Error(`Error syncing versions: ${error.message}`);
  }
}

if (require.main === module) {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const extensionJsonPath = path.join(__dirname, '..', 'gemini-extension.json');

  try {
    const result = syncVersion(packageJsonPath, extensionJsonPath);
    if (result.updated) {
      console.log(`Updated gemini-extension.json version to ${result.newVersion}`);
    } else {
      console.log('Versions are already in sync.');
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { syncVersion };
