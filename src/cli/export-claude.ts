import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import toml from '@iarna/toml';
import fsExtra from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AgentStructurePlugin {
  name: string;
  version?: string;
  description?: string;
}

export interface AgentStructureCommand {
  id: string;
  source: string;
  'claude-plugin': string;
}

export interface AgentStructure {
  'claude-plugins': Record<string, AgentStructurePlugin>;
  commands: AgentStructureCommand[];
}

interface TomlCommand {
  description?: string;
  prompt?: string;
}

export function stripEmbeddedFrontmatter(content: string): string {
  return content.replace(/^---\n[\s\S]*?\n---\n/, '').trimStart();
}

export function tomlToMarkdown(tomlContent: string, commandId: string): string {
  const parsed = toml.parse(tomlContent) as unknown as TomlCommand;
  const description = parsed.description ?? commandId;
  const rawPrompt = (parsed.prompt ?? '').replace(/\{\{args\}\}/g, '$ARGUMENTS').trim();
  const prompt = stripEmbeddedFrontmatter(rawPrompt);

  return `---\ndescription: "${description}"\n---\n\n${prompt}\n`;
}

export interface MarketplacePlugin {
  id: string;
  name: string;
  version: string;
  description: string;
}

export function buildMarketplacePlugins(plugins: Record<string, AgentStructurePlugin>): MarketplacePlugin[] {
  return Object.entries(plugins).map(([id, plugin]) => ({
    id,
    name: plugin.name,
    version: plugin.version ?? '0.0.1',
    description: plugin.description ?? '',
  }));
}

export function updateMarketplace(marketplacePath: string, plugins: Record<string, AgentStructurePlugin>): void {
  const marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));

  marketplace.plugins = buildMarketplacePlugins(plugins);

  fs.writeFileSync(marketplacePath, JSON.stringify(marketplace, null, 2) + '\n');
  console.log(`Updated ${path.basename(marketplacePath)} with ${Object.keys(plugins).length} plugin(s).`);
}

export function buildPluginJson(plugin: AgentStructurePlugin): { name: string; version: string; description: string } {
  return {
    name: plugin.name,
    version: plugin.version ?? '0.0.1',
    description: plugin.description ?? '',
  };
}

async function run() {
  const isDist = __dirname.includes(path.join('dist', 'cli'));
  const rootDir = isDist ? path.join(__dirname, '..', '..') : path.join(__dirname, '..', '..');

  const rcPath = path.join(rootDir, '.agent-structurerc');
  const marketplacePath = path.join(rootDir, '.claude-plugin', 'marketplace.json');
  const commandsDir = path.join(rootDir, 'commands');
  const pluginsDir = path.join(rootDir, 'plugins');

  if (!fs.existsSync(rcPath)) {
    console.error('.agent-structurerc not found.');
    process.exit(1);
  }

  const rc: AgentStructure = JSON.parse(fs.readFileSync(rcPath, 'utf8'));
  const claudePlugins = rc['claude-plugins'] ?? {};
  const commands = rc.commands ?? [];

  // Generate plugin directories and plugin.json files
  for (const [pluginId, plugin] of Object.entries(claudePlugins)) {
    const pluginDir = path.join(pluginsDir, pluginId);
    const claudePluginDir = path.join(pluginDir, '.claude-plugin');
    const commandsOutputDir = path.join(pluginDir, 'commands');

    fsExtra.ensureDirSync(claudePluginDir);
    fsExtra.ensureDirSync(commandsOutputDir);

    const pluginJson = buildPluginJson(plugin);
    const pluginJsonPath = path.join(claudePluginDir, 'plugin.json');
    fs.writeFileSync(pluginJsonPath, JSON.stringify(pluginJson, null, 2) + '\n');
    console.log(`Created ${path.relative(rootDir, pluginJsonPath)}`);

    // Process commands for this plugin
    const pluginCommands = commands.filter(cmd => cmd['claude-plugin'] === pluginId);
    for (const cmd of pluginCommands) {
      const sourcePath = path.join(commandsDir, cmd.source);

      if (!fs.existsSync(sourcePath)) {
        console.warn(`Warning: source file not found for command "${cmd.id}": ${sourcePath}`);
        continue;
      }

      const tomlContent = fs.readFileSync(sourcePath, 'utf8');
      const markdown = tomlToMarkdown(tomlContent, cmd.id);
      const outputPath = path.join(commandsOutputDir, `${cmd.id}.md`);

      fs.writeFileSync(outputPath, markdown);
      console.log(`Exported ${path.relative(rootDir, outputPath)}`);
    }
  }

  // Update marketplace.json
  if (fs.existsSync(marketplacePath)) {
    updateMarketplace(marketplacePath, claudePlugins);
  } else {
    console.warn(`Warning: ${marketplacePath} not found, skipping marketplace update.`);
  }
}

if (process.argv[1] === __filename || process.argv[1]?.endsWith('export-claude.js')) {
  run().catch(err => {
    console.error(err.message);
    process.exit(1);
  });
}
