import { describe, it, expect, vi } from 'vitest';
import { syncVersion } from './sync-version.js';

const packagePath = 'package.json';
const targetPath = 'target.json';

function makeFs(files: Record<string, string>) {
  return {
    existsSync: vi.fn((p: string) => p in files),
    readFileSync: vi.fn((p: string) => {
      if (p in files) return files[p];
      throw new Error(`File not found: ${p}`);
    }) as any,
    writeFileSync: vi.fn() as any,
  };
}

describe('syncVersion', () => {
  describe('gemini strategy', () => {
    it('should update root version field when versions differ', () => {
      // Given
      const mockFs = makeFs({
        [packagePath]: JSON.stringify({ version: '1.2.3' }),
        [targetPath]: JSON.stringify({ version: '1.0.0' }),
      });

      // When
      const result = syncVersion(packagePath, targetPath, 'gemini', mockFs);

      // Then
      expect(result.updated).toBe(true);
      expect(result.newVersion).toBe('1.2.3');
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        targetPath,
        expect.stringContaining('"version": "1.2.3"')
      );
    });

    it('should not update when versions already match', () => {
      // Given
      const mockFs = makeFs({
        [packagePath]: JSON.stringify({ version: '1.0.0' }),
        [targetPath]: JSON.stringify({ version: '1.0.0' }),
      });

      // When
      const result = syncVersion(packagePath, targetPath, 'gemini', mockFs);

      // Then
      expect(result.updated).toBe(false);
      expect(mockFs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('claude strategy', () => {
    it('should update metadata.version when versions differ', () => {
      // Given
      const mockFs = makeFs({
        [packagePath]: JSON.stringify({ version: '1.2.3' }),
        [targetPath]: JSON.stringify({ metadata: { version: '1.0.0' } }),
      });

      // When
      const result = syncVersion(packagePath, targetPath, 'claude', mockFs);

      // Then
      expect(result.updated).toBe(true);
      expect(result.newVersion).toBe('1.2.3');
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        targetPath,
        expect.stringContaining('"version": "1.2.3"')
      );
    });

    it('should not update when metadata.version already matches', () => {
      // Given
      const mockFs = makeFs({
        [packagePath]: JSON.stringify({ version: '1.0.0' }),
        [targetPath]: JSON.stringify({ metadata: { version: '1.0.0' } }),
      });

      // When
      const result = syncVersion(packagePath, targetPath, 'claude', mockFs);

      // Then
      expect(result.updated).toBe(false);
      expect(mockFs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('marketplace strategy', () => {
    it('should update only metadata.version from package version', () => {
      // Given
      const mockFs = makeFs({
        [packagePath]: JSON.stringify({ version: '2.0.0' }),
        [targetPath]: JSON.stringify({
          metadata: { version: '1.0.0' },
          plugins: [{ name: 'npm-tools', version: '0.0.1' }],
        }),
      });

      // When
      const result = syncVersion(packagePath, targetPath, 'marketplace', mockFs);

      // Then
      expect(result.updated).toBe(true);
      expect(result.newVersion).toBe('2.0.0');

      const written = JSON.parse(mockFs.writeFileSync.mock.calls[0][1]);
      expect(written.metadata.version).toBe('2.0.0');
      expect(written.plugins[0].version).toBe('0.0.1');
    });

    it('should not update when metadata.version already matches', () => {
      // Given
      const mockFs = makeFs({
        [packagePath]: JSON.stringify({ version: '2.0.0' }),
        [targetPath]: JSON.stringify({
          metadata: { version: '2.0.0' },
          plugins: [{ name: 'npm-tools', version: '0.0.1' }],
        }),
      });

      // When
      const result = syncVersion(packagePath, targetPath, 'marketplace', mockFs);

      // Then
      expect(result.updated).toBe(false);
      expect(mockFs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('agent-structure strategy', () => {
    it('should update only mcpServers versions from package version', () => {
      // Given
      const mockFs = makeFs({
        [packagePath]: JSON.stringify({ version: '2.0.0' }),
        [targetPath]: JSON.stringify({
          'claude-plugins': {
            'npm-tools': { version: '0.0.1' },
          },
          mcpServers: {
            'ai-team': { version: '1.0.0' },
          },
        }),
      });

      // When
      const result = syncVersion(packagePath, targetPath, 'agent-structure', mockFs);

      // Then
      expect(result.updated).toBe(true);
      expect(result.newVersion).toBe('2.0.0');

      const written = JSON.parse(mockFs.writeFileSync.mock.calls[0][1]);
      expect(written.mcpServers['ai-team'].version).toBe('2.0.0');
      // claude-plugins must NOT be touched by package version sync
      expect(written['claude-plugins']['npm-tools'].version).toBe('0.0.1');
    });

    it('should not update when mcpServers versions already match', () => {
      // Given
      const mockFs = makeFs({
        [packagePath]: JSON.stringify({ version: '2.0.0' }),
        [targetPath]: JSON.stringify({
          mcpServers: { 'ai-team': { version: '2.0.0' } },
        }),
      });

      // When
      const result = syncVersion(packagePath, targetPath, 'agent-structure', mockFs);

      // Then
      expect(result.updated).toBe(false);
      expect(mockFs.writeFileSync).not.toHaveBeenCalled();
    });

    it('should not touch claude-plugins even when they differ from package version', () => {
      // Given
      const mockFs = makeFs({
        [packagePath]: JSON.stringify({ version: '2.0.0' }),
        [targetPath]: JSON.stringify({
          'claude-plugins': {
            'npm-tools': { version: '0.0.1' },
          },
          mcpServers: { 'ai-team': { version: '2.0.0' } },
        }),
      });

      // When
      syncVersion(packagePath, targetPath, 'agent-structure', mockFs);

      // Then
      expect(mockFs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  it('should return error when target file does not exist', () => {
    // Given
    const mockFs = makeFs({ [packagePath]: JSON.stringify({ version: '1.0.0' }) });

    // When
    const result = syncVersion(packagePath, targetPath, 'gemini', mockFs);

    // Then
    expect(result.updated).toBe(false);
    expect(result.error).toBe('Target file does not exist');
  });

  it('should throw when files cannot be read', () => {
    // Given
    const mockFs = {
      existsSync: vi.fn(() => true),
      readFileSync: vi.fn(() => { throw new Error('Read error'); }) as any,
      writeFileSync: vi.fn() as any,
    };

    // When / Then
    expect(() => syncVersion(packagePath, targetPath, 'gemini', mockFs)).toThrow('Read error');
  });
});
