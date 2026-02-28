import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type SyncStrategy = 'gemini' | 'claude' | 'agent-structure' | 'marketplace';

export interface FileSystem {
  existsSync(path: string): boolean;
  readFileSync(path: string, encoding: BufferEncoding): string;
  writeFileSync(path: string, data: string): void;
}

function updateJsonVersion(json: any, version: string, strategy: SyncStrategy): boolean {
  let updated = false;

  if (strategy === 'claude') {
    if (json.metadata && json.metadata.version !== version) {
      json.metadata.version = version;
      updated = true;
    }
  } else if (strategy === 'gemini') {
    if (json.version !== version) {
      json.version = version;
      updated = true;
    }
  } else if (strategy === 'marketplace') {
    if (json.metadata && json.metadata.version !== version) {
      json.metadata.version = version;
      updated = true;
    }
  } else if (strategy === 'agent-structure') {
    // Only sync mcpServers from package version
    if (json.mcpServers) {
      for (const key in json.mcpServers) {
        if (json.mcpServers[key].version !== version) {
          json.mcpServers[key].version = version;
          updated = true;
        }
      }
    }
  }

  return updated;
}

export function syncVersion(
  packageJsonPath: string,
  targetJsonPath: string,
  strategy: SyncStrategy,
  fileSystem: FileSystem = fs
) {
  try {
    if (!fileSystem.existsSync(targetJsonPath)) {
      return { updated: false, error: 'Target file does not exist' };
    }
    const packageJson = JSON.parse(fileSystem.readFileSync(packageJsonPath, 'utf8'));
    const targetJson = JSON.parse(fileSystem.readFileSync(targetJsonPath, 'utf8'));

    const version = packageJson.version;
    const isUpdated = updateJsonVersion(targetJson, version, strategy);

    if (isUpdated) {
      fileSystem.writeFileSync(targetJsonPath, JSON.stringify(targetJson, null, 2) + '\n');
      return { updated: true, newVersion: version };
    }
    return { updated: false, version };
  } catch (error: any) {
    throw new Error(`Error syncing versions for ${targetJsonPath}: ${error.message}`);
  }
}

async function run() {
  const rootDir = path.join(__dirname, '..', '..');
  const packageJsonPath = path.join(rootDir, 'package.json');
  const agentStructurePath = path.join(rootDir, '.agent-structurerc');

  const targets: Array<{ path: string; strategy: SyncStrategy; silent?: boolean }> = [
    { path: path.join(rootDir, 'gemini-extension.json'), strategy: 'gemini' },
    { path: path.join(rootDir, '.claude-plugin/marketplace.json'), strategy: 'marketplace' },
    { path: agentStructurePath, strategy: 'agent-structure' },
  ];

  try {
    for (const target of targets) {
      const result = syncVersion(packageJsonPath, target.path, target.strategy);
      if (result.updated) {
        console.log(`Updated ${path.basename(target.path)} version to ${result.newVersion}`);
      } else if (result.error) {
        if (!target.silent) {
          console.warn(`Warning: ${result.error} for ${path.basename(target.path)}`);
        }
      } else {
        console.log(`${path.basename(target.path)} version is already in sync.`);
      }
    }
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
}

if (process.argv[1] === __filename || process.argv[1]?.endsWith('sync-version.js')) {
  run();
}
