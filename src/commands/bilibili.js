/**
 * B 站命令实现
 */

import chalk from 'chalk';
import cliTable3 from 'cli-table3';
import { getBrowser } from '../browser/lightpanda.js';
import { getCookieManager } from '../utils/cookie-manager.js';
import { getLoader } from '../utils/loader.js';

const Table = cliTable3;

/**
 * 执行 B 站命令
 */
export async function executeBilibili(cmd, args, options) {
  const cookieManager = await getCookieManager();
  await cookieManager.init();

  const browser = getBrowser({
    timeout: parseInt(options.timeout),
    debug: options.debug
  });

  // 使用 Cookie
  if (options.useCookie) {
    const cookie = cookieManager.get('bilibili');
    if (cookie) {
      browser.setCookie(cookie);
      console.log(chalk.green('✓ 已加载 B 站 Cookie'));
    } else {
      console.log(chalk.yellow('⚠ 未找到 B 站 Cookie，请先登录：openclaw-browser login bilibili'));
    }
  }

  switch (cmd) {
    case 'home':
      await bilibiliHome(options);
      break;
    case 'search':
      await bilibiliSearch(args[0], options);
      break;
    case 'video':
      await bilibiliVideo(args[0], options);
      break;
    case 'login':
      await bilibiliLogin(options);
      break;
    default:
      console.log(chalk.red(`未知命令：${cmd}`));
      console.log('可用命令：home, search, video, login');
  }
}

/**
 * 首页推荐
 */
async function bilibiliHome(options) {
  console.log(chalk.blue('📺 获取 B 站首页推荐...'));

  const browser = getBrowser();
  const result = await browser.fetch('https://www.bilibili.com/', {
    dump: 'markdown'
  });

  // 解析结果（简化版，实际应该用适配器）
  const lines = result.markdown.split('\n').filter(line => line.trim());
  
  // 输出表格
  const table = new Table({
    head: [chalk.cyan('标题'), chalk.cyan('UP 主'), chalk.cyan('播放'), chalk.cyan('时长')],
    colWidths: [40, 15, 12, 10]
  });

  // 示例数据（实际应该从解析结果提取）
  table.push(
    ['【示例】AI 投资分析', '财经老王', '12.5 万', '15:30'],
    ['【示例】新能源汽车解读', '投资研究院', '8.3 万', '20:15'],
    ['【示例】财报深度分析', '价值投资派', '15.2 万', '25:40']
  );

  console.log(table.toString());
  console.log(chalk.gray(`\n共 ${lines.length} 行内容`));
}

/**
 * 搜索视频
 */
async function bilibiliSearch(query, options) {
  if (!query) {
    console.log(chalk.red('请提供搜索关键词'));
    return;
  }

  console.log(chalk.blue(`🔍 搜索：${query}...`));

  const url = `https://search.bilibili.com/all?keyword=${encodeURIComponent(query)}`;
  const browser = getBrowser();
  
  const result = await browser.fetch(url, {
    dump: 'markdown'
  });

  // 输出结果
  const table = new Table({
    head: [chalk.cyan('标题'), chalk.cyan('UP 主'), chalk.cyan('播放')],
    colWidths: [50, 15, 12]
  });

  table.push(
    [`【示例】${query} 深度解析`, '财经 UP 主', '20.5 万'],
    [`【示例】${query} 投资策略`, '投资达人', '15.3 万']
  );

  console.log(table.toString());
}

/**
 * 视频详情
 */
async function bilibiliVideo(bvid, options) {
  if (!bvid) {
    console.log(chalk.red('请提供视频 BV 号'));
    return;
  }

  console.log(chalk.blue(`📹 获取视频详情：${bvid}...`));

  const url = `https://www.bilibili.com/video/${bvid}`;
  const browser = getBrowser();
  
  const result = await browser.fetch(url, {
    dump: 'markdown'
  });

  console.log(chalk.green('✓ 获取成功'));
  console.log(result.markdown.substring(0, 500) + '...');
}

/**
 * B 站登录
 */
async function bilibiliLogin(options) {
  console.log(chalk.blue('🔐 B 站登录'));

  if (options.cookie) {
    // 直接配置 Cookie
    const cookieManager = await getCookieManager();
    await cookieManager.set('bilibili', options.cookie);
  } else {
    // 扫码登录（简化版）
    console.log(chalk.yellow('请使用以下方式之一登录：'));
    console.log('');
    console.log('1. Cookie 注入：');
    console.log('   openclaw-browser login bilibili --cookie "SESSDATA=xxx; bili_jct=yyy"');
    console.log('');
    console.log('2. 手动获取 Cookie：');
    console.log('   a. 在浏览器登录 B 站');
    console.log('   b. F12 → Application → Cookies');
    console.log('   c. 复制 SESSDATA, bili_jct, DedeUserID');
    console.log('   d. 运行：openclaw-browser login bilibili --cookie "SESSDATA=xxx;..."');
  }
}
