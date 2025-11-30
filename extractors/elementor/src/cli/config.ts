/**
 * CLI Configuration Management
 * Handles loading, saving, and merging configuration files
 */

import { promises as fs } from 'fs';
import { resolve } from 'path';
import type { ExtractorConfig } from '../core/Config';

/**
 * Load configuration from a JSON file
 * @param filePath Path to configuration file
 * @returns Parsed configuration object
 */
export async function loadConfigFile(filePath: string): Promise<Partial<ExtractorConfig>> {
  try {
    const absolutePath = resolve(filePath);
    const content = await fs.readFile(absolutePath, 'utf-8');
    const config = JSON.parse(content) as Partial<ExtractorConfig>;
    return config;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load config file '${filePath}': ${error.message}`);
    }
    throw error;
  }
}

/**
 * Save configuration to a JSON file
 * @param config Configuration object to save
 * @param filePath Output file path
 */
export async function saveConfigFile(
  config: Partial<ExtractorConfig> | ExtractorConfig,
  filePath: string,
): Promise<void> {
  try {
    const absolutePath = resolve(filePath);
    const content = JSON.stringify(config, null, 2);
    await fs.writeFile(absolutePath, content, 'utf-8');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to save config file '${filePath}': ${error.message}`);
    }
    throw error;
  }
}

/**
 * Merge CLI arguments with existing configuration
 * CLI arguments take precedence over config file values
 * @param config Existing configuration (from file or defaults)
 * @param args CLI arguments object
 * @returns Merged configuration
 */
export function mergeConfigWithArgs(
  config: Partial<ExtractorConfig>,
  args: any,
): Partial<ExtractorConfig> {
  const merged = { ...config };

  // Handle WordPress connection settings
  if (args.url) {
    merged.connector = 'rest-api';
    merged.restApi = {
      ...merged.restApi,
      baseUrl: args.url,
    };
  }

  // Handle authentication
  if (args.username) {
    if (!merged.restApi) {
      merged.restApi = { baseUrl: '' };
    }
    merged.restApi.username = args.username;
  }

  if (args.password) {
    if (!merged.restApi) {
      merged.restApi = { baseUrl: '' };
    }

    // Determine if this is app password or regular password based on auth-type
    if (args.authType === 'app-password' || !args.authType) {
      merged.restApi.applicationPassword = args.password;
    } else {
      merged.restApi.password = args.password;
    }
  }

  if (args.token) {
    if (!merged.restApi) {
      merged.restApi = { baseUrl: '' };
    }
    // JWT tokens would be handled here in a future version
    // For now, store in a generic way
    (merged.restApi as any).jwtToken = args.token;
  }

  // Handle output settings
  if (args.output) {
    if (!merged.output) {
      merged.output = {
        directory: args.output,
        format: 'json-pretty',
        includeReport: true,
        reportFormat: 'both',
      };
    } else {
      merged.output.directory = args.output;
    }
  }

  if (args.format) {
    if (!merged.output) {
      merged.output = {
        directory: './output',
        format: 'json-pretty',
        includeReport: true,
        reportFormat: args.format,
      };
    } else {
      merged.output.reportFormat = args.format === 'all' ? 'both' : args.format;
    }
  }

  // Handle logging
  if (args.verbose) {
    merged.logLevel = 'debug';
  }

  // Handle extraction options
  if (args.parallel !== undefined) {
    if (!merged.extraction) {
      merged.extraction = {
        continueOnError: true,
        validateSchemas: true,
        extractGlobalStyles: true,
        includeProWidgets: true,
      };
    }
    // Parallel processing would be configured here
    // For now, just note it's enabled
    (merged.extraction as any).parallel = args.parallel;
  }

  if (args.batchSize) {
    if (!merged.extraction) {
      merged.extraction = {
        continueOnError: true,
        validateSchemas: true,
        extractGlobalStyles: true,
        includeProWidgets: true,
      };
    }
    merged.extraction.batchSize = parseInt(args.batchSize, 10);
  }

  return merged;
}

/**
 * Load configuration from environment variables
 * Useful for CI/CD pipelines and Docker deployments
 * @returns Configuration object built from environment variables
 */
export function loadConfigFromEnv(): Partial<ExtractorConfig> {
  const config: Partial<ExtractorConfig> = {};

  // WordPress connection
  if (process.env.ELEMENTOR_WP_URL) {
    config.connector = 'rest-api';
    config.restApi = {
      baseUrl: process.env.ELEMENTOR_WP_URL,
    };
  }

  if (process.env.ELEMENTOR_WP_USERNAME) {
    if (!config.restApi) config.restApi = { baseUrl: '' };
    config.restApi.username = process.env.ELEMENTOR_WP_USERNAME;
  }

  if (process.env.ELEMENTOR_WP_PASSWORD) {
    if (!config.restApi) config.restApi = { baseUrl: '' };
    config.restApi.applicationPassword = process.env.ELEMENTOR_WP_PASSWORD;
  }

  // Output settings
  if (process.env.ELEMENTOR_OUTPUT_DIR) {
    config.output = {
      directory: process.env.ELEMENTOR_OUTPUT_DIR,
      format: 'json-pretty',
      includeReport: true,
      reportFormat: 'both',
    };
  }

  // Logging
  if (process.env.ELEMENTOR_LOG_LEVEL) {
    const logLevel = process.env.ELEMENTOR_LOG_LEVEL.toLowerCase();
    if (['error', 'warn', 'info', 'debug'].includes(logLevel)) {
      config.logLevel = logLevel as 'error' | 'warn' | 'info' | 'debug';
    }
  }

  if (process.env.ELEMENTOR_LOG_FILE) {
    config.logFile = process.env.ELEMENTOR_LOG_FILE;
  }

  // Extraction options
  if (process.env.ELEMENTOR_CONTINUE_ON_ERROR) {
    if (!config.extraction) {
      config.extraction = {
        continueOnError: true,
        validateSchemas: true,
        extractGlobalStyles: true,
        includeProWidgets: true,
      };
    }
    config.extraction.continueOnError = process.env.ELEMENTOR_CONTINUE_ON_ERROR === 'true';
  }

  if (process.env.ELEMENTOR_VALIDATE_SCHEMAS) {
    if (!config.extraction) {
      config.extraction = {
        continueOnError: true,
        validateSchemas: true,
        extractGlobalStyles: true,
        includeProWidgets: true,
      };
    }
    config.extraction.validateSchemas = process.env.ELEMENTOR_VALIDATE_SCHEMAS === 'true';
  }

  return config;
}

/**
 * Create a configuration profile
 * Profiles are predefined configurations for common scenarios
 */
export interface ConfigProfile {
  name: string;
  description: string;
  config: Partial<ExtractorConfig>;
}

/**
 * Built-in configuration profiles
 */
export const CONFIG_PROFILES: ConfigProfile[] = [
  {
    name: 'development',
    description: 'Development profile with verbose logging and validation',
    config: {
      logLevel: 'debug',
      extraction: {
        continueOnError: true,
        validateSchemas: true,
        extractGlobalStyles: true,
        includeProWidgets: true,
        batchSize: 10,
      },
      output: {
        directory: './output/dev',
        format: 'json-pretty',
        includeReport: true,
        reportFormat: 'both',
      },
    },
  },
  {
    name: 'production',
    description: 'Production profile optimized for performance',
    config: {
      logLevel: 'info',
      extraction: {
        continueOnError: true,
        validateSchemas: false,
        extractGlobalStyles: true,
        includeProWidgets: true,
        batchSize: 50,
        maxMemoryMB: 1024,
      },
      output: {
        directory: './output/prod',
        format: 'json',
        includeReport: true,
        reportFormat: 'json',
      },
    },
  },
  {
    name: 'ci',
    description: 'CI/CD profile with strict validation and error handling',
    config: {
      logLevel: 'info',
      extraction: {
        continueOnError: false,
        validateSchemas: true,
        extractGlobalStyles: true,
        includeProWidgets: true,
        batchSize: 20,
      },
      output: {
        directory: './output/ci',
        format: 'json-pretty',
        includeReport: true,
        reportFormat: 'both',
      },
    },
  },
  {
    name: 'minimal',
    description: 'Minimal profile for quick extraction without validation',
    config: {
      logLevel: 'warn',
      extraction: {
        continueOnError: true,
        validateSchemas: false,
        extractGlobalStyles: false,
        includeProWidgets: true,
        batchSize: 100,
      },
      output: {
        directory: './output',
        format: 'json',
        includeReport: false,
        reportFormat: 'json',
      },
    },
  },
];

/**
 * Get a configuration profile by name
 * @param profileName Name of the profile
 * @returns Configuration profile or undefined if not found
 */
export function getConfigProfile(profileName: string): ConfigProfile | undefined {
  return CONFIG_PROFILES.find(p => p.name === profileName);
}

/**
 * List all available configuration profiles
 * @returns Array of profile names and descriptions
 */
export function listConfigProfiles(): Array<{ name: string; description: string }> {
  return CONFIG_PROFILES.map(p => ({
    name: p.name,
    description: p.description,
  }));
}
