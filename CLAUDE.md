# 加工管理システム + 工具管理システム 開発ルール

## 1. プロジェクト概要

本プロジェクトは、マシニングセンタ加工を対象とした製造業向けWeb業務システムである。

目的は以下の2つ。

1. 加工管理システムの構築
2. 工具管理システムの構築

将来的にはMESまで拡張できる構成にする。

---

## 2. 開発方針

- MVPを優先する
- 一度に全機能を実装しない
- 必ずフェーズ単位で実装する
- 各フェーズは動作確認可能な単位にする
- 共通ログイン基盤を最初に実装する
- 加工管理と工具管理は同一リポジトリで管理する
- 実装前に必ず既存ファイルを確認する
- 既存コードを壊さない
- 未完成コードで止めない

---

## 3. 使用技術

| 区分 | 技術 |
|---|---|
| Frontend | React + TypeScript |
| UI | TanStack Table |
| Backend | FastAPI |
| Database | MySQL |
| ORM | SQLAlchemy |
| API | REST API |
| 認証 | JWT |
| 開発環境 | Docker / Docker Compose |

---

## Skills利用方針

本プロジェクトは9 Skills構成を採用する。

.skills配下に配置されたSkillを参照すること。

project-manager
system-architect
database-designer
backend-api
frontend-ui
csv-import-export
manufacturing-domain
test-and-review
phase-implementation

各フェーズの実装作業そのもの(設計確認→対象フェーズ実装→Docker起動→動作確認→定型レポート報告)は phase-implementation の手順に従う。

実装時は担当Skillの責務を優先する。

---

## 4. 実装ルール

### 4.1 共通ルール

- 1回の作業では1フェーズのみ実装する
- 変更ファイルを明示する
- 実装後に動作確認方法を出力する
- エラーが出た場合は原因と修正方針を説明する
- DB変更時はマイグレーション方針を明示する
- 型定義を省略しない
- APIレスポンス形式を統一する

---

### 4.2 フェーズ分割ルール

Claude Codeは以下の順番で実装する。

```text
Phase 1：基盤構築
Phase 2：加工管理MVP
Phase 3：工具管理MVP
Phase 4：実績管理
Phase 5：CSV対応
Phase 6：実務導入改善
Phase 7：将来拡張準備
Phase 8：MES拡張
```

各フェーズの最後には必ず以下を出力する。

```text
実装内容
変更ファイル
動作確認方法
次フェーズで実装する内容
```

---

## 5. 禁止事項

- 一度に全フェーズを実装しない
- 設計書にない機能を勝手に追加しない
- 加工管理と工具管理を別リポジトリに分けない
- 共通ログイン基盤を後回しにしない
- DBテーブル名を途中で変更しない
- APIエンドポイントを無断で変更しない
- UIライブラリを勝手に変更しない
- TanStack Table以外で一覧画面を作らない
- 未完成コードで終了しない
- 動作確認方法なしで終了しない

---

## 6. コーディング規約

### 6.1 Backend

- Pythonは型ヒントを使用する
- FastAPIのrouterを機能別に分ける
- DBモデルはSQLAlchemyで定義する
- Pydantic schemaを必ず作成する
- ビジネスロジックはservice層に分離する
- APIレスポンスは一貫した形式にする
- 認証が必要なAPIにはcurrent_userを適用する

---

### 6.2 Frontend

- TypeScriptを使用する
- any型を乱用しない
- 一覧画面はTanStack Tableを使用する
- componentsとfeaturesを分ける
- API通信処理はlib/apiに集約する
- 型定義はtypesまたはfeature内に配置する
- フォームは入力チェックを行う

---

## 7. ディレクトリ方針

### 7.1 全体構成

```text
manufacturing-management-system/
├── backend/
├── frontend/
├── docs/
├── docker-compose.yml
├── README.md
├── system_design.md
└── CLAUDE.md
```

---

### 7.2 Backend構成

```text
backend/
├── app/
│   ├── main.py
│   ├── core/
│   ├── auth/
│   ├── users/
│   ├── machining/
│   ├── tools/
│   ├── csv/
│   └── tests/
├── requirements.txt
└── Dockerfile
```

---

### 7.3 Frontend構成

```text
frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── machining/
│   │   ├── tools/
│   │   └── csv/
│   ├── lib/
│   └── types/
├── package.json
└── Dockerfile
```

---

## 8. DB設計方針

- MySQLを使用する
- テーブル名はスネークケース複数形にする
- 主キーはidに統一する
- 外部キーは`xxx_id`形式にする
- 作成日時は`created_at`
- 更新日時は`updated_at`
- 削除は原則論理削除を優先する
- マスタ系には`is_active`を持たせる
- 加工実績・工具使用実績は履歴として残す
- CSV取込ログを保存する

---

## 9. API設計方針

- REST APIで設計する
- URLは複数形を基本とする
- 認証APIは`/api/auth`
- 加工管理APIは`/api/machining`
- 工具管理APIは`/api/tools`
- CSV取込APIは`/api/csv`または各機能配下に配置する
- 作成はPOST
- 取得はGET
- 更新はPUTまたはPATCH
- 削除はDELETE
- CSV出力は`/export`
- CSV取込は`/import`

---

## 10. フロントエンド実装方針

### 10.1 画面方針

- PC画面を優先する
- 一覧画面はExcel風UIにする
- 表示件数を多く扱える構成にする
- 横スクロールを許容する
- 列幅調整を考慮する
- 検索・フィルタ・並び替えを重視する

---

### 10.2 TanStack Table方針

一覧画面では以下を標準実装する。

- ソート
- フィルタ
- ページング
- 行選択
- 列表示制御
- CSV出力ボタン
- 詳細画面へのリンク

---

## 11. バックエンド実装方針

### 11.1 FastAPI方針

- `main.py`ではrouter登録のみ行う
- 各機能ごとにrouterを分ける
- DB処理をrouterに直接書きすぎない
- service層に業務ロジックを置く
- schema層で入出力を定義する

---

### 11.2 認証方針

- JWT認証を使用する
- パスワードはハッシュ化する
- ログインユーザー情報は`/api/auth/me`で取得する
- 権限チェックを共通化する

---

## 12. 動作確認ルール

各フェーズ完了後、必ず以下を確認する。

```bash
docker compose up -d --build
```

Backend確認：

```bash
curl http://localhost:8000/health
```

Frontend確認：

```text
http://localhost:3000
```

DB確認：

```bash
docker compose exec db mysql -u root -p
```

---

## 13. Claude Codeへの作業指示ルール

Claude Codeに作業させる場合は、以下の形式で指示する。

```text
system_design.md と CLAUDE.md を読んでください。

今回は Phase X のみ実装してください。
一度に全フェーズを実装しないでください。

実装後、以下を出力してください。

1. 実装内容
2. 変更ファイル
3. 動作確認方法
4. 次フェーズの予定
```

---

## 14. Phase別実装指示

### Phase 1：基盤構築

目的：

- Docker環境を作る
- FastAPIを起動する
- Reactを起動する
- MySQLに接続する
- 共通ログインを作る
- ユーザー管理の土台を作る

実装対象：

- docker-compose.yml
- backend Dockerfile
- frontend Dockerfile
- FastAPI health check
- MySQL接続設定
- usersテーブル
- rolesテーブル
- JWTログインAPI
- ログイン画面

---

### Phase 2：加工管理MVP

目的：

- 加工依頼を登録・一覧表示できるようにする
- 工程を管理できるようにする
- 進捗更新できるようにする

実装対象：

- machining_requests
- machining_processes
- 加工依頼API
- 工程API
- 加工依頼一覧画面
- 加工依頼登録画面
- 工程管理画面

---

### Phase 3：工具管理MVP

目的：

- 工具・ホルダー・インサートを管理できるようにする

実装対象：

- tools
- holders
- inserts
- 工具API
- ホルダーAPI
- インサートAPI
- 工具一覧画面
- ホルダー一覧画面
- インサート一覧画面

---

### Phase 4：実績管理

目的：

- 加工実績を手入力できるようにする
- 工具使用実績を記録できるようにする
- 工具寿命を更新できるようにする

実装対象：

- machining_results
- tool_usages
- tool_life_statuses
- 加工実績API
- 工具使用実績API
- 工具寿命更新処理
- 加工実績入力画面

---

### Phase 5：CSV対応

目的：

- 加工実績CSV取込
- CSV出力
- CSV取込ログ保存

実装対象：

- csv_import_logs
- CSV取込API
- CSV出力API
- CSV取込画面
- CSVエラー表示

---

### Phase 6：実務導入改善

目的：

- 実工場で使いやすいように改善する

実装対象：

- 検索
- 詳細フィルタ
- 権限チェック強化
- 監査ログ
- エラーハンドリング
- 入力補助

---

### Phase 7：将来拡張準備

目的：

- CAMWorks連携
- 設備連携
- QRコード
- タブレット利用の準備

実装対象：

- 外部連携用interface
- import/export拡張
- QRコード用ID設計
- タブレット用レスポンシブ下準備

---

### Phase 8：MES拡張

目的：

- MES化に向けた機能拡張

実装対象：

- 作業指示管理
- 設備稼働管理
- 品質検査管理
- トレーサビリティ
- 原価管理

