import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getRootDir(): string {
  return path.join(__dirname, '..', '..');
}

function resolvePlaceholders(str: string, vars: Record<string, string>): string {
  return str.replace(/\${(.*?)}/g, (_, name) => vars[name] || _);
}

interface McpConfig {
  'version'?: string;
  'package'?: string;
  'command': string;
  'args': string[];
  'claude-plugin'?: string;
}

interface ResolvedMcpServer {
  command: string;
  args: string[];
}

interface ClaudePluginMcpConfig {
  mcpServers: Record<string, ResolvedMcpServer>;
}

function distributeToGemini(rootDir: string, mcpServers: Record<string, McpConfig>) {
  const geminiPath = path.join(rootDir, 'gemini-extension.json');
  if (!fs.existsSync(geminiPath)) return;

  const gemini = JSON.parse(fs.readFileSync(geminiPath, 'utf8'));
  const resolvedMcpServers: Record<string, ResolvedMcpServer> = {};

  for (const [name, config] of Object.entries(mcpServers)) {
    const vars: Record<string, string> = {};
    if (config.package) vars.package = config.package;
    if (config.version) vars.version = config.version;

    resolvedMcpServers[name] = {
      command: config.command,
      args: config.args.map((arg: string) => resolvePlaceholders(arg, vars)),
    };
  }

  gemini.mcpServers = resolvedMcpServers;
  fs.writeFileSync(geminiPath, JSON.stringify(gemini, null, 2) + '\n');
  console.log('Updated gemini-extension.json with MCP configurations');
}

function distributeToClaude(rootDir: string, mcpServers: Record<string, McpConfig>) {
  const pluginConfigs: Record<string, ClaudePluginMcpConfig> = {};

  for (const [name, config] of Object.entries(mcpServers)) {
    const pluginName = config['claude-plugin'];
    if (!pluginName) continue;

    if (!pluginConfigs[pluginName]) {
      pluginConfigs[pluginName] = { mcpServers: {} };
    }

    const vars: Record<string, string> = {};
    if (config.package) vars.package = config.package;
    if (config.version) vars.version = config.version;

    pluginConfigs[pluginName].mcpServers[name] = {
      command: config.command,
      args: config.args.map((arg: string) => resolvePlaceholders(arg, vars)),
    };
  }

  for (const [pluginName, mcpConfig] of Object.entries(pluginConfigs)) {
    const pluginMcpPath = path.join(rootDir, 'plugins', pluginName, '.mcp.json');
    fs.mkdirSync(path.dirname(pluginMcpPath), { recursive: true });
    fs.writeFileSync(pluginMcpPath, JSON.stringify(mcpConfig, null, 2) + '\n');
    console.log(`Created/Updated ${pluginMcpPath} for ${pluginName} plugin`);
  }
}

async function run() {
  const rootDir = getRootDir();
  const agentRcPath = path.join(rootDir, '.agent-structurerc');

  if (!fs.existsSync(agentRcPath)) {
    console.error('.agent-structurerc not found');
    process.exit(1);
  }

  const agentRc = JSON.parse(fs.readFileSync(agentRcPath, 'utf8'));
  const mcpServers: Record<string, McpConfig> = agentRc.mcpServers || {};

  distributeToGemini(rootDir, mcpServers);
  distributeToClaude(rootDir, mcpServers);
}

run().catch(console.error);
