import path from 'path';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { getMcpServerConfig, getRootDir } from './config.js';
import { readFileContent } from './utils.js';

const SERVER_NAME = 'ai-team';

async function main() {
  const rootDir = getRootDir();
  const config = getMcpServerConfig(SERVER_NAME);
  const contextFiles = config.contextFiles || {};

  const server = new Server(
    {
      name: 'ai-team-mcp-server',
      version: config.version,
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tools based on contextFiles mapping
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: Object.keys(contextFiles).map((toolName) => ({
        name: toolName,
        description: `Retrieves content from ${contextFiles[toolName]}`,
        inputSchema: {
          type: 'object',
          properties: {},
        },
      })),
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const relativePath = contextFiles[toolName];

    if (!relativePath) {
      throw new Error(`Tool not found: ${toolName}`);
    }

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
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('AI Team MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
