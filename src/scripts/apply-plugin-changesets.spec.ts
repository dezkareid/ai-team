import { describe, it, expect, vi } from 'vitest';
import { applyPluginChangesets } from './apply-plugin-changesets.js';

const AGENT_STRUCTURE_PATH = '.agent-structurerc';
const CHANGESET_DIR = '.changeset';

interface MockFs {
  existsSync: (p: string) => boolean;
  readdirSync: (p: string) => string[];
  readFileSync: (p: string, encoding?: string) => string;
  writeFileSync: (p: string, data: string) => void;
  unlinkSync: (p: string) => void;
  _store: Record<string, string>;
}

function makeFs(files: Record<string, string>, dirs: Record<string, string[]> = {}): MockFs {
  const store = { ...files };
  return {
    existsSync: vi.fn((p: string) => p in store || p in dirs),
    readdirSync: vi.fn((p: string) => {
      if (p in dirs) return dirs[p];
      throw new Error(`Not a directory: ${p}`);
    }),
    readFileSync: vi.fn((p: string) => {
      if (p in store) return store[p];
      throw new Error(`File not found: ${p}`);
    }),
    writeFileSync: vi.fn((p: string, data: string) => { store[p] = data; }),
    unlinkSync: vi.fn((p: string) => { delete store[p]; }),
    _store: store,
  };
}

describe('applyPluginChangesets', () => {
  it('should bump plugin version in .agent-structurerc and delete changeset file', () => {
    const rc = {
      'claude-plugins': { 'npm-tools': { name: 'npm-tools', version: '0.0.1', description: 'Tools for npm' } },
    };
    const mockFs = makeFs(
      { [AGENT_STRUCTURE_PATH]: JSON.stringify(rc), '.changeset/change.md': `---\n"npm-tools": minor\n---\n` },
      { [CHANGESET_DIR]: ['change.md'] },
    );

    const result = applyPluginChangesets(AGENT_STRUCTURE_PATH, CHANGESET_DIR, mockFs);

    expect(result.updated).toContain('npm-tools');
    const written = JSON.parse(mockFs._store[AGENT_STRUCTURE_PATH]);
    expect(written['claude-plugins']['npm-tools'].version).toBe('0.1.0');
    expect(mockFs._store['.changeset/change.md']).toBeUndefined();
  });

  it('should start from 0.0.0 when plugin has no prior version', () => {
    const rc = { 'claude-plugins': { 'npm-tools': { name: 'npm-tools', description: 'Tools for npm' } } };
    const mockFs = makeFs(
      { [AGENT_STRUCTURE_PATH]: JSON.stringify(rc), '.changeset/change.md': `---\n"npm-tools": patch\n---\n` },
      { [CHANGESET_DIR]: ['change.md'] },
    );

    applyPluginChangesets(AGENT_STRUCTURE_PATH, CHANGESET_DIR, mockFs);

    const written = JSON.parse(mockFs._store[AGENT_STRUCTURE_PATH]);
    expect(written['claude-plugins']['npm-tools'].version).toBe('0.0.1');
  });

  it('should apply highest bump when multiple changesets target the same plugin', () => {
    const rc = { 'claude-plugins': { 'npm-tools': { name: 'npm-tools', version: '1.0.0' } } };
    const mockFs = makeFs(
      { [AGENT_STRUCTURE_PATH]: JSON.stringify(rc), '.changeset/a.md': `---\n"npm-tools": patch\n---\n`, '.changeset/b.md': `---\n"npm-tools": major\n---\n` },
      { [CHANGESET_DIR]: ['a.md', 'b.md'] },
    );

    applyPluginChangesets(AGENT_STRUCTURE_PATH, CHANGESET_DIR, mockFs);

    const written = JSON.parse(mockFs._store[AGENT_STRUCTURE_PATH]);
    expect(written['claude-plugins']['npm-tools'].version).toBe('2.0.0');
  });

  it('should bump multiple plugins from the same changeset file', () => {
    const rc = {
      'claude-plugins': {
        'npm-tools': { name: 'npm-tools', version: '1.0.0' },
        'design-system': { name: 'design-system', version: '0.0.1' },
      },
    };
    const mockFs = makeFs(
      { [AGENT_STRUCTURE_PATH]: JSON.stringify(rc), '.changeset/change.md': `---\n"npm-tools": patch\n"design-system": minor\n---\n` },
      { [CHANGESET_DIR]: ['change.md'] },
    );

    const result = applyPluginChangesets(AGENT_STRUCTURE_PATH, CHANGESET_DIR, mockFs);

    expect(result.updated).toContain('npm-tools');
    expect(result.updated).toContain('design-system');
    const written = JSON.parse(mockFs._store[AGENT_STRUCTURE_PATH]);
    expect(written['claude-plugins']['npm-tools'].version).toBe('1.0.1');
    expect(written['claude-plugins']['design-system'].version).toBe('0.1.0');
  });

  it('should warn about unknown plugin names and not write any files', () => {
    const rc = { 'claude-plugins': { 'npm-tools': { name: 'npm-tools', version: '1.0.0' } } };
    const mockFs = makeFs(
      { [AGENT_STRUCTURE_PATH]: JSON.stringify(rc), '.changeset/change.md': `---\n"nonexistent": minor\n---\n` },
      { [CHANGESET_DIR]: ['change.md'] },
    );

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = applyPluginChangesets(AGENT_STRUCTURE_PATH, CHANGESET_DIR, mockFs);
    consoleSpy.mockRestore();

    expect(result.updated).toHaveLength(0);
    expect(result.warnings).toHaveLength(1);
    expect(mockFs.writeFileSync).not.toHaveBeenCalled();
    expect(mockFs.unlinkSync).not.toHaveBeenCalled();
  });

  it('should return empty result when no pending changesets', () => {
    const rc = { 'claude-plugins': { 'npm-tools': { name: 'npm-tools', version: '1.0.0' } } };
    const mockFs = makeFs(
      { [AGENT_STRUCTURE_PATH]: JSON.stringify(rc) },
      { [CHANGESET_DIR]: [] },
    );

    const result = applyPluginChangesets(AGENT_STRUCTURE_PATH, CHANGESET_DIR, mockFs);

    expect(result.updated).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
    expect(mockFs.writeFileSync).not.toHaveBeenCalled();
  });

  it('should throw when .agent-structurerc does not exist', () => {
    expect(() => applyPluginChangesets(AGENT_STRUCTURE_PATH, CHANGESET_DIR, makeFs({}))).toThrow(
      '.agent-structurerc not found',
    );
  });
});
