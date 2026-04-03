import { z } from 'zod';

export const ClaudePluginSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
});

export const McpServerSchema = z.object({
  'claude-plugin': z.string().optional(),
  'version': z.string().optional(),
  'package': z.string().optional(),
  'command': z.string(),
  'args': z.array(z.string()),
  'contextFiles': z.record(z.string(), z.string()).optional(),
});

export const MainMcpSchema = McpServerSchema.extend({
  version: z.string(),
  package: z.string(),
});

export const AgentStructureSchema = z.object({
  'claude-plugins': z.record(z.string(), ClaudePluginSchema),
  'mainMcp': MainMcpSchema,
  'mcpServers': z.record(z.string(), McpServerSchema).optional(),
});

export type AgentStructure = z.infer<typeof AgentStructureSchema>;
export type McpServerConfig = z.infer<typeof McpServerSchema>;
