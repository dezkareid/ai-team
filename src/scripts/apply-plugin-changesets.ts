import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  type FileSystem,
  type ApplyResult,
  readChangesetFiles,
  groupByName,
  resolveBumpType,
  computeNextVersion,
  deleteChangesetFiles,
} from './changesets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type { FileSystem, ApplyResult };

export function applyPluginChangesets(
  agentStructurePath: string,
  changesetDir: string,
  fileSystem: FileSystem = fs as unknown as FileSystem
): ApplyResult {
  if (!fileSystem.existsSync(agentStructurePath)) {
    throw new Error(`${agentStructurePath} not found`);
  }

  const changesets = readChangesetFiles(changesetDir, fileSystem);
  if (changesets.length === 0) {
    return { updated: [], warnings: [] };
  }

  const rc = JSON.parse(fileSystem.readFileSync(agentStructurePath, 'utf8'));
  const plugins: Record<string, { version?: string }> = rc['claude-plugins'] ?? {};

  const warnings: string[] = [];
  const updated: string[] = [];
  let rcDirty = false;

  for (const [name, bumps] of groupByName(changesets)) {
    const plugin = plugins[name];
    if (!plugin) {
      const msg = `Unknown plugin "${name}" in changeset — skipping`;
      console.warn(`Warning: ${msg}`);
      warnings.push(msg);
      continue;
    }

    const bumpType = resolveBumpType(bumps);
    const currentVersion = plugin.version;
    const nextVersion = computeNextVersion(currentVersion, bumpType);
    plugin.version = nextVersion;
    rcDirty = true;
    updated.push(name);
    console.log(`Bumped plugin "${name}": ${currentVersion ?? 'none'} -> ${nextVersion} (${bumpType})`);
  }

  if (rcDirty) {
    fileSystem.writeFileSync(agentStructurePath, JSON.stringify(rc, null, 2) + '\n');
    deleteChangesetFiles(changesets, fileSystem);
  }

  return { updated, warnings };
}

async function run() {
  const rootDir = path.join(__dirname, '..', '..');
  const agentStructurePath = path.join(rootDir, '.agent-structurerc');
  const changesetDir = path.join(rootDir, '.changeset');

  try {
    const result = applyPluginChangesets(agentStructurePath, changesetDir);
    if (result.updated.length === 0 && result.warnings.length === 0) {
      console.log('No pending plugin changesets.');
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  }
}

if (process.argv[1] === __filename || process.argv[1]?.endsWith('apply-plugin-changesets.js')) {
  run();
}
