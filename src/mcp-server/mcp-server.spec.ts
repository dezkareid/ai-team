import { describe, it, expect, vi } from 'vitest';
import { fileExists, readFileContent } from './utils.js';
import { loadConfig, getRootDir } from './config.js';
import fs from 'fs';
import path from 'path';

vi.mock('fs');

describe('MCP Server Utils', () => {
  describe('fileExists', () => {
    it('should return true if file exists', () => {
      vi.mocked(fs.statSync).mockReturnValue({ isFile: () => true } as any);
      expect(fileExists('test.txt')).toBe(true);
    });

    it('should return false if file does not exist', () => {
      vi.mocked(fs.statSync).mockImplementation(() => { throw new Error(); });
      expect(fileExists('test.txt')).toBe(false);
    });
  });

  describe('readFileContent', () => {
    it('should read file content if it exists', () => {
      vi.mocked(fs.statSync).mockReturnValue({ isFile: () => true } as any);
      vi.mocked(fs.readFileSync).mockReturnValue('test content');
      expect(readFileContent('test.txt')).toBe('test content');
    });

    it('should throw error if file does not exist', () => {
      vi.mocked(fs.statSync).mockImplementation(() => { throw new Error(); });
      expect(() => readFileContent('test.txt')).toThrow();
    });
  });
});

describe('MCP Server Config', () => {
  describe('loadConfig', () => {
    it('should load and validate config', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
        'claude-plugins': {},
        mcpServers: {
          'ai-team': {
            version: '1.0.0',
            package: 'test',
            command: 'node',
            args: []
          }
        }
      }));

      const config = loadConfig();
      expect(config.mcpServers['ai-team'].version).toBe('1.0.0');
    });

    it('should throw if config is missing', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      expect(() => loadConfig()).toThrow();
    });
  });
});
