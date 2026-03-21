import { describe, it, expect, vi } from 'vitest';
import {
  readSkillVersion,
  writeSkillVersion,
  applySkillChangesets,
} from './apply-skill-changesets.js';
import { parseChangesetFile, readChangesetFiles, resolveBumpType, computeNextVersion } from './changesets.js';

const AGENT_STRUCTURE_PATH = '.agent-structurerc';
const CHANGESET_DIR = '.changeset';

const SKILL_MD_WITH_VERSION = `---
name: design-tokens
description: "Design tokens skill"
metadata:
  version: "1.0.0"
---

## Overview
`;

const SKILL_MD_WITHOUT_VERSION = `---
name: design-tokens
description: "Design tokens skill"
---

## Overview
`;

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

describe('parseChangesetFile', () => {
  it('should parse a single entry with double-quoted name', () => {
    const result = parseChangesetFile(`---\n"design-tokens": minor\n---\n\nAdded palette tokens`, 'test.md');
    expect(result).toEqual([{ name: 'design-tokens', bumpType: 'minor', filePath: 'test.md' }]);
  });

  it('should parse a single entry with single-quoted name', () => {
    const result = parseChangesetFile(`---\n'design-tokens': patch\n---\n`, 'test.md');
    expect(result).toEqual([{ name: 'design-tokens', bumpType: 'patch', filePath: 'test.md' }]);
  });

  it('should parse a single entry with unquoted name', () => {
    const result = parseChangesetFile(`---\ndesign-tokens: major\n---\n`, 'test.md');
    expect(result).toEqual([{ name: 'design-tokens', bumpType: 'major', filePath: 'test.md' }]);
  });

  it('should parse multiple entries in one frontmatter', () => {
    const result = parseChangesetFile(`---\n"design-tokens": minor\n"other-skill": patch\n---\n`, 'test.md');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: 'design-tokens', bumpType: 'minor', filePath: 'test.md' });
    expect(result[1]).toEqual({ name: 'other-skill', bumpType: 'patch', filePath: 'test.md' });
  });

  it('should return empty array when frontmatter is missing', () => {
    expect(parseChangesetFile('No frontmatter here', 'test.md')).toEqual([]);
  });

  it('should skip lines with invalid bump types', () => {
    expect(parseChangesetFile(`---\n"design-tokens": breaking\n---\n`, 'test.md')).toEqual([]);
  });
});

describe('readChangesetFiles', () => {
  it('should read and parse all .md files except README.md', () => {
    const mockFs = makeFs(
      { '.changeset/abc.md': `---\n"design-tokens": minor\n---\n` },
      { '.changeset': ['abc.md', 'README.md', 'config.json'] }
    );
    const result = readChangesetFiles('.changeset', mockFs);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('design-tokens');
  });

  it('should skip config.json and non-.md files', () => {
    const mockFs = makeFs({}, { '.changeset': ['config.json', 'somefile.txt'] });
    expect(readChangesetFiles('.changeset', mockFs)).toEqual([]);
  });

  it('should return empty array when changeset directory does not exist', () => {
    expect(readChangesetFiles('.changeset', makeFs({}))).toEqual([]);
  });

  it('should aggregate changesets from multiple files', () => {
    const mockFs = makeFs(
      { '.changeset/a.md': `---\n"design-tokens": patch\n---\n`, '.changeset/b.md': `---\n"other-skill": major\n---\n` },
      { '.changeset': ['a.md', 'b.md'] }
    );
    expect(readChangesetFiles('.changeset', mockFs)).toHaveLength(2);
  });
});

describe('resolveBumpType', () => {
  it('should return major when major is present', () => {
    expect(resolveBumpType(['patch', 'major', 'minor'])).toBe('major');
  });

  it('should return minor when no major is present', () => {
    expect(resolveBumpType(['patch', 'minor'])).toBe('minor');
  });

  it('should return patch when only patch bumps are present', () => {
    expect(resolveBumpType(['patch', 'patch'])).toBe('patch');
  });

  it('should return the single bump type when only one is provided', () => {
    expect(resolveBumpType(['minor'])).toBe('minor');
  });
});

describe('computeNextVersion', () => {
  it('should bump patch version', () => {
    expect(computeNextVersion('1.0.0', 'patch')).toBe('1.0.1');
  });

  it('should bump minor version', () => {
    expect(computeNextVersion('1.2.3', 'minor')).toBe('1.3.0');
  });

  it('should bump major version', () => {
    expect(computeNextVersion('1.2.3', 'major')).toBe('2.0.0');
  });

  it('should default undefined version to 0.0.0 before bumping', () => {
    expect(computeNextVersion(undefined, 'patch')).toBe('0.0.1');
    expect(computeNextVersion(undefined, 'minor')).toBe('0.1.0');
    expect(computeNextVersion(undefined, 'major')).toBe('1.0.0');
  });

  it('should default invalid semver to 0.0.0 before bumping', () => {
    expect(computeNextVersion('not-a-version', 'patch')).toBe('0.0.1');
  });
});

describe('readSkillVersion', () => {
  it('should read metadata.version from SKILL.md frontmatter', () => {
    const mockFs = makeFs({ 'skills/design-tokens/SKILL.md': SKILL_MD_WITH_VERSION });
    expect(readSkillVersion('skills/design-tokens/SKILL.md', mockFs)).toBe('1.0.0');
  });

  it('should return undefined when SKILL.md has no metadata.version', () => {
    const mockFs = makeFs({ 'skills/design-tokens/SKILL.md': SKILL_MD_WITHOUT_VERSION });
    expect(readSkillVersion('skills/design-tokens/SKILL.md', mockFs)).toBeUndefined();
  });

  it('should return undefined when file does not exist', () => {
    expect(readSkillVersion('skills/design-tokens/SKILL.md', makeFs({}))).toBeUndefined();
  });
});

describe('writeSkillVersion', () => {
  it('should update metadata.version in SKILL.md frontmatter', () => {
    const mockFs = makeFs({ 'skills/design-tokens/SKILL.md': SKILL_MD_WITH_VERSION });
    writeSkillVersion('skills/design-tokens/SKILL.md', '1.1.0', mockFs);
    expect(readSkillVersion('skills/design-tokens/SKILL.md', mockFs)).toBe('1.1.0');
  });

  it('should preserve the rest of the file content after version update', () => {
    const mockFs = makeFs({ 'skills/design-tokens/SKILL.md': SKILL_MD_WITH_VERSION });
    writeSkillVersion('skills/design-tokens/SKILL.md', '2.0.0', mockFs);
    const written = mockFs._store['skills/design-tokens/SKILL.md'];
    expect(written).toContain('## Overview');
    expect(written).toContain('name: design-tokens');
  });
});

describe('applySkillChangesets', () => {
  it('should update metadata.version in SKILL.md and delete changeset file', () => {
    const rc = { skills: [{ name: 'design-tokens', source: 'skills/design-tokens/SKILL.md', 'claude-plugin': 'design-system' }] };
    const mockFs = makeFs(
      { [AGENT_STRUCTURE_PATH]: JSON.stringify(rc), 'skills/design-tokens/SKILL.md': SKILL_MD_WITH_VERSION, '.changeset/change.md': `---\n"design-tokens": minor\n---\n` },
      { [CHANGESET_DIR]: ['change.md'] }
    );

    const result = applySkillChangesets(AGENT_STRUCTURE_PATH, CHANGESET_DIR, mockFs, '.');

    expect(result.updated).toContain('design-tokens');
    expect(readSkillVersion('skills/design-tokens/SKILL.md', mockFs)).toBe('1.1.0');
    expect(mockFs._store['.changeset/change.md']).toBeUndefined();
  });

  it('should start from 0.0.0 when SKILL.md has no prior version', () => {
    const rc = { skills: [{ name: 'design-tokens', source: 'skills/design-tokens/SKILL.md' }] };
    const mockFs = makeFs(
      { [AGENT_STRUCTURE_PATH]: JSON.stringify(rc), 'skills/design-tokens/SKILL.md': SKILL_MD_WITHOUT_VERSION, '.changeset/change.md': `---\n"design-tokens": minor\n---\n` },
      { [CHANGESET_DIR]: ['change.md'] }
    );

    const result = applySkillChangesets(AGENT_STRUCTURE_PATH, CHANGESET_DIR, mockFs, '.');

    expect(result.updated).toContain('design-tokens');
    expect(readSkillVersion('skills/design-tokens/SKILL.md', mockFs)).toBe('0.1.0');
  });

  it('should apply highest bump when multiple changesets target the same skill', () => {
    const rc = { skills: [{ name: 'design-tokens', source: 'skills/design-tokens/SKILL.md' }] };
    const mockFs = makeFs(
      { [AGENT_STRUCTURE_PATH]: JSON.stringify(rc), 'skills/design-tokens/SKILL.md': SKILL_MD_WITH_VERSION, '.changeset/a.md': `---\n"design-tokens": patch\n---\n`, '.changeset/b.md': `---\n"design-tokens": major\n---\n` },
      { [CHANGESET_DIR]: ['a.md', 'b.md'] }
    );

    applySkillChangesets(AGENT_STRUCTURE_PATH, CHANGESET_DIR, mockFs, '.');

    expect(readSkillVersion('skills/design-tokens/SKILL.md', mockFs)).toBe('2.0.0');
  });

  it('should warn about unknown skill names and not write any files', () => {
    const rc = { skills: [{ name: 'design-tokens', source: 'skills/design-tokens/SKILL.md' }] };
    const mockFs = makeFs(
      { [AGENT_STRUCTURE_PATH]: JSON.stringify(rc), 'skills/design-tokens/SKILL.md': SKILL_MD_WITH_VERSION, '.changeset/change.md': `---\n"nonexistent": minor\n---\n` },
      { [CHANGESET_DIR]: ['change.md'] }
    );

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = applySkillChangesets(AGENT_STRUCTURE_PATH, CHANGESET_DIR, mockFs, '.');
    consoleSpy.mockRestore();

    expect(result.updated).toHaveLength(0);
    expect(result.warnings).toHaveLength(1);
    expect(mockFs.writeFileSync).not.toHaveBeenCalled();
    expect(mockFs.unlinkSync).not.toHaveBeenCalled();
  });

  it('should return empty result when no pending changesets', () => {
    const rc = { skills: [{ name: 'design-tokens', source: 'skills/design-tokens/SKILL.md' }] };
    const mockFs = makeFs(
      { [AGENT_STRUCTURE_PATH]: JSON.stringify(rc), 'skills/design-tokens/SKILL.md': SKILL_MD_WITH_VERSION },
      { [CHANGESET_DIR]: [] }
    );

    const result = applySkillChangesets(AGENT_STRUCTURE_PATH, CHANGESET_DIR, mockFs, '.');

    expect(result.updated).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
    expect(mockFs.writeFileSync).not.toHaveBeenCalled();
  });

  it('should throw when .agent-structurerc does not exist', () => {
    expect(() => applySkillChangesets(AGENT_STRUCTURE_PATH, CHANGESET_DIR, makeFs({}))).toThrow(
      '.agent-structurerc not found'
    );
  });
});
