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

export function readSkillVersion(skillFilePath: string, fileSystem: FileSystem): string | undefined {
  if (!fileSystem.existsSync(skillFilePath)) return undefined;
  const content = fileSystem.readFileSync(skillFilePath, 'utf8');
  const match = content.match(/^---\n[\s\S]*?metadata:\s*\n(?:[ \t]+\w[^\n]*\n)*?[ \t]+version:\s*["']?([^\s"'\n]+)["']?/m);
  return match?.[1];
}

export function writeSkillVersion(skillFilePath: string, nextVersion: string, fileSystem: FileSystem): void {
  const content = fileSystem.readFileSync(skillFilePath, 'utf8');

  // Try to update an existing metadata.version line
  const versionLineRegex = /(^---\n[\s\S]*?metadata:\s*\n(?:[ \t]+\w[^\n]*\n)*?[ \t]+version:\s*)["']?[^\s"'\n]+["']?/m;
  if (versionLineRegex.test(content)) {
    fileSystem.writeFileSync(skillFilePath, content.replace(versionLineRegex, `$1"${nextVersion}"`));
    return;
  }

  // No version line — inject it under an existing metadata: block
  const metadataBlockRegex = /(^---\n[\s\S]*?)(metadata:\s*\n)/m;
  if (metadataBlockRegex.test(content)) {
    fileSystem.writeFileSync(skillFilePath, content.replace(metadataBlockRegex, `$1$2  version: "${nextVersion}"\n`));
    return;
  }

  // No metadata block at all — inject metadata + version before the closing ---
  fileSystem.writeFileSync(skillFilePath, content.replace(/^(---\n[\s\S]*?)(---)/m, `$1metadata:\n  version: "${nextVersion}"\n$2`));
}

export function applySkillChangesets(
  agentStructurePath: string,
  changesetDir: string,
  fileSystem: FileSystem = fs as unknown as FileSystem,
  rootDir?: string,
): ApplyResult {
  if (!fileSystem.existsSync(agentStructurePath)) {
    throw new Error(`${agentStructurePath} not found`);
  }

  const changesets = readChangesetFiles(changesetDir, fileSystem);
  if (changesets.length === 0) {
    return { updated: [], warnings: [] };
  }

  const rc = JSON.parse(fileSystem.readFileSync(agentStructurePath, 'utf8'));
  const skills: Array<{ name: string; source: string }> = rc.skills ?? [];
  const resolvedRootDir = rootDir ?? path.dirname(agentStructurePath);

  const warnings: string[] = [];
  const updated: string[] = [];

  for (const [name, bumps] of groupByName(changesets)) {
    const skill = skills.find(s => s.name === name);
    if (!skill) {
      const msg = `Unknown skill "${name}" in changeset — skipping`;
      console.warn(`Warning: ${msg}`);
      warnings.push(msg);
      continue;
    }

    const bumpType = resolveBumpType(bumps);
    const skillFilePath = path.join(resolvedRootDir, skill.source);
    const currentVersion = readSkillVersion(skillFilePath, fileSystem);
    const nextVersion = computeNextVersion(currentVersion, bumpType);
    writeSkillVersion(skillFilePath, nextVersion, fileSystem);
    updated.push(name);
    console.log(`Bumped skill "${name}": ${currentVersion ?? 'none'} -> ${nextVersion} (${bumpType})`);
  }

  if (updated.length > 0) {
    deleteChangesetFiles(changesets, fileSystem);
  }

  return { updated, warnings };
}

async function run() {
  const rootDir = path.join(__dirname, '..', '..');
  const agentStructurePath = path.join(rootDir, '.agent-structurerc');
  const changesetDir = path.join(rootDir, '.changeset');

  try {
    const result = applySkillChangesets(agentStructurePath, changesetDir, fs as unknown as FileSystem, rootDir);
    if (result.updated.length === 0 && result.warnings.length === 0) {
      console.log('No pending skill changesets.');
    }
  }
  catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  }
}

if (process.argv[1] === __filename || process.argv[1]?.endsWith('apply-skill-changesets.js')) {
  run();
}
