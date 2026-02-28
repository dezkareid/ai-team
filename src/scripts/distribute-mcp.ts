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

async function run() {
  const rootDir = getRootDir();
  const agentRcPath = path.join(rootDir, '.agent-structurerc');
  
  if (!fs.existsSync(agentRcPath)) {
    console.error('.agent-structurerc not found');
    process.exit(1);
  }

  const agentRc = JSON.parse(fs.readFileSync(agentRcPath, 'utf8'));
  const mcpServers = agentRc.mcpServers || {};

  // 1. Distribute to gemini-extension.json
  const geminiPath = path.join(rootDir, 'gemini-extension.json');
  if (fs.existsSync(geminiPath)) {
    const gemini = JSON.parse(fs.readFileSync(geminiPath, 'utf8'));
    const resolvedMcpServers: Record<string, any> = {};

    for (const [name, config] of Object.entries(mcpServers) as [string, any][]) {
      const vars = { package: config.package, version: config.version };
      resolvedMcpServers[name] = {
        command: config.command,
        args: config.args.map((arg: string) => resolvePlaceholders(arg, vars)),
      };
    }

    gemini.mcpServers = resolvedMcpServers;
    fs.writeFileSync(geminiPath, JSON.stringify(gemini, null, 2) + '\n');
    console.log('Updated gemini-extension.json with MCP configurations');
  }

  // 2. Distribute to plugins/company-context/mcp.json
  for (const [name, config] of Object.entries(mcpServers) as [string, any][]) {
    if (config['claude-plugin'] === 'company-context') {
      const pluginMcpPath = path.join(rootDir, 'plugins/company-context/mcp.json');
      const vars = { package: config.package, version: config.version };
      const mcpConfig = {
        mcpServers: {
          [name]: {
            command: config.command,
            args: config.args.map((arg: string) => resolvePlaceholders(arg, vars)),
          }
        }
      };

      fs.mkdirSync(path.dirname(pluginMcpPath), { recursive: true });
      fs.writeFileSync(pluginMcpPath, JSON.stringify(mcpConfig, null, 2) + '\n');
      console.log(`Created/Updated ${pluginMcpPath} for company-context plugin`);
    }
  }
}

run().catch(console.error);
