import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

interface MCPServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

class MCPClient {
  private clients: Map<string, Client> = new Map();
  private transports: Map<string, StdioClientTransport> = new Map();
  private configs: Map<string, MCPServerConfig> = new Map();

  constructor(servers: Record<string, MCPServerConfig>) {
    for (const [name, config] of Object.entries(servers)) {
      this.configs.set(name, config);
    }
  }

  async connect(serverName: string): Promise<Client> {
    if (this.clients.has(serverName)) {
      return this.clients.get(serverName)!;
    }

    const config = this.configs.get(serverName);
    if (!config) {
      throw new Error(`No configuration found for MCP server: ${serverName}`);
    }

    // Create transport
    const transport = new StdioClientTransport({
      command: config.command,
      args: config.args,
      env: config.env
    });

    // Create and connect client
    const client = new Client(
      {
        name: `mcp-client-${serverName}`,
        version: '1.0.0'
      },
      {
        capabilities: {}
      }
    );

    await client.connect(transport);
    
    this.clients.set(serverName, client);
    this.transports.set(serverName, transport);

    return client;
  }

  async callTool<T = any>(
    serverName: string,
    toolName: string,
    params: Record<string, any> = {}
  ): Promise<T> {
    const client = await this.connect(serverName);
    
    try {
      const result = await client.callTool({
        name: toolName,
        arguments: params
      });

      // Extract content from MCP response
      if (result.content && Array.isArray(result.content)) {
        if (result.content.length === 1) {
          const item = result.content[0];
          if (item.type === 'text') {
            // Try to parse as JSON if possible
            try {
              return JSON.parse(item.text) as T;
            } catch {
              return item.text as T;
            }
          }
          if (item.type === 'image') {
            return item as T;
          }
          if (item.type === 'resource') {
            return item as T;
          }
        }
        return result.content as T;
      }

      return result as T;
    } catch (error) {
      throw new Error(`MCP tool call failed: ${serverName}.${toolName} - ${error}`);
    }
  }

  async disconnect(serverName?: string): Promise<void> {
    if (serverName) {
      const transport = this.transports.get(serverName);
      if (transport) {
        await transport.close();
        this.transports.delete(serverName);
        this.clients.delete(serverName);
      }
    } else {
      // Disconnect all
      for (const transport of this.transports.values()) {
        await transport.close();
      }
      this.transports.clear();
      this.clients.clear();
    }
  }

  async listTools(serverName: string): Promise<Array<{
    name: string;
    description?: string;
    inputSchema: any;
  }>> {
    const client = await this.connect(serverName);
    const result = await client.listTools();
    return result.tools;
  }
}

// Singleton instance
let globalClient: MCPClient | null = null;

export function initMCPClient(servers: Record<string, MCPServerConfig>): MCPClient {
  globalClient = new MCPClient(servers);
  return globalClient;
}

export function getMCPClient(): MCPClient {
  if (!globalClient) {
    throw new Error('MCP client not initialized. Call initMCPClient() first.');
  }
  return globalClient;
}

export async function callMCPTool<T = any>(
  fullToolName: string,
  params: Record<string, any> = {}
): Promise<T> {
  // Parse tool name format: "server-name__tool-name"
  const parts = fullToolName.split('__');
  if (parts.length !== 2) {
    throw new Error(
      `Invalid tool name format: ${fullToolName}. Expected "server-name__tool-name"`
    );
  }

  const [serverName, toolName] = parts;
  const client = getMCPClient();
  
  return client.callTool<T>(serverName, toolName, params);
}
