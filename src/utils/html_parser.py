#!/usr/bin/env python3
"""
HTML 解析器
基于 BeautifulSoup 实现网页内容提取
"""

from bs4 import BeautifulSoup
from typing import List, Dict, Optional, Any
import re


class HTMLParser:
    """HTML 解析器"""
    
    def __init__(self, html: str):
        """
        初始化解析器
        
        Args:
            html: HTML 内容
        """
        self.html = html
        self.soup = BeautifulSoup(html, 'lxml')
    
    def select(self, selector: str) -> List['Element']:
        """
        CSS 选择器
        
        Args:
            selector: CSS 选择器
        
        Returns:
            元素列表
        """
        elements = self.soup.select(selector)
        return [Element(elem) for elem in elements]
    
    def select_one(self, selector: str) -> Optional['Element']:
        """
        CSS 选择器（单个）
        
        Args:
            selector: CSS 选择器
        
        Returns:
            元素或 None
        """
        elem = self.soup.select_one(selector)
        return Element(elem) if elem else None
    
    def get_text(self, selector: str = None) -> str:
        """
        获取文本
        
        Args:
            selector: CSS 选择器（可选）
        
        Returns:
            文本内容
        """
        if selector:
            elem = self.select_one(selector)
            return elem.get_text() if elem else ''
        return self.soup.get_text()


class Element:
    """HTML 元素"""
    
    def __init__(self, element):
        self.element = element
    
    def get_text(self) -> str:
        """获取文本内容"""
        if self.element:
            return self.element.get_text(strip=True)
        return ''
    
    def get_attr(self, name: str) -> Optional[str]:
        """获取属性"""
        if self.element and self.element.has_attr(name):
            return self.element[name]
        return None
    
    def select(self, selector: str) -> List['Element']:
        """子元素选择"""
        if self.element:
            elements = self.element.select(selector)
            return [Element(elem) for elem in elements]
        return []
    
    def select_one(self, selector: str) -> Optional['Element']:
        """子元素选择（单个）"""
        if self.element:
            elem = self.element.select_one(selector)
            return Element(elem) if elem else None
        return None


def parse_with_selectors(html: str, config: Dict[str, str]) -> Dict[str, Any]:
    """
    使用选择器配置解析 HTML
    
    Args:
        html: HTML 内容
        config: 选择器配置 {'field': 'selector'}
    
    Returns:
        提取的数据
    """
    parser = HTMLParser(html)
    result = {}
    
    for field, selector in config.items():
        elem = parser.select_one(selector)
        if elem:
            # 检查是否是获取属性
            if ':' in selector:
                selector_part, attr = selector.rsplit(':', 1)
                elem_temp = parser.select_one(selector_part)
                result[field] = elem_temp.get_attr(attr) if elem_temp else ''
            else:
                result[field] = elem.get_text()
        else:
            result[field] = ''
    
    return result


def parse_list_with_selectors(html: str, list_selector: str, field_configs: Dict[str, str]) -> List[Dict[str, Any]]:
    """
    解析列表数据
    
    Args:
        html: HTML 内容
        list_selector: 列表项选择器
        field_configs: 字段配置 {'field': 'selector'}
    
    Returns:
        数据列表
    """
    parser = HTMLParser(html)
    items = parser.select(list_selector)
    
    results = []
    for item in items:
        result = {}
        for field, selector in field_configs.items():
            # 相对选择器
            if selector.startswith('.'):
                elem = item.select_one(selector)
            else:
                elem = parser.select_one(selector)
            
            if elem:
                if ':' in selector:
                    selector_part, attr = selector.rsplit(':', 1)
                    elem_temp = item.select_one(selector_part) if selector.startswith('.') else parser.select_one(selector_part)
                    result[field] = elem_temp.get_attr(attr) if elem_temp else ''
                else:
                    result[field] = elem.get_text()
            else:
                result[field] = ''
        
        results.append(result)
    
    return results


# 测试
if __name__ == '__main__':
    test_html = '''
    <html>
        <body>
            <ul class="video-list">
                <li>
                    <h2 class="title"><a href="/video/1">AI 投资分析</a></h2>
                    <span class="up">财经老王</span>
                    <span class="play">12.5 万</span>
                </li>
                <li>
                    <h2 class="title"><a href="/video/2">新能源汽车</a></h2>
                    <span class="up">投资研究院</span>
                    <span class="play">8.3 万</span>
                </li>
            </ul>
        </body>
    </html>
    '''
    
    # 测试列表解析
    config = {
        'title': '.title a',
        'up': '.up',
        'play': '.play'
    }
    
    results = parse_list_with_selectors(test_html, '.video-list li', config)
    
    print("解析结果:")
    for item in results:
        print(f"  - {item}")
