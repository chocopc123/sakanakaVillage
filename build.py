#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
HTMLビルドスクリプト
JSONファイルからHTMLを生成してSEO対応する
"""

from __future__ import print_function
from __future__ import unicode_literals
import json
import os
import re
import sys
import io


def load_json(filepath):
    """JSONファイルを読み込む"""
    try:
        with io.open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print("Error loading {}: {}".format(filepath, e))
        return None


def generate_topics_html(topics):
    """TOPICSのHTMLを生成"""
    html_parts = []
    for topic in topics:
        classes = ['topic-card']
        if topic.get('highlight'):
            classes.append('highlight')
        if topic.get('campaign'):
            classes.append('campaign')

        html = '                <div class="{}">'.format(" ".join(classes))

        if topic.get('badge'):
            html += '\n                    <div class="card-badge">{}</div>'.format(topic["badge"])

        html += '\n                    <div class="card-icon"><span class="material-icons-round">{}</span></div>'.format(topic["icon"])
        html += '\n                    <h3>{}</h3>'.format(topic["title"])

        if topic.get('campaign'):
            html += '\n                    <p class="campaign-text">{}</p>'.format(topic["description"])
        else:
            html += '\n                    <p>{}</p>'.format(topic["description"])

        html += '\n                </div>'
        html_parts.append(html)

    return '\n'.join(html_parts)


def generate_news_html(news):
    """NEWSのHTMLを生成"""
    html_parts = []
    for item in news:
        html = '''                <article class="news-item">
                    <div class="news-date">{date}</div>
                    <div class="news-content">
                        <h3>{title}</h3>
                        <p>{description}</p>
                    </div>
                </article>'''.format(
            date=item["date"],
            title=item["title"],
            description=item["description"]
        )
        html_parts.append(html)

    return '\n'.join(html_parts)


def generate_events_html(events):
    """EVENTSのHTMLを生成"""
    html_parts = []
    for event in events:
        html = '''                    <tr>
                        <td>{date}</td>
                        <td>{name}</td>
                        <td>
                            <span class="pdf-link" data-pdf="{pdf}" data-title="{name} リザルト"><span class="material-icons-round" style="font-size:1.2rem;">description</span> <span class="pdf-text">Result</span></span>
                            <span class="video-link" data-video-id="{videoId}" data-title="{name} 動画"><span class="material-icons-round">smart_display</span> <span class="link-text">YouTube</span></span>
                        </td>
                    </tr>'''.format(
            date=event["date"],
            name=event["name"],
            pdf=event["pdf"],
            videoId=event["videoId"]
        )
        html_parts.append(html)

    return '\n'.join(html_parts)


def generate_company_html(company):
    """COMPANYのHTMLを生成"""
    html_parts = []
    for item in company:
        if isinstance(item['value'], list):
            # 管理者リストの場合
            staff_list = []
            for staff in item['value']:
                staff_html = '''                                <li>
                                    <strong>{name}</strong>
                                    <span class="machine-name">({machine})</span>
                                </li>'''.format(
                    name=staff["name"],
                    machine=staff["machine"]
                )
                staff_list.append(staff_html)
            value_html = '<ul class="staff-list">\n{}\n                            </ul>'.format('\n'.join(staff_list))
        else:
            value_html = item['value']

        html = '''                    <tr>
                        <th>{label}</th>
                        <td>{value}</td>
                    </tr>'''.format(
            label=item["label"],
            value=value_html
        )
        html_parts.append(html)

    return '\n'.join(html_parts)


def generate_history_html(history):
    """HISTORYのHTMLを生成"""
    html_parts = []
    for item in history:
        html = '''                    <tr>
                        <th>{date}</th>
                        <td>{description}</td>
                    </tr>'''.format(
            date=item["date"],
            description=item["description"]
        )
        html_parts.append(html)

    return '\n'.join(html_parts)


def update_html(filepath, section_id, content):
    """HTMLファイルを更新"""
    try:
        with io.open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()

        # 開始マーカーと終了マーカーの間のコンテンツを置換（シンプルで高速）
        begin_marker = '<!-- BEGIN: {} -->'.format(section_id)
        end_marker = '<!-- END: {} -->'.format(section_id)

        pattern = re.escape(begin_marker) + r'.*?' + re.escape(end_marker)
        replacement = '{}\n{}\n                {}'.format(begin_marker, content, end_marker)

        html = re.sub(pattern, replacement, html, flags=re.DOTALL)

        with io.open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)

        print('[OK] {} updated'.format(os.path.basename(filepath)))
        return True
    except Exception as e:
        print('Error updating {}: {}'.format(filepath, e))
        return False


def main():
    """メイン処理"""
    print('Building HTML files from JSON data...\n')

    # index.html - TOPICS
    topics = load_json('data/topics.json')
    if topics:
        topics_html = generate_topics_html(topics)
        update_html('src/index.html', 'topics', topics_html)

    # index.html - NEWS
    news = load_json('data/news.json')
    if news:
        news_html = generate_news_html(news)
        update_html('src/index.html', 'news', news_html)

    # events.html - EVENTS
    events = load_json('data/events.json')
    if events:
        events_html = generate_events_html(events)
        update_html('src/events.html', 'events', events_html)

    # about.html - COMPANY
    company = load_json('data/company.json')
    if company:
        company_html = generate_company_html(company)
        update_html('src/about.html', 'company', company_html)

    # about.html - HISTORY
    history = load_json('data/history.json')
    if history:
        history_html = generate_history_html(history)
        update_html('src/about.html', 'history', history_html)

    print('\nBuild completed!')


if __name__ == '__main__':
    main()
