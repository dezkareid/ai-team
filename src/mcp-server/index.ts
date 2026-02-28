import path from 'path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { getMcpServerConfig, getRootDir } from './config.js';
import { readFileContent } from './utils.js';

const SERVER_NAME = 'ai-team';

async function main() {
  const rootDir = getRootDir();
  const config = getMcpServerConfig(SERVER_NAME);
  const contextFiles = config.contextFiles || {};

  const server = new McpServer({
    name: 'ai-team',
    version: config.version,
  });

  // Register tools based on contextFiles mapping
  for (const toolName of Object.keys(contextFiles)) {
    const relativePath = contextFiles[toolName];
    server.registerTool(
      toolName,
      {
        description: `Retrieves content from ${relativePath}`,
      },
      async () => {
        const fullPath = path.resolve(rootDir, relativePath);
        try {
          const content = readFileContent(fullPath);
          return {
            content: [
              {
                type: 'text',
                text: content,
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: 'text',
                text: `Error reading content: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('AI Team MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
