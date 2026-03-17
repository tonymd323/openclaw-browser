/**
 * LightPanda 浏览器封装
 * 提供统一的浏览器控制接口
 */

import { spawn } from 'child_process';
import chalk from 'chalk';

export class LightPandaBrowser {
  constructor(options = {}) {
    this.timeout = options.timeout || 30000;
    this.cookie = options.cookie || null;
    this.debug = options.debug || false;
  }

  /**
   * 抓取网页
   * @param {string} url - 目标 URL
   * @param {object} options - 选项
   * @returns {Promise<{html: string, markdown: string}>}
   */
  async fetch(url, options = {}) {
    const args = ['fetch', url];

    // 添加输出格式
    if (options.dump === 'markdown') {
      args.push('--dump', 'markdown');
    } else if (options.dump === 'html') {
      args.push('--dump', 'html');
    }

    // 添加 Cookie
    if (this.cookie) {
      // LightPanda 通过 HTTP 头注入 Cookie
      args.push('--http_header', `Cookie: ${this.cookie}`);
    }

    // 添加超时
    args.push('--http_timeout', this.timeout.toString());

    if (this.debug) {
      console.log(chalk.blue('[LightPanda]'), '执行:', 'lightpanda', args.join(' '));
    }

    return new Promise((resolve, reject) => {
      const process = spawn('lightpanda', args, {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let error = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        error += data.toString();
        if (this.debug) {
          console.error(chalk.yellow('[LightPanda]'), data.toString());
        }
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve({
            html: options.dump === 'html' ? output : '',
            markdown: options.dump === 'markdown' ? output : '',
            raw: output
          });
        } else {
          reject(new Error(`LightPanda 退出码：${code}\n${error}`));
        }
      });

      process.on('error', (err) => {
        reject(new Error(`LightPanda 启动失败：${err.message}\n请确保已安装 LightPanda: which lightpanda`));
      });

      // 超时处理
      setTimeout(() => {
        process.kill('SIGTERM');
        reject(new Error(`LightPanda 超时（${this.timeout}ms）`));
      }, this.timeout);
    });
  }

  /**
   * 启动 CDP 服务器
   * @param {number} port - 端口
   * @returns {Promise<object>}
   */
  async serve(port = 9222) {
    const args = ['serve', '--port', port.toString()];

    return new Promise((resolve, reject) => {
      const process = spawn('lightpanda', args, {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      process.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('CDP server started')) {
          resolve({
            port,
            url: `ws://127.0.0.1:${port}`,
            process
          });
        }
      });

      process.stderr.on('data', (data) => {
        if (this.debug) {
          console.error(chalk.yellow('[LightPanda Serve]'), data.toString());
        }
      });

      process.on('error', (err) => {
        reject(new Error(`LightPanda Serve 启动失败：${err.message}`));
      });
    });
  }

  /**
   * 设置 Cookie
   * @param {string} cookie - Cookie 字符串
   */
  setCookie(cookie) {
    this.cookie = cookie;
  }

  /**
   * 测试连接
   * @returns {Promise<boolean>}
   */
  async testConnection() {
    try {
      await this.fetch('https://httpbin.org/get', { timeout: 5000 });
      return true;
    } catch (err) {
      return false;
    }
  }
}

// 单例模式
let browserInstance = null;

export function getBrowser(options = {}) {
  if (!browserInstance) {
    browserInstance = new LightPandaBrowser(options);
  }
  return browserInstance;
}
