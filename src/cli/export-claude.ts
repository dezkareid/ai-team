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
  name: string;
  source: string;
  'claude-plugin': string;
}

export interface AgentStructureSkill {
  name: string;
  source: string;
  'claude-plugin': string;
}

export interface AgentStructure {
  'claude-plugins': Record<string, AgentStructurePlugin>;
  commands: AgentStructureCommand[];
  skills?: AgentStructureSkill[];
}

interface TomlCommand {
  description?: string;
  prompt?: string;
}

export function stripEmbeddedFrontmatter(content: string): string {
  return content.replace(/^---\n[\s\S]*?\n---\n/, '').trimStart();
}

export function tomlToMarkdown(tomlContent: string, commandName: string): string {
  const parsed = toml.parse(tomlContent) as unknown as TomlCommand;
  const description = parsed.description ?? commandName;
  const rawPrompt = (parsed.prompt ?? '').replace(/\{\{args\}\}/g, '$ARGUMENTS').trim();
  const prompt = stripEmbeddedFrontmatter(rawPrompt);

  return `---\ndescription: "${description}"\n---\n\n${prompt}\n`;
}

export interface MarketplacePlugin {
  name: string;
  version: string;
  description: string;
  source: string;
}

export function buildMarketplacePlugins(
  plugins: Record<string, AgentStructurePlugin>
): MarketplacePlugin[] {
  return Object.entries(plugins).map(([id, plugin]) => ({
    name: plugin.name,
    version: plugin.version ?? '0.0.1',
    description: plugin.description ?? '',
    source: `./plugins/${id}`,
  }));
}

export function updateMarketplace(marketplacePath: string, pluginsDir: string, plugins: Record<string, AgentStructurePlugin>): void {
  const marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));

  const resolvedPlugins: Record<string, AgentStructurePlugin> = {};
  for (const [id, plugin] of Object.entries(plugins)) {
    const pluginJsonPath = path.join(pluginsDir, id, '.claude-plugin', 'plugin.json');
    const pluginVersion = fs.existsSync(pluginJsonPath)
      ? JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8')).version
      : plugin.version;
    resolvedPlugins[id] = { ...plugin, version: pluginVersion };
  }

  marketplace.plugins = buildMarketplacePlugins(resolvedPlugins);

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

function cleanObsoletePlugins(pluginsDir: string, claudePlugins: Record<string, AgentStructurePlugin>, rootDir: string) {
  if (fs.existsSync(pluginsDir)) {
    const existingPluginDirs = fs.readdirSync(pluginsDir);
    for (const dirName of existingPluginDirs) {
      if (!claudePlugins[dirName]) {
        const fullPath = path.join(pluginsDir, dirName);
        if (fs.statSync(fullPath).isDirectory()) {
          fsExtra.removeSync(fullPath);
          console.log(`Removed obsolete plugin directory: ${path.relative(rootDir, fullPath)}`);
        }
      }
    }
  }
}

function processPluginCommands(pluginId: string, pluginDir: string, commands: AgentStructureCommand[], commandsDir: string, rootDir: string) {
  const commandsOutputDir = path.join(pluginDir, 'commands');
  const pluginCommands = commands.filter(cmd => cmd['claude-plugin'] === pluginId);
  
  if (pluginCommands.length > 0) {
    fsExtra.ensureDirSync(commandsOutputDir);
    for (const cmd of pluginCommands) {
      const sourcePath = path.join(commandsDir, cmd.source);

      if (!fs.existsSync(sourcePath)) {
        console.warn(`Warning: source file not found for command "${cmd.name}": ${sourcePath}`);
        continue;
      }

      const tomlContent = fs.readFileSync(sourcePath, 'utf8');
      const markdown = tomlToMarkdown(tomlContent, cmd.name);
      const outputPath = path.join(commandsOutputDir, `${cmd.name}.md`);

      fs.writeFileSync(outputPath, markdown);
      console.log(`Exported ${path.relative(rootDir, outputPath)}`);
    }
  } else if (fs.existsSync(commandsOutputDir)) {
    fsExtra.removeSync(commandsOutputDir);
  }
}

function processPluginSkills(pluginId: string, pluginDir: string, skills: AgentStructureSkill[], rootDir: string) {
  const skillsOutputDir = path.join(pluginDir, 'skills');
  const pluginSkills = skills.filter(skill => skill['claude-plugin'] === pluginId);
  
  if (pluginSkills.length > 0) {
    fsExtra.ensureDirSync(skillsOutputDir);
    for (const skill of pluginSkills) {
      const sourceSkillFile = path.join(rootDir, skill.source);
      const sourceSkillDir = path.dirname(sourceSkillFile);
      const skillOutputDir = path.join(skillsOutputDir, skill.name);
      const outputSkillFile = path.join(skillOutputDir, 'SKILL.md');

      if (!fs.existsSync(sourceSkillFile)) {
        console.warn(`Warning: source file not found for skill "${skill.name}": ${sourceSkillFile}`);
        continue;
      }

      fsExtra.ensureDirSync(skillOutputDir);

      if (fs.existsSync(outputSkillFile)) {
        fs.unlinkSync(outputSkillFile);
      }
      const relativeSkillSource = path.relative(path.dirname(outputSkillFile), sourceSkillFile);
      fs.symlinkSync(relativeSkillSource, outputSkillFile);
      console.log(`Symlinked skill ${path.relative(rootDir, outputSkillFile)} -> ${path.relative(rootDir, sourceSkillFile)}`);

      if (pluginId === 'design-system' && skill.name === 'design-tokens') {
        const tokensPkgSource = path.join(rootDir, 'node_modules', '@dezkareid', 'design-tokens', 'dist', 'catalogs', 'all-tokens-css.md');
        const sourceRefsDir = path.join(sourceSkillDir, 'references');
        const sourceTokensFile = path.join(sourceRefsDir, 'all-tokens-css.md');

        if (fs.existsSync(tokensPkgSource)) {
          fsExtra.ensureDirSync(sourceRefsDir);
          fs.copyFileSync(tokensPkgSource, sourceTokensFile);
          console.log(`Updated source tokens at ${path.relative(rootDir, sourceTokensFile)}`);
        }
      }

      const sourceRefsDir = path.join(sourceSkillDir, 'references');
      const outputRefsDir = path.join(skillOutputDir, 'references');
      if (fs.existsSync(sourceRefsDir)) {
        fsExtra.ensureDirSync(outputRefsDir);
        const refFiles = fs.readdirSync(sourceRefsDir);
        for (const refFile of refFiles) {
          const sourceRefFile = path.join(sourceRefsDir, refFile);
          const outputRefFile = path.join(outputRefsDir, refFile);
          
          if (fs.existsSync(outputRefFile)) {
            fs.unlinkSync(outputRefFile);
          }
          const relativeRefSource = path.relative(path.dirname(outputRefFile), sourceRefFile);
          fs.symlinkSync(relativeRefSource, outputRefFile);
          console.log(`Symlinked reference ${path.relative(rootDir, outputRefFile)} -> ${path.relative(rootDir, sourceRefFile)}`);
        }
      }
    }
  } else if (fs.existsSync(skillsOutputDir)) {
    fsExtra.removeSync(skillsOutputDir);
  }
}

async function run() {
  const rootDir = path.join(__dirname, '..', '..');
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
  const skills = rc.skills ?? [];

  cleanObsoletePlugins(pluginsDir, claudePlugins, rootDir);

  for (const [pluginId, plugin] of Object.entries(claudePlugins)) {
    const pluginDir = path.join(pluginsDir, pluginId);
    const claudePluginDir = path.join(pluginDir, '.claude-plugin');
    fsExtra.ensureDirSync(claudePluginDir);

    const pluginJson = buildPluginJson(plugin);
    const pluginJsonPath = path.join(claudePluginDir, 'plugin.json');
    fs.writeFileSync(pluginJsonPath, JSON.stringify(pluginJson, null, 2) + '\n');
    console.log(`Created ${path.relative(rootDir, pluginJsonPath)}`);

    processPluginCommands(pluginId, pluginDir, commands, commandsDir, rootDir);
    processPluginSkills(pluginId, pluginDir, skills, rootDir);
  }

  if (fs.existsSync(marketplacePath)) {
    updateMarketplace(marketplacePath, pluginsDir, claudePlugins);
  } else {
    console.warn(`Warning: ${marketplacePath} not found, skipping marketplace update.`);
  }
}

if (process.argv[1] === __filename || process.argv[1]?.endsWith('export-claude.js')) {
  run().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error(message);
    process.exit(1);
  });
}
