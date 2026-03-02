import path from 'path';
import semver from 'semver';

export type BumpType = 'major' | 'minor' | 'patch';

export interface Changeset {
  name: string;
  bumpType: BumpType;
  filePath: string;
}

export interface ApplyResult {
  updated: string[];
  warnings: string[];
}

export interface FileSystem {
  existsSync(path: string): boolean;
  readdirSync(path: string): string[];
  readFileSync(path: string, encoding: BufferEncoding): string;
  writeFileSync(path: string, data: string): void;
  unlinkSync(path: string): void;
}

const BUMP_PRIORITY: Record<BumpType, number> = { major: 3, minor: 2, patch: 1 };

export function parseChangesetFile(content: string, filePath: string): Changeset[] {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return [];

  const frontmatter = match[1];
  const results: Changeset[] = [];
  const lineRegex = /^["']?([^"'\n:]+?)["']?\s*:\s*(major|minor|patch)\s*$/gm;
  let m: RegExpExecArray | null;

  while ((m = lineRegex.exec(frontmatter)) !== null) {
    results.push({ name: m[1].trim(), bumpType: m[2] as BumpType, filePath });
  }

  return results;
}

export function readChangesetFiles(changesetDir: string, fileSystem: FileSystem): Changeset[] {
  if (!fileSystem.existsSync(changesetDir)) return [];

  const changesets: Changeset[] = [];
  for (const file of fileSystem.readdirSync(changesetDir)) {
    if (!file.endsWith('.md') || file === 'README.md') continue;
    const filePath = path.join(changesetDir, file);
    changesets.push(...parseChangesetFile(fileSystem.readFileSync(filePath, 'utf8'), filePath));
  }

  return changesets;
}

export function resolveBumpType(bumpTypes: BumpType[]): BumpType {
  return bumpTypes.reduce((highest, current) =>
    BUMP_PRIORITY[current] > BUMP_PRIORITY[highest] ? current : highest
  );
}

export function computeNextVersion(currentVersion: string | undefined, bumpType: BumpType): string {
  const base = currentVersion && semver.valid(currentVersion) ? currentVersion : '0.0.0';
  return semver.inc(base, bumpType) as string;
}

export function groupByName(changesets: Changeset[]): Map<string, BumpType[]> {
  const grouped = new Map<string, BumpType[]>();
  for (const c of changesets) {
    const existing = grouped.get(c.name) ?? [];
    existing.push(c.bumpType);
    grouped.set(c.name, existing);
  }
  return grouped;
}

export function deleteChangesetFiles(changesets: Changeset[], fileSystem: FileSystem): void {
  const consumed = new Set(changesets.map(c => c.filePath));
  for (const filePath of consumed) {
    fileSystem.unlinkSync(filePath);
    console.log(`Deleted changeset: ${path.basename(filePath)}`);
  }
}
