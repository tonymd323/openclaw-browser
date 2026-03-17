/**
 * 日志工具
 * 支持不同级别和格式
 */

import chalk from 'chalk';

/**
 * 日志级别
 */
export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

/**
 * 日志配置
 */
let config = {
  level: LogLevel.INFO,
  verbose: false,
  debug: false,
  timestamp: true
};

/**
 * 配置日志
 */
export function configureLogger(options) {
  config = { ...config, ...options };
  
  if (config.debug) {
    config.level = LogLevel.DEBUG;
  }
  
  if (config.verbose) {
    config.level = LogLevel.DEBUG;
  }
}

/**
 * 格式化时间戳
 */
function formatTimestamp() {
  if (!config.timestamp) return '';
  const now = new Date();
  return chalk.gray(`[${now.toISOString()}] `);
}

/**
 * 调试日志
 */
export function debug(message, ...args) {
  if (config.level <= LogLevel.DEBUG) {
    console.log(formatTimestamp() + chalk.cyan('[DEBUG]') + ' ' + message, ...args);
  }
}

/**
 * 信息日志
 */
export function info(message, ...args) {
  if (config.level <= LogLevel.INFO) {
    console.log(formatTimestamp() + chalk.green('[INFO]') + ' ' + message, ...args);
  }
}

/**
 * 警告日志
 */
export function warn(message, ...args) {
  if (config.level <= LogLevel.WARN) {
    console.log(formatTimestamp() + chalk.yellow('[WARN]') + ' ' + message, ...args);
  }
}

/**
 * 错误日志
 */
export function error(message, ...args) {
  if (config.level <= LogLevel.ERROR) {
    console.log(formatTimestamp() + chalk.red('[ERROR]') + ' ' + message, ...args);
  }
}

/**
 * 成功日志
 */
export function success(message, ...args) {
  if (config.level <= LogLevel.INFO) {
    console.log(formatTimestamp() + chalk.green('✓') + ' ' + message, ...args);
  }
}

/**
 * 失败日志
 */
export function fail(message, ...args) {
  if (config.level <= LogLevel.ERROR) {
    console.log(formatTimestamp() + chalk.red('✗') + ' ' + message, ...args);
  }
}

/**
 * 进度日志
 */
export function progress(current, total, message) {
  const percent = Math.round((current / total) * 100);
  const bar = createProgressBar(percent, 20);
  console.log(formatTimestamp() + chalk.blue('[PROGRESS]') + ` ${bar} ${percent}% - ${message}`);
}

/**
 * 创建进度条
 */
function createProgressBar(percent, length) {
  const filled = Math.round((percent / 100) * length);
  const empty = length - filled;
  return chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
}

/**
 * 表格日志
 */
export function table(data, options = {}) {
  console.log(formatTimestamp() + chalk.blue('[TABLE]'));
  console.dir(data, { depth: options.depth || 2, colors: true });
}

/**
 * JSON 日志
 */
export function json(data, pretty = true) {
  console.log(formatTimestamp() + chalk.blue('[JSON]'));
  if (pretty) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(JSON.stringify(data));
  }
}

// 默认导出
export default {
  configure: configureLogger,
  debug,
  info,
  warn,
  error,
  success,
  fail,
  progress,
  table,
  json
};
