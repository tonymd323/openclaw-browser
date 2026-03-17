/**
 * 配置管理命令
 */

import chalk from 'chalk';
import { getCookieManager } from '../utils/cookie-manager.js';

/**
 * 执行配置命令
 */
export async function executeConfig(action, key, value) {
  const cookieManager = await getCookieManager();
  await cookieManager.init();

  switch (action) {
    case 'get':
      if (!key) {
        console.log(chalk.red('请提供配置键'));
        return;
      }
      const configValue = cookieManager.get(key);
      if (configValue) {
        console.log(chalk.green(`${key}:`), configValue.substring(0, 50) + '...');
      } else {
        console.log(chalk.yellow(`未找到配置：${key}`));
      }
      break;

    case 'set':
      if (!key || !value) {
        console.log(chalk.red('请提供配置键和值'));
        return;
      }
      await cookieManager.set(key, value);
      break;

    case 'list':
      const configs = cookieManager.list();
      if (configs.length === 0) {
        console.log(chalk.yellow('暂无配置'));
      } else {
        console.log(chalk.green('已配置的平台:'));
        configs.forEach(({ platform, hasCookie, cookieLength }) => {
          console.log(`  - ${platform}: ${hasCookie ? chalk.green(`✓ (${cookieLength} 字符)`) : chalk.red('✗ 未配置')}`);
        });
      }
      break;

    default:
      console.log(chalk.red(`未知操作：${action}`));
      console.log('可用操作：get, set, list');
  }
}
