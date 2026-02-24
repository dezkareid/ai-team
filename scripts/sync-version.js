const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const extensionJsonPath = path.join(__dirname, '..', 'gemini-extension.json');

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const extensionJson = JSON.parse(fs.readFileSync(extensionJsonPath, 'utf8'));

  if (extensionJson.version !== packageJson.version) {
    extensionJson.version = packageJson.version;
    fs.writeFileSync(extensionJsonPath, JSON.stringify(extensionJson, null, 2) + '\n');
    console.log(`Updated gemini-extension.json version to ${packageJson.version}`);
  } else {
    console.log('Versions are already in sync.');
  }
} catch (error) {
  console.error('Error syncing versions:', error.message);
  process.exit(1);
}
