# コンテンツ更新方法

このサイトは、JSONファイルからHTMLを自動生成する仕組みを採用しています。
HTMLファイルを直接編集せず、JSONファイルを編集してビルドスクリプトを実行してください。

## 📁 ファイル構成

```
sakanakaVillage/
├── data/                    # コンテンツデータ（ここを編集します）
│   ├── topics.json         # index.html - TOPICS
│   ├── news.json           # index.html - NEWS
│   ├── events.json         # events.html - 大会情報
│   ├── company.json        # about.html - 施設概要
│   └── history.json        # about.html - 沿革
├── build.py                # ビルドスクリプト（Python版）
├── build.bat               # ビルドスクリプト（Windows用）
├── README_BUILD.md         # このファイル
└── src/                    # 公開ファイル（Webサーバーにアップロード）
    ├── index.html
    ├── events.html
    ├── about.html
    ├── style.css
    ├── script.js
    ├── images/
    ├── events/            # 大会PDF
    └── ...
```

**ポイント:**
- `data/` - コンテンツのソース（JSON形式）
- `build.py`, `build.bat` - ビルドツール
- `src/` - 生成された公開ファイル（このフォルダだけをWebサーバーにアップロード）

## 🔨 使い方

### Windows の場合（推奨）

1. `data/` フォルダ内の該当するJSONファイルを編集
2. **`build.bat` をダブルクリック**で実行
3. 完了！HTMLが自動的に更新されます

### コマンドラインから実行する場合

```bash
python build.py
```

または

```bash
python3 build.py
```

## 📝 各JSONファイルの編集方法

### 1. topics.json（TOPICSカード）

```json
[
  {
    "icon": "two_wheeler",           // Material Iconsのアイコン名
    "title": "レンタルバイクあり",
    "description": "GASGAS TXT-PRO 280をご用意<br>手ぶらで来て1日中楽しめます！",
    "highlight": true,                // 注目カードにする場合
    "badge": "注目!"                  // バッジテキスト（オプション）
  }
]
```

### 2. news.json（ニュース記事）

```json
[
  {
    "date": "2025.12.11",
    "title": "ホームページリニューアル！",
    "description": "坂中村トライアルランドの公式サイトをリニューアルしました！"
  }
]
```

### 3. events.json（大会情報）

```json
[
  {
    "date": "2023/11/12",
    "name": "SAKANAKA VILLAGEオープン記念",
    "pdf": "events/taikai1.pdf",
    "videoId": "pD7AAttA6CY"          // YouTubeのビデオID
  }
]
```

### 4. company.json（施設概要）

```json
[
  {
    "label": "施設名",
    "value": "坂中村トライアルランド (SAKANAKA VILLAGE)"
  },
  {
    "label": "管理者",
    "value": [                         // 配列の場合はリスト表示
      {
        "name": "中村 篤",
        "machine": "TRS XTRAC RR-E 250"
      }
    ]
  }
]
```

### 5. history.json（沿革）

```json
[
  {
    "date": "2023年9月",
    "description": "笹藪荒れ地を開拓<br>地名\"坂中\"とオーナー中村氏の名前から坂中村トライアルランドと命名"
  }
]
```

## ⚠️ 注意事項

- `src/`内のHTMLファイルの `<!-- BEGIN: xxx -->` と `<!-- END: xxx -->` のコメントは**削除しないでください**（ビルドスクリプトの目印です）
- `src/`内のHTMLファイルは直接編集しないでください（ビルド時に上書きされます）
- JSONファイルは必ずUTF-8エンコーディングで保存してください
- JSONの文法エラーがあるとビルドが失敗します（カンマ、括弧の位置に注意）
- 改行を入れたい場合は `<br>` タグを使用してください

## 💡 SEO対策について

このビルド方式により、以下のSEO上の利点があります：

✅ 検索エンジンがコンテンツを正しくインデックス
✅ ページの初期表示が高速
✅ SNSシェア時にコンテンツが正しく表示
✅ JavaScriptがオフでも表示可能

## 🚀 デプロイ（公開）方法

ビルドが完了したら、**`src/`フォルダの中身だけ**をWebサーバーにアップロードしてください。

```
アップロードするもの: src/ の中身全て
- index.html
- events.html
- about.html
- images/
- events/
- style.css
- script.js
- など

アップロードしないもの:
- data/（ソースファイル）
- build.py, build.bat（ビルドツール）
- README_BUILD.md
```

**重要:** `data/`, `build.py`, `build.bat` はWebサーバーにアップロードする必要はありません。これらは開発時にのみ使用します。

## 🐛 トラブルシューティング

### ビルドが失敗する場合

1. JSONファイルの文法が正しいか確認（[JSONLint](https://jsonlint.com/)で検証可能）
2. Python 3がインストールされているか確認（`python --version` で確認）
3. ファイルがUTF-8で保存されているか確認

### HTMLが更新されない場合

- ブラウザのキャッシュをクリアしてページをリロード（Ctrl + F5）

## 📞 サポート

問題が解決しない場合は、開発者に連絡してください。
