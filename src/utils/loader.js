/**
 * 动态适配器加载器
 * 支持 .yaml 和 .ts 格式的适配器
 */

import { readdir, readFile } from 'fs/promises';
import { join, extname } from 'path';
import YAML from 'yaml';
import chalk from 'chalk';

export class AdapterLoader {
  constructor(adaptersDir) {
    this.adaptersDir = adaptersDir || './src/adapters';
    this.adapters = new Map();
  }

  /**
   * 加载所有适配器
   * @returns {Promise<Map>}
   */
  async loadAll() {
    try {
      const files = await readdir(this.adaptersDir);
      
      for (const file of files) {
        const ext = extname(file);
        if (ext === '.yaml' || ext === '.yml' || ext === '.ts' || ext === '.js') {
          const adapter = await this.loadAdapter(file);
          if (adapter) {
            this.adapters.set(adapter.name || file, adapter);
          }
        }
      }

      console.log(chalk.green(`✓ 已加载 ${this.adapters.size} 个适配器`));
      return this.adapters;
    } catch (err) {
      console.warn(chalk.yellow(`⚠ 适配器目录不存在：${this.adaptersDir}`));
      return new Map();
    }
  }

  /**
   * 加载单个适配器
   * @param {string} file - 文件名
   * @returns {Promise<object>}
   */
  async loadAdapter(file) {
    const filePath = join(this.adaptersDir, file);
    const content = await readFile(filePath, 'utf-8');
    const ext = extname(file);

    if (ext === '.yaml' || ext === '.yml') {
      return YAML.parse(content);
    } else {
      // TypeScript/JavaScript 适配器
      // 注意：生产环境需要编译
      try {
        const adapter = await import(filePath);
        return adapter.default || adapter;
      } catch (err) {
        console.warn(chalk.yellow(`⚠ 无法加载适配器 ${file}: ${err.message}`));
        return null;
      }
    }
  }

  /**
   * 获取适配器
   * @param {string} name - 适配器名称
   * @returns {object|null}
   */
  get(name) {
    return this.adapters.get(name) || null;
  }

  /**
   * 列出所有适配器
   * @returns {Array<string>}
   */
  list() {
    return Array.from(this.adapters.keys());
  }
}

// 全局加载器实例
let globalLoader = null;

export function getLoader(adaptersDir) {
  if (!globalLoader) {
    globalLoader = new AdapterLoader(adaptersDir);
  }
  return globalLoader;
}
