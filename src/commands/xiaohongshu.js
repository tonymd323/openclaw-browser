/**
 * 小红书命令实现
 */

import chalk from 'chalk';
import cliTable3 from 'cli-table3';
import { getBrowser } from '../browser/lightpanda.js';
import { getCookieManager } from '../utils/cookie-manager.js';

const Table = cliTable3;

/**
 * 执行小红书命令
 */
export async function executeXiaohongshu(cmd, args, options) {
  const cookieManager = await getCookieManager();
  await cookieManager.init();

  const browser = getBrowser({
    timeout: parseInt(options.timeout),
    debug: options.debug
  });

  // 使用 Cookie
  if (options.useCookie) {
    const cookie = cookieManager.get('xiaohongshu');
    if (cookie) {
      browser.setCookie(cookie);
      console.log(chalk.green('✓ 已加载小红书 Cookie'));
    } else {
      console.log(chalk.yellow('⚠ 未找到小红书 Cookie，请先登录：openclaw-browser login xiaohongshu'));
    }
  }

  switch (cmd) {
    case 'explore':
      await xiaohongshuExplore(options);
      break;
    case 'search':
      await xiaohongshuSearch(args[0], options);
      break;
    case 'user':
      await xiaohongshuUser(args[0], options);
      break;
    case 'note':
      await xiaohongshuNote(args[0], options);
      break;
    case 'login':
      await xiaohongshuLogin(options);
      break;
    default:
      console.log(chalk.red(`未知命令：${cmd}`));
      console.log('可用命令：explore, search, user, note, login');
  }
}

/**
 * 探索首页
 */
async function xiaohongshuExplore(options) {
  console.log(chalk.blue('📕 获取小红书首页推荐...'));

  const browser = getBrowser();
  const result = await browser.fetch('https://www.xiaohongshu.com/explore', {
    dump: 'markdown'
  });

  // 输出表格
  const table = new Table({
    head: [chalk.cyan('标题'), chalk.cyan('作者'), chalk.cyan('点赞')],
    colWidths: [40, 15, 10]
  });

  // 示例数据
  table.push(
    ['【示例】股票投资入门指南', '投资达人', '1.2 万'],
    ['【示例】宝丰能源深度分析', '财经老王', '8563'],
    ['【示例】新能源汽车行业解读', '行业研究', '2.3 万']
  );

  console.log(table.toString());
  console.log(chalk.gray(`\n共 ${result.markdown.split('\n').length} 行内容`));
}

/**
 * 搜索笔记
 */
async function xiaohongshuSearch(query, options) {
  if (!query) {
    console.log(chalk.red('请提供搜索关键词'));
    return;
  }

  console.log(chalk.blue(`🔍 搜索：${query}...`));

  const url = `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(query)}&source=web_search_result_notes`;
  const browser = getBrowser();
  
  const result = await browser.fetch(url, {
    dump: 'markdown'
  });

  // 输出表格
  const table = new Table({
    head: [chalk.cyan('标题'), chalk.cyan('作者'), chalk.cyan('描述')],
    colWidths: [35, 12, 30]
  });

  table.push(
    [`【示例】${query}实战经验`, '投资高手', '分享我的投资心得...'],
    [`【示例】${query}避坑指南`, '理财达人', '新手必看...']
  );

  console.log(table.toString());
}

/**
 * 用户主页
 */
async function xiaohongshuUser(userId, options) {
  if (!userId) {
    console.log(chalk.red('请提供用户 ID'));
    return;
  }

  console.log(chalk.blue(`👤 获取用户主页：${userId}...`));

  const url = `https://www.xiaohongshu.com/user/profile/${userId}`;
  const browser = getBrowser();
  
  const result = await browser.fetch(url, {
    dump: 'markdown'
  });

  console.log(chalk.green('✓ 获取成功'));
  console.log(result.markdown.substring(0, 500) + '...');
}

/**
 * 笔记详情
 */
async function xiaohongshuNote(noteId, options) {
  if (!noteId) {
    console.log(chalk.red('请提供笔记 ID'));
    return;
  }

  console.log(chalk.blue(`📝 获取笔记详情：${noteId}...`));

  const url = `https://www.xiaohongshu.com/explore/${noteId}`;
  const browser = getBrowser();
  
  const result = await browser.fetch(url, {
    dump: 'markdown'
  });

  console.log(chalk.green('✓ 获取成功'));
  console.log(result.markdown.substring(0, 1000) + '...');
}

/**
 * 小红书登录
 */
async function xiaohongshuLogin(options) {
  console.log(chalk.blue('🔐 小红书登录'));

  if (options.cookie) {
    // 直接配置 Cookie
    const cookieManager = await getCookieManager();
    await cookieManager.set('xiaohongshu', options.cookie);
  } else {
    // 扫码登录（简化版）
    console.log(chalk.yellow('请使用以下方式之一登录：'));
    console.log('');
    console.log('1. Cookie 注入：');
    console.log('   openclaw-browser login xiaohongshu --cookie "web_session=xxx"');
    console.log('');
    console.log('2. 手动获取 Cookie：');
    console.log('   a. 在浏览器登录小红书');
    console.log('   b. F12 → Application → Cookies');
    console.log('   c. 复制 web_session');
    console.log('   d. 运行：openclaw-browser login xiaohongshu --cookie "web_session=xxx"');
  }
}
