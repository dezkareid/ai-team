import path from 'path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { getMcpServerConfig, getRootDir } from './config.js';
import { readFileContent, fileExists } from './utils.js';

const SERVER_NAME = 'ai-team';

async function main() {
  const rootDir = getRootDir();
  const config = getMcpServerConfig(SERVER_NAME);
  const contextFiles = config.contextFiles || {};

  const server = new McpServer({
    name: 'ai-team',
    version: config.version,
  });

  // Register search_product tool
  server.registerTool(
    'search_product',
    {
      description: 'Searches for a product in the Dezkareid Enterprise portfolio and returns its characteristics.',
      inputSchema: z.object({
        productName: z.string().describe('The name of the product to search for (e.g., "collecstory", "personal-website")'),
      }),
    },
    async ({ productName }) => {
      const normalizedName = productName.toLowerCase().replace(/\s+/g, '-');
      const productPath = path.join(rootDir, 'context', 'products', `${normalizedName}.md`);
      const defaultPath = path.join(rootDir, 'context', 'products', 'default.md');

      try {
        if (fileExists(productPath)) {
          const content = readFileContent(productPath);
          return {
            content: [
              {
                type: 'text',
                text: content,
              },
            ],
          };
        } else {
          const content = readFileContent(defaultPath);
          return {
            content: [
              {
                type: 'text',
                text: `The products was not found but here are the default enterprise product characteristics:\n\n${content}`,
              },
            ],
          };
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error reading product content: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

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
