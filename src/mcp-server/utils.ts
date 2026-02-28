import fs from 'fs';
import path from 'path';

/**
 * Checks if a file exists and is readable.
 * @param filePath Path to the file.
 * @returns True if the file exists and is a file.
 */
export function fileExists(filePath: string): boolean {
  try {
    const stats = fs.statSync(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}

/**
 * Reads the content of a file.
 * @param filePath Path to the file.
 * @returns The content of the file as a string.
 * @throws Error if the file does not exist or cannot be read.
 */
export function readFileContent(filePath: string): string {
  if (!fileExists(filePath)) {
    throw new Error(`File not found or not readable: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}
