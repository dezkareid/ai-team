import { describe, it, expect, vi } from 'vitest';
import { syncVersion } from './sync-version';

describe('syncVersion', () => {
  const packagePath = 'package.json';
  const targetPath = 'target.json';

  const createMockFs = (packageContent: string, targetContent: string) => ({
    readFileSync: vi.fn((path: string) => {
      if (path === packagePath) return packageContent;
      if (path === targetPath) return targetContent;
      return null;
    }) as any,
    writeFileSync: vi.fn() as any,
    existsSync: vi.fn((path: string) => {
      if (path === packagePath || path === targetPath) return true;
      return false;
    }) as any,
  });

  describe('gemini strategy', () => {
    it('should update root version field when versions are different', () => {
      // Given
      const packageContent = JSON.stringify({ version: '1.2.3' });
      const targetContent = JSON.stringify({ version: '1.0.0' });
      const mockFs = createMockFs(packageContent, targetContent);

      // When
      const result = syncVersion(packagePath, targetPath, 'gemini', mockFs as any);

      // Then
      expect(result.updated).toBe(true);
      expect(result.newVersion).toBe('1.2.3');
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        targetPath,
        expect.stringContaining('"version": "1.2.3"')
      );
    });

    it('should not update when versions are the same', () => {
      // Given
      const packageContent = JSON.stringify({ version: '1.0.0' });
      const targetContent = JSON.stringify({ version: '1.0.0' });
      const mockFs = createMockFs(packageContent, targetContent);

      // When
      const result = syncVersion(packagePath, targetPath, 'gemini', mockFs as any);

      // Then
      expect(result.updated).toBe(false);
      expect(mockFs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('claude strategy', () => {
    it('should update metadata.version field when versions are different', () => {
      // Given
      const packageContent = JSON.stringify({ version: '1.2.3' });
      const targetContent = JSON.stringify({ metadata: { version: '1.0.0' } });
      const mockFs = createMockFs(packageContent, targetContent);

      // When
      const result = syncVersion(packagePath, targetPath, 'claude', mockFs as any);

      // Then
      expect(result.updated).toBe(true);
      expect(result.newVersion).toBe('1.2.3');
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        targetPath,
        expect.stringContaining('"version": "1.2.3"')
      );
    });

    it('should not update when metadata.version matches', () => {
      // Given
      const packageContent = JSON.stringify({ version: '1.0.0' });
      const targetContent = JSON.stringify({ metadata: { version: '1.0.0' } });
      const mockFs = createMockFs(packageContent, targetContent);

      // When
      const result = syncVersion(packagePath, targetPath, 'claude', mockFs as any);

      // Then
      expect(result.updated).toBe(false);
      expect(mockFs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  it('should return error if target file does not exist', () => {
    // Given
    const mockFs = {
      existsSync: vi.fn(() => false),
    };

    // When
    const result = syncVersion(packagePath, targetPath, 'gemini', mockFs as any);

    // Then
    expect(result.updated).toBe(false);
    expect(result.error).toBe('Target file does not exist');
  });

  it('should throw an error if files cannot be read', () => {
    // Given
    const mockFs = {
      existsSync: vi.fn(() => true),
      readFileSync: vi.fn(() => {
        throw new Error('Read error');
      }),
    };

    // When / Then
    expect(() => syncVersion(packagePath, targetPath, 'gemini', mockFs as any)).toThrow('Read error');
  });
});
