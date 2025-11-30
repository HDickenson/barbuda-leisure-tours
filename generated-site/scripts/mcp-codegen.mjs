#!/usr/bin/env node

/**
 * MCP Code Generator
 * 
 * Introspects MCP servers and generates TypeScript wrapper files.
 * Implements the code execution pattern from:
 * https://www.anthropic.com/engineering/code-execution-with-mcp
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '..', 'servers');

async function connectToMCPServer(command, args, env = {}) {
  const transport = new StdioClientTransport({
    command,
    args,
    env: { ...process.env, ...env }
  });

  const client = new Client(
    {
      name: 'mcp-codegen',
      version: '1.0.0'
    },
    {
      capabilities: {}
    }
  );

  await client.connect(transport);
  return { client, transport };
}

function toPascalCase(str) {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toUpperCase());
}

function toCamelCase(str) {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toLowerCase());
}

function sanitizeServerName(name) {
  return name.replace(/[^a-zA-Z0-9-_]/g, '-');
}

function generateTypeFromSchema(schema, depth = 0) {
  if (!schema) return 'any';
  
  if (schema.type === 'object') {
    if (!schema.properties) return 'Record<string, any>';
    
    const props = Object.entries(schema.properties).map(([key, prop]) => {
      const required = schema.required?.includes(key) ?? false;
      const optional = required ? '' : '?';
      const type = generateTypeFromSchema(prop, depth + 1);
      const description = prop.description ? `\n  /** ${prop.description} */` : '';
      return `${description}\n  ${key}${optional}: ${type};`;
    });
    
    return `{\n${props.join('\n')}\n}`;
  }
  
  if (schema.type === 'array') {
    const itemType = generateTypeFromSchema(schema.items, depth + 1);
    return `Array<${itemType}>`;
  }
  
  if (schema.type === 'string') {
    if (schema.enum) {
      return schema.enum.map(v => `'${v}'`).join(' | ');
    }
    return 'string';
  }
  
  if (schema.type === 'number' || schema.type === 'integer') {
    return 'number';
  }
  
  if (schema.type === 'boolean') {
    return 'boolean';
  }
  
  if (schema.type === 'null') {
    return 'null';
  }
  
  if (schema.anyOf || schema.oneOf) {
    const variants = (schema.anyOf || schema.oneOf).map(s => generateTypeFromSchema(s, depth + 1));
    return variants.join(' | ');
  }
  
  return 'any';
}

function generateToolWrapper(serverName, tool) {
  const functionName = toCamelCase(tool.name);
  const inputTypeName = `${toPascalCase(tool.name)}Input`;
  const responseTypeName = `${toPascalCase(tool.name)}Response`;
  
  const inputType = tool.inputSchema 
    ? generateTypeFromSchema(tool.inputSchema)
    : 'Record<string, any>';
  
  const description = tool.description 
    ? `/**\n * ${tool.description}\n */`
    : `/** ${tool.name} */`;
  
  return `// ./servers/${serverName}/${tool.name}.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type ${inputTypeName} = ${inputType};

export interface ${responseTypeName} {
  [key: string]: any;
}

${description}
export async function ${functionName}(input: ${inputTypeName}): Promise<${responseTypeName}> {
  return callMCPTool<${responseTypeName}>('${serverName}__${tool.name}', input);
}
`;
}

function generateIndexFile(serverName, tools) {
  const exports = tools.map(tool => {
    const functionName = toCamelCase(tool.name);
    return `export { ${functionName} } from './${tool.name}.js';`;
  }).join('\n');
  
  return `// ./servers/${serverName}/index.ts
// Auto-generated MCP server wrapper

${exports}
`;
}

function generateReadme(serverName, tools) {
  const toolList = tools.map(tool => {
    const functionName = toCamelCase(tool.name);
    const description = tool.description || 'No description';
    return `- \`${functionName}\` - ${description}`;
  }).join('\n');
  
  return `# ${serverName} MCP Server

Auto-generated TypeScript wrapper for the ${serverName} MCP server.

## Available Tools

${toolList}

## Usage

\`\`\`typescript
import * as ${toCamelCase(serverName)} from './servers/${serverName}';

// Example
const result = await ${toCamelCase(serverName)}.${toCamelCase(tools[0]?.name || 'tool')}({
  // params
});
\`\`\`
`;
}

async function generateWrappers(serverName, config) {
  console.log(`\n🔍 Connecting to ${serverName}...`);
  
  const { client, transport } = await connectToMCPServer(
    config.command,
    config.args,
    config.env
  );
  
  try {
    console.log(`📋 Listing tools for ${serverName}...`);
    const result = await client.listTools();
    const tools = result.tools;
    
    console.log(`✅ Found ${tools.length} tools`);
    
    const sanitized = sanitizeServerName(serverName);
    const serverDir = path.join(OUTPUT_DIR, sanitized);
    
    // Create server directory
    await fs.mkdir(serverDir, { recursive: true });
    
    // Generate individual tool wrappers
    for (const tool of tools) {
      const wrapperCode = generateToolWrapper(sanitized, tool);
      const filename = path.join(serverDir, `${tool.name}.ts`);
      await fs.writeFile(filename, wrapperCode, 'utf-8');
      console.log(`  ✓ Generated ${sanitized}/${tool.name}.ts`);
    }
    
    // Generate index file
    const indexCode = generateIndexFile(sanitized, tools);
    await fs.writeFile(path.join(serverDir, 'index.ts'), indexCode, 'utf-8');
    console.log(`  ✓ Generated ${sanitized}/index.ts`);
    
    // Generate README
    const readmeCode = generateReadme(sanitized, tools);
    await fs.writeFile(path.join(serverDir, 'README.md'), readmeCode, 'utf-8');
    console.log(`  ✓ Generated ${sanitized}/README.md`);
    
    console.log(`\n✨ Successfully generated wrappers for ${serverName}`);
    
  } finally {
    await transport.close();
  }
}

async function main() {
  const configPath = path.join(__dirname, '..', '..', '.mcp.json');
  
  console.log('🚀 MCP Code Generator');
  console.log('━'.repeat(50));
  
  try {
    const configData = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configData);
    
    if (!config.mcpServers) {
      console.error('❌ No mcpServers found in .mcp.json');
      process.exit(1);
    }
    
    // Create output directory
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    // Generate wrappers for each server
    for (const [name, serverConfig] of Object.entries(config.mcpServers)) {
      // Skip builtin servers
      if (serverConfig.type === 'builtin') {
        console.log(`⏭️  Skipping builtin server: ${name}`);
        continue;
      }
      
      if (!serverConfig.command) {
        console.log(`⚠️  Skipping ${name}: no command specified`);
        continue;
      }
      
      try {
        await generateWrappers(name, serverConfig);
      } catch (error) {
        console.error(`❌ Failed to generate wrappers for ${name}:`, error.message);
      }
    }
    
    console.log('\n' + '━'.repeat(50));
    console.log('✅ Code generation complete!');
    console.log(`\n📁 Generated files in: ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
