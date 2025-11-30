/**
 * Configuration management for Elementor extractor
 */

/**
 * Connector type for WordPress data access
 */
export type ConnectorType = 'rest-api' | 'wp-cli' | 'mysql';

/**
 * Log level configuration
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * REST API connector configuration
 */
export interface RestApiConfig {
  baseUrl: string;
  username?: string;
  password?: string;
  applicationPassword?: string;
  timeout?: number; // milliseconds
}

/**
 * WP-CLI connector configuration
 */
export interface WpCliConfig {
  wpPath: string; // Path to WordPress installation
  phpPath?: string; // Path to PHP binary (default: 'php')
  timeout?: number; // milliseconds
}

/**
 * MySQL connector configuration
 */
export interface MySqlConfig {
  host: string;
  port?: number;
  database: string;
  user: string;
  password: string;
  tablePrefix?: string; // WordPress table prefix (default: 'wp_')
}

/**
 * Extraction options
 */
export interface ExtractionOptions {
  // Error handling
  continueOnError: boolean; // Continue extraction on widget errors (default: true)

  // Validation
  validateSchemas: boolean; // Validate data against Zod schemas (default: true)

  // Feature flags
  extractGlobalStyles: boolean; // Extract site-wide styles (default: true)
  includeProWidgets: boolean; // Include Elementor Pro widgets (default: true)

  // Performance
  batchSize?: number; // Widget batch size for streaming (default: 50)
  maxMemoryMB?: number; // Maximum memory usage in MB (default: 512)

  // Filtering
  pageIds?: number[]; // Specific page IDs to extract (default: all)
  widgetTypes?: string[]; // Specific widget types to extract (default: all)
}

/**
 * Output configuration
 */
export interface OutputConfig {
  directory: string; // Output directory path
  format: 'json' | 'json-pretty'; // Output format
  includeReport: boolean; // Include extraction report (default: true)
  reportFormat: 'json' | 'markdown' | 'both'; // Report format
}

/**
 * Complete extractor configuration
 */
export interface ExtractorConfig {
  // Connector settings
  connector: ConnectorType;
  restApi?: RestApiConfig;
  wpCli?: WpCliConfig;
  mysql?: MySqlConfig;

  // Extraction options
  extraction: ExtractionOptions;

  // Output settings
  output: OutputConfig;

  // Logging
  logLevel: LogLevel;
  logFile?: string; // Optional log file path
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Partial<ExtractorConfig> = {
  connector: 'rest-api',
  extraction: {
    continueOnError: true,
    validateSchemas: true,
    extractGlobalStyles: true,
    includeProWidgets: true,
    batchSize: 50,
    maxMemoryMB: 512,
  },
  output: {
    directory: './output/extractions',
    format: 'json-pretty',
    includeReport: true,
    reportFormat: 'both',
  },
  logLevel: 'info',
};

/**
 * Merge user config with defaults
 */
export function mergeConfig(
  userConfig: Partial<ExtractorConfig>,
): ExtractorConfig {
  const config: ExtractorConfig = {
    connector: userConfig.connector || DEFAULT_CONFIG.connector!,
    extraction: {
      ...DEFAULT_CONFIG.extraction,
      ...userConfig.extraction,
    } as ExtractionOptions,
    output: {
      ...DEFAULT_CONFIG.output,
      ...userConfig.output,
    } as OutputConfig,
    logLevel: userConfig.logLevel || DEFAULT_CONFIG.logLevel!,
  };

  if (userConfig.restApi) config.restApi = userConfig.restApi;
  if (userConfig.wpCli) config.wpCli = userConfig.wpCli;
  if (userConfig.mysql) config.mysql = userConfig.mysql;
  if (userConfig.logFile) config.logFile = userConfig.logFile;

  return config;
}

/**
 * Validate configuration
 * @throws Error if configuration is invalid
 */
export function validateConfig(config: ExtractorConfig): void {
  // Validate connector-specific config
  if (config.connector === 'rest-api' && !config.restApi) {
    throw new Error('REST API configuration is required when using rest-api connector');
  }

  if (config.connector === 'wp-cli' && !config.wpCli) {
    throw new Error('WP-CLI configuration is required when using wp-cli connector');
  }

  if (config.connector === 'mysql' && !config.mysql) {
    throw new Error('MySQL configuration is required when using mysql connector');
  }

  // Validate REST API config
  if (config.restApi) {
    if (!config.restApi.baseUrl) {
      throw new Error('REST API baseUrl is required');
    }

    try {
      new URL(config.restApi.baseUrl);
    } catch {
      throw new Error('REST API baseUrl must be a valid URL');
    }

    if (!config.restApi.applicationPassword && !config.restApi.password) {
      throw new Error('REST API requires either applicationPassword or password');
    }
  }

  // Validate WP-CLI config
  if (config.wpCli) {
    if (!config.wpCli.wpPath) {
      throw new Error('WP-CLI wpPath is required');
    }
  }

  // Validate MySQL config
  if (config.mysql) {
    if (!config.mysql.host || !config.mysql.database || !config.mysql.user) {
      throw new Error('MySQL requires host, database, and user');
    }
  }

  // Validate extraction options
  if (config.extraction.batchSize && config.extraction.batchSize < 1) {
    throw new Error('Batch size must be at least 1');
  }

  if (config.extraction.maxMemoryMB && config.extraction.maxMemoryMB < 64) {
    throw new Error('Max memory must be at least 64MB');
  }

  // Validate output config
  if (!config.output.directory) {
    throw new Error('Output directory is required');
  }
}

/**
 * Load configuration from file
 * @param filePath Path to config file (JSON)
 * @returns Merged and validated configuration
 */
export async function loadConfigFromFile(
  filePath: string,
): Promise<ExtractorConfig> {
  const fs = await import('fs/promises');

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const userConfig = JSON.parse(fileContent) as Partial<ExtractorConfig>;
    const config = mergeConfig(userConfig);
    validateConfig(config);
    return config;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load config from ${filePath}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Save configuration to file
 * @param config Configuration to save
 * @param filePath Output file path
 */
export async function saveConfigToFile(
  config: ExtractorConfig,
  filePath: string,
): Promise<void> {
  const fs = await import('fs/promises');

  try {
    const fileContent = JSON.stringify(config, null, 2);
    await fs.writeFile(filePath, fileContent, 'utf-8');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to save config to ${filePath}: ${error.message}`);
    }
    throw error;
  }
}
