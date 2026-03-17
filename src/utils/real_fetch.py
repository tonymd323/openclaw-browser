#!/usr/bin/env python3
"""
真实网页抓取集成
整合 LightPanda + BeautifulSoup + 反爬虫
"""

import sys
import subprocess
from pathlib import Path
from typing import Dict, List, Any, Optional

# 添加路径
sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.html_parser import parse_list_with_selectors
from utils.anti_bot import get_anti_bot


def fetch_with_lightpanda(url: str, cookie: Optional[str] = None, timeout: int = 30) -> str:
    """使用 LightPanda 抓取网页"""
    cmd = [
        'lightpanda', 'fetch', url,
        '--dump', 'html',
        '--http_timeout', str(timeout * 1000)
    ]
    
    if cookie:
        cmd.extend(['--http_header', f'Cookie: {cookie}'])
    
    anti_bot = get_anti_bot()
    cmd.extend(['--user_agent_suffix', anti_bot.get_user_agent()])
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        if result.returncode == 0:
            return result.stdout
        else:
            raise Exception(f"LightPanda 错误：{result.stderr}")
    except subprocess.TimeoutExpired:
        raise Exception(f"LightPanda 超时（{timeout}秒）")


def load_adapter_config(platform: str) -> Dict[str, Any]:
    """加载适配器配置"""
    import yaml
    config_file = Path(__file__).parent.parent / 'adapters' / f'{platform}_real.yaml'
    with open(config_file, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def extract_data(html: str, config: Dict[str, Any]) -> List[Dict[str, Any]]:
    """提取数据"""
    list_selector = config.get('list_selector', '')
    fields_config = config.get('fields', [])
    
    fields = {}
    for field_config in fields_config:
        for field, selector in field_config.items():
            selector = selector.replace('{{', '').replace('}}', '')
            fields[field] = selector
    
    return parse_list_with_selectors(html, list_selector, fields)


def real_fetch(platform: str, action: str, query: Optional[str] = None, 
               cookie: Optional[str] = None, limit: int = 20) -> List[Dict[str, Any]]:
    """真实抓取入口"""
    adapter_config = load_adapter_config(platform)
    commands_config = adapter_config.get('commands', {})
    
    if action == 'home' and 'home' in commands_config:
        url = commands_config['home']['url']
        extract_config = commands_config['home']['extract']
    elif action == 'search' and 'search' in commands_config:
        url = commands_config['search']['url'].format(query=query) if query else commands_config['search']['url']
        extract_config = commands_config['search']['extract']
    elif action == 'explore' and 'explore' in commands_config:
        url = commands_config['explore']['url']
        extract_config = commands_config['explore']['extract']
    else:
        raise Exception(f"不支持的命令：{platform} {action}")
    
    anti_bot = get_anti_bot()
    anti_bot.rate_limit()
    
    print(f"正在抓取：{url}")
    html = fetch_with_lightpanda(url, cookie=cookie)
    
    anti_bot.delay()
    
    results = extract_data(html, extract_config)
    
    if limit and limit > 0:
        results = results[:limit]
    
    return results


if __name__ == '__main__':
    print("="*60)
    print("真实网页抓取测试")
    print("="*60)
    
    print("\n测试 B 站首页...")
    try:
        results = real_fetch('bilibili', 'home', limit=5)
        print(f"成功抓取 {len(results)} 条数据")
        for item in results[:3]:
            print(f"  - {item}")
    except Exception as e:
        print(f"失败：{e}")
    
    print("\n测试小红书探索...")
    try:
        results = real_fetch('xiaohongshu', 'explore', limit=5)
        print(f"成功抓取 {len(results)} 条数据")
        for item in results[:3]:
            print(f"  - {item}")
    except Exception as e:
        print(f"失败：{e}")
