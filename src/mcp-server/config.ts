import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AgentStructureSchema, McpServerConfig, McpServerSchema } from './config-schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getRootDir(): string {
  return path.join(__dirname, '..', '..');
}

export function loadConfig() {
  const rootDir = getRootDir();
  const configPath = path.join(rootDir, '.agent-structurerc');

  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }

  const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const validatedConfig = AgentStructureSchema.parse(rawConfig);

  return validatedConfig;
}

export function getMcpServerConfig(serverName: string): McpServerConfig {
  const config = loadConfig();
  const serverConfig = config.mcpServers[serverName];

  if (!serverConfig) {
    throw new Error(`MCP server configuration for "${serverName}" not found in .agent-structurerc`);
  }

  return McpServerSchema.parse(serverConfig);
}
