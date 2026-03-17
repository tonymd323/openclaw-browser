/**
 * 诊断工具
 */

import chalk from 'chalk';
import { getBrowser } from '../browser/lightpanda.js';
import { getCookieManager } from '../utils/cookie-manager.js';

/**
 * 执行诊断命令
 */
export async function executeDoctor() {
  console.log(chalk.blue('🔍 OpenClaw Browser 诊断工具\n'));

  // 1. LightPanda 检查
  console.log(chalk.cyan('1. LightPanda 检查'));
  try {
    const { execSync } = await import('child_process');
    const version = execSync('lightpanda --version', { encoding: 'utf-8' }).trim();
    console.log(chalk.green(`   ✓ LightPanda 已安装：${version}`));
  } catch (err) {
    console.log(chalk.red(`   ✗ LightPanda 未安装`));
    console.log(chalk.yellow(`   请安装：https://github.com/lightpanda-io/lightpanda`));
  }

  // 2. Cookie 管理检查
  console.log(chalk.cyan('\n2. Cookie 管理检查'));
  try {
    const cookieManager = await getCookieManager();
    await cookieManager.init();
    const configs = cookieManager.list();
    console.log(chalk.green(`   ✓ Cookie 管理器正常 (${configs.length} 个平台)`));
  } catch (err) {
    console.log(chalk.red(`   ✗ Cookie 管理器异常：${err.message}`));
  }

  // 3. 网络连接检查
  console.log(chalk.cyan('\n3. 网络连接检查'));
  const browser = getBrowser();
  const connected = await browser.testConnection();
  if (connected) {
    console.log(chalk.green(`   ✓ 网络连接正常`));
  } else {
    console.log(chalk.red(`   ✗ 网络连接失败`));
  }

  // 4. 适配器检查
  console.log(chalk.cyan('\n4. 适配器检查'));
  try {
    const { getLoader } = await import('../utils/loader.js');
    const loader = getLoader('./src/adapters');
    const adapters = await loader.loadAll();
    console.log(chalk.green(`   ✓ 已加载 ${adapters.size} 个适配器`));
    adapters.forEach((adapter, name) => {
      console.log(`      - ${name}`);
    });
  } catch (err) {
    console.log(chalk.yellow(`   ⚠ 适配器加载失败：${err.message}`));
  }

  // 5. 系统信息
  console.log(chalk.cyan('\n5. 系统信息'));
  const { platform, arch } = await import('os');
  console.log(chalk.green(`   操作系统：${platform()} ${arch()}`));
  
  const { version } = await import('process');
  console.log(chalk.green(`   Node.js: ${version}`));

  console.log(chalk.cyan('\n✓ 诊断完成\n'));
}
