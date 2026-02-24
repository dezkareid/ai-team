import { describe, it, expect, vi } from 'vitest';
import { syncVersion } from './sync-version';

describe('syncVersion', () => {
  const packagePath = 'package.json';
  const extensionPath = 'gemini-extension.json';

  const createMockFs = (packageContent, extensionContent) => ({
    readFileSync: vi.fn((path) => {
      if (path === packagePath) return packageContent;
      if (path === extensionPath) return extensionContent;
      return null;
    }),
    writeFileSync: vi.fn(),
  });

  it('should update gemini-extension.json when versions are different', () => {
    // Given
    const packageContent = JSON.stringify({ version: '1.2.3' });
    const extensionContent = JSON.stringify({ version: '1.0.0' });
    const mockFs = createMockFs(packageContent, extensionContent);

    // When
    const result = syncVersion(packagePath, extensionPath, mockFs);

    // Then
    expect(result.updated).toBe(true);
    expect(result.newVersion).toBe('1.2.3');
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      extensionPath,
      expect.stringContaining('"version": "1.2.3"')
    );
  });

  it('should not update gemini-extension.json when versions are the same', () => {
    // Given
    const packageContent = JSON.stringify({ version: '1.0.0' });
    const extensionContent = JSON.stringify({ version: '1.0.0' });
    const mockFs = createMockFs(packageContent, extensionContent);

    // When
    const result = syncVersion(packagePath, extensionPath, mockFs);

    // Then
    expect(result.updated).toBe(false);
    expect(mockFs.writeFileSync).not.toHaveBeenCalled();
  });

  it('should throw an error if files cannot be read', () => {
    // Given
    const mockFs = {
      readFileSync: vi.fn(() => {
        throw new Error('File not found');
      }),
    };

    // When / Then
    expect(() => syncVersion(packagePath, extensionPath, mockFs)).toThrow('Error syncing versions: File not found');
  });
});
