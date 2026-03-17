/**
 * 登录命令实现
 */

import chalk from 'chalk';
import QRCode from 'qrcode-terminal';
import { getCookieManager } from '../utils/cookie-manager.js';

/**
 * 执行登录命令
 */
export async function executeLogin(platform, options) {
  const cookieManager = await getCookieManager();
  await cookieManager.init();

  console.log(chalk.blue(`🔐 登录 ${platform}...`));

  if (options.cookie) {
    // 直接配置 Cookie
    await cookieManager.set(platform, options.cookie);
    return;
  }

  if (options.feishu) {
    // 飞书扫码登录（需要飞书集成）
    console.log(chalk.yellow('飞书扫码登录功能开发中...'));
    console.log('当前请使用 Cookie 注入方式：');
    console.log(`openclaw-browser login ${platform} --cookie "your-cookie"`);
  } else {
    // 标准扫码登录
    console.log(chalk.yellow('扫码登录功能开发中...'));
    console.log('当前请使用 Cookie 注入方式：');
    console.log(`openclaw-browser login ${platform} --cookie "your-cookie"`);
  }
}
