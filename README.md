# 加工管理システム + 工具管理システム

マシニングセンタ加工向けの加工管理・工具管理Webシステム。
詳細な仕様は [system_design.md](system_design.md)、開発ルールは [CLAUDE.md](CLAUDE.md) を参照。

## Phase 1：共通基盤（実装済み）

Docker / FastAPI / React + TypeScript / MySQL / JWT認証 / ユーザー・権限の土台。

## セットアップ

```bash
cp .env.example .env   # 既に .env は作成済み（開発用の初期値）
docker compose up -d --build
```

## 動作確認

```bash
# Backend health check
curl http://localhost:8000/health

# Frontend
# ブラウザで http://localhost:3000 を開く

# DB
docker compose exec db mysql -u root -p

# DB一覧確認
SHOW DATABASES;
| Database                 |
+--------------------------+
| information_schema       |
| manufacturing_management |
| mysql                    |
| performance_schema       |
| sys                      |
+--------------------------+
# 使用DB選択
USE manufacturing_management;
# テーブル一覧確認
SHOW TABLES;
+------------------------------------+
| Tables_in_manufacturing_management |
+------------------------------------+
| alembic_version                    |
| roles                              |
| users                              |
+------------------------------------+
# usersテーブル確認
SELECT * FROM users;
```

### 初期ログインアカウント（開発用）

| メールアドレス | パスワード | 権限 |
|---|---|---|
| admin@example.com | Admin12345! | admin |

本番運用前に必ず変更すること。
