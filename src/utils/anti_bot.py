#!/usr/bin/env python3
"""
反爬虫处理模块
User-Agent 轮换、请求延迟、Cookie 管理
"""

import random
import time
from typing import List, Optional


class AntiBot:
    """反爬虫处理"""
    
    # 常见 User-Agent 列表
    USER_AGENTS = [
        # macOS Chrome
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        # Windows Chrome
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        # macOS Safari
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        # iPhone Safari
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        # Android Chrome
        "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    ]
    
    def __init__(self, min_delay: int = 1000, max_delay: int = 3000):
        """
        初始化反爬虫模块
        
        Args:
            min_delay: 最小延迟（毫秒）
            max_delay: 最大延迟（毫秒）
        """
        self.min_delay = min_delay
        self.max_delay = max_delay
        self.last_request_time = 0
    
    def get_user_agent(self) -> str:
        """
        获取随机 User-Agent
        
        Returns:
            User-Agent 字符串
        """
        return random.choice(self.USER_AGENTS)
    
    def get_headers(self, cookie: Optional[str] = None) -> dict:
        """
        获取请求头
        
        Args:
            cookie: Cookie 字符串（可选）
        
        Returns:
            请求头字典
        """
        headers = {
            'User-Agent': self.get_user_agent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0',
        }
        
        if cookie:
            headers['Cookie'] = cookie
        
        return headers
    
    def delay(self):
        """
        随机延迟
        """
        delay_ms = random.randint(self.min_delay, self.max_delay)
        time.sleep(delay_ms / 1000.0)
    
    def rate_limit(self):
        """
        频率限制（确保请求间隔）
        """
        current_time = time.time()
        elapsed = current_time - self.last_request_time
        
        # 最小间隔 1 秒
        min_interval = 1.0
        
        if elapsed < min_interval:
            sleep_time = min_interval - elapsed
            time.sleep(sleep_time)
        
        self.last_request_time = time.time()


# 全局实例
_default_anti_bot = None


def get_anti_bot(min_delay: int = 1000, max_delay: int = 3000) -> AntiBot:
    """
    获取反爬虫实例（单例）
    
    Args:
        min_delay: 最小延迟
        max_delay: 最大延迟
    
    Returns:
        AntiBot 实例
    """
    global _default_anti_bot
    if _default_anti_bot is None:
        _default_anti_bot = AntiBot(min_delay, max_delay)
    return _default_anti_bot


# 测试
if __name__ == '__main__':
    anti_bot = get_anti_bot()
    
    print("测试 User-Agent 轮换:")
    for i in range(5):
        ua = anti_bot.get_user_agent()
        print(f"  {i+1}. {ua[:60]}...")
    
    print("\n测试请求延迟:")
    start = time.time()
    for i in range(3):
        anti_bot.delay()
        elapsed = time.time() - start
        print(f"  {i+1}. 延迟后总耗时：{elapsed:.2f}秒")
