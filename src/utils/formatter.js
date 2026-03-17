/**
 * 输出格式化工具
 * 支持 JSON/Table/Markdown 格式
 */

import cliTable3 from 'cli-table3';

const Table = cliTable3;

/**
 * 格式化输出
 * @param {Array} data - 数据数组
 * @param {string} format - 格式 (json|table|markdown)
 * @param {object} options - 选项
 */
export function formatOutput(data, format = 'table', options = {}) {
  if (!data || data.length === 0) {
    return '暂无数据';
  }

  switch (format) {
    case 'json':
      return formatAsJson(data, options);
    case 'table':
      return formatAsTable(data, options);
    case 'markdown':
      return formatAsMarkdown(data, options);
    default:
      return formatAsTable(data, options);
  }
}

/**
 * JSON 格式
 */
function formatAsJson(data, options) {
  return JSON.stringify(data, null, 2);
}

/**
 * 表格格式
 */
function formatAsTable(data, options) {
  const columns = options.columns || Object.keys(data[0]);
  
  const table = new Table({
    head: columns.map(col => chalk.cyan(col)),
    colWidths: options.colWidths || columns.map(() => 30),
    style: {
      head: ['cyan'],
      border: ['gray']
    }
  });

  data.forEach(item => {
    const row = columns.map(col => {
      const value = item[col];
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    });
    table.push(row);
  });

  return table.toString();
}

/**
 * Markdown 格式
 */
function formatAsMarkdown(data, options) {
  const columns = options.columns || Object.keys(data[0]);
  
  // 表头
  let markdown = `| ${columns.join(' | ')} |\n`;
  markdown += `| ${columns.map(() => '---').join(' | ')} |\n`;
  
  // 表内容
  data.forEach(item => {
    const row = columns.map(col => {
      const value = item[col];
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    });
    markdown += `| ${row.join(' | ')} |\n`;
  });

  return markdown;
}

/**
 *  chalk 辅助
 */
import chalk from 'chalk';

/**
 * 统计信息
 */
export function formatStats(stats) {
  const lines = [];
  
  if (stats.total !== undefined) {
    lines.push(chalk.green(`总计：${stats.total}`));
  }
  
  if (stats.success !== undefined) {
    lines.push(chalk.green(`成功：${stats.success}`));
  }
  
  if (stats.failed !== undefined) {
    lines.push(chalk.red(`失败：${stats.failed}`));
  }
  
  if (stats.duration !== undefined) {
    lines.push(chalk.blue(`耗时：${stats.duration}ms`));
  }
  
  return lines.join(' | ');
}

/**
 * 错误信息
 */
export function formatError(error, verbose = false) {
  if (verbose) {
    return chalk.red(`错误：${error.message}\n${error.stack}`);
  } else {
    return chalk.red(`错误：${error.message}`);
  }
}

/**
 * 成功信息
 */
export function formatSuccess(message) {
  return chalk.green(`✓ ${message}`);
}

/**
 * 警告信息
 */
export function formatWarning(message) {
  return chalk.yellow(`⚠ ${message}`);
}

/**
 * 信息
 */
export function formatInfo(message) {
  return chalk.blue(`ℹ ${message}`);
}
