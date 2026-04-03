import { z } from 'zod';

export const ClaudePluginSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
});

export const McpServerSchema = z.object({
  'claude-plugin': z.string().optional(),
  'version': z.string(),
  'package': z.string(),
  'command': z.string(),
  'args': z.array(z.string()),
  'contextFiles': z.record(z.string(), z.string()).optional(),
});

export const AgentStructureSchema = z.object({
  'claude-plugins': z.record(z.string(), ClaudePluginSchema),
  'mcpServers': z.record(z.string(), z.unknown()),
});

export type AgentStructure = z.infer<typeof AgentStructureSchema>;
export type McpServerConfig = z.infer<typeof McpServerSchema>;
