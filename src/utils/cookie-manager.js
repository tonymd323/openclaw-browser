/**
 * Cookie 管理工具
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_DIR = join(__dirname, '../../.config');
const COOKIE_FILE = join(CONFIG_DIR, 'cookies.json');

export class CookieManager {
  constructor() {
    this.cookies = new Map();
  }

  /**
   * 初始化
   */
  async init() {
    try {
      await mkdir(CONFIG_DIR, { recursive: true });
      const content = await readFile(COOKIE_FILE, 'utf-8');
      const data = JSON.parse(content);
      
      for (const [platform, cookie] of Object.entries(data)) {
        this.cookies.set(platform, cookie);
      }
      
      console.log(chalk.green(`✓ 已加载 ${this.cookies.size} 个平台的 Cookie`));
    } catch (err) {
      // 文件不存在，创建空文件
      await writeFile(COOKIE_FILE, JSON.stringify({}, null, 2));
      console.log(chalk.blue('ℹ Cookie 文件已创建'));
    }
  }

  /**
   * 获取 Cookie
   * @param {string} platform - 平台名称
   * @returns {string|null}
   */
  get(platform) {
    return this.cookies.get(platform) || null;
  }

  /**
   * 设置 Cookie
   * @param {string} platform - 平台名称
   * @param {string} cookie - Cookie 字符串
   */
  async set(platform, cookie) {
    this.cookies.set(platform, cookie);
    await this.save();
    console.log(chalk.green(`✓ ${platform} Cookie 已保存`));
  }

  /**
   * 保存 Cookie
   */
  async save() {
    const data = Object.fromEntries(this.cookies);
    await writeFile(COOKIE_FILE, JSON.stringify(data, null, 2));
  }

  /**
   * 删除 Cookie
   * @param {string} platform - 平台名称
   */
  async delete(platform) {
    this.cookies.delete(platform);
    await this.save();
    console.log(chalk.green(`✓ ${platform} Cookie 已删除`));
  }

  /**
   * 列出所有 Cookie
   * @returns {Array<{platform: string, hasCookie: boolean}>}
   */
  list() {
    return Array.from(this.cookies.entries()).map(([platform, cookie]) => ({
      platform,
      hasCookie: !!cookie,
      cookieLength: cookie ? cookie.length : 0
    }));
  }

  /**
   * 验证 Cookie 是否有效
   * @param {string} platform - 平台名称
   * @param {function} validator - 验证函数
   * @returns {Promise<boolean>}
   */
  async validate(platform, validator) {
    const cookie = this.get(platform);
    if (!cookie) {
      return false;
    }

    try {
      return await validator(cookie);
    } catch (err) {
      return false;
    }
  }
}

// 单例模式
let defaultManager = null;

export function getCookieManager() {
  if (!defaultManager) {
    defaultManager = new CookieManager();
  }
  return defaultManager;
}
