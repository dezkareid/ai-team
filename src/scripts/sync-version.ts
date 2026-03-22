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

interface VersionedJson {
  version?: string;
  metadata?: { version?: string };
  mcpServers?: Record<string, { version?: string }>;
}

function updateJsonVersion(json: unknown, version: string, strategy: SyncStrategy): boolean {
  if (typeof json !== 'object' || json === null) {
    return false;
  }

  const data = json as VersionedJson;

  switch (strategy) {
    case 'claude':
    case 'marketplace':
      if (data.metadata && data.metadata.version !== version) {
        data.metadata.version = version;
        return true;
      }
      break;

    case 'gemini':
      if (data.version !== version) {
        data.version = version;
        return true;
      }
      break;

    case 'agent-structure':
      return updateAgentStructureVersion(data, version);
  }

  return false;
}

function updateAgentStructureVersion(data: VersionedJson, version: string): boolean {
  let updated = false;
  if (data.mcpServers) {
    for (const key in data.mcpServers) {
      if (data.mcpServers[key].version !== version) {
        data.mcpServers[key].version = version;
        updated = true;
      }
    }
  }
  return updated;
}

export function syncVersion(
  packageJsonPath: string,
  targetJsonPath: string,
  strategy: SyncStrategy,
  fileSystem: FileSystem = fs,
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
  }
  catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Error syncing versions for ${targetJsonPath}: ${message}`);
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
      }
      else if (result.error) {
        if (!target.silent) {
          console.warn(`Warning: ${result.error} for ${path.basename(target.path)}`);
        }
      }
      else {
        console.log(`${path.basename(target.path)} version is already in sync.`);
      }
    }
  }
  catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  }
}

if (process.argv[1] === __filename || process.argv[1]?.endsWith('sync-version.js')) {
  run();
}
