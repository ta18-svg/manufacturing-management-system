---
name: phase-implementation
description: Implement exactly one phase of this manufacturing-management-system project (per system_design.md / CLAUDE.md phase plan) end-to-end — read the design docs, scope the target phase, implement backend/frontend/migration, rebuild and verify with Docker, then report in the project's fixed format. Use when the user says "Phase X を実装して", "次のフェーズ", "続き", or otherwise asks to implement/continue a numbered phase of this system.
---

# phase-implementation

Implements one phase of this project's 8-phase plan, the same way Phase 1 (基盤構築) was done: design check → scoped implementation → Docker build/up → real verification → fixed-format report. Full rationale and detail lives in [.skills/phase-implementation.md](../../../.skills/phase-implementation.md) — read it first.

## Inputs

- Which phase number to implement (ask the user if not stated).
- `system_design.md` and `CLAUDE.md` at the repo root — always read both before writing any code; they override anything else.
- Current repository state (`backend/app/`, `frontend/src/`, `alembic/versions/`) — check what already exists before adding files.

## Procedure

1. **Scope the phase.** From `system_design.md` section 18 (開発フェーズ計画) and `CLAUDE.md` section 14 (Phase別実装指示), extract exactly what the target phase covers: tables, API endpoints, screens. Do not implement anything from a later phase, even if it seems convenient to bundle. Do not skip anything the phase explicitly lists.
2. **Backend.** For each new feature area, create/extend `model.py` (SQLAlchemy) → `schema.py` (Pydantic) → `service.py` (business logic) → `router.py` (endpoints only, no business logic inline). Apply `get_current_user` to any endpoint that needs auth. Any DB schema change gets exactly one new Alembic migration file with both `upgrade()` and `downgrade()`; seed data (if the phase needs it) goes inside that migration via `bulk_insert`, not a separate ad-hoc script.
3. **Frontend.** Add `frontend/src/features/<feature>/` with types, an API module that calls the shared client in `lib/api`, and screen components. Every list screen uses TanStack Table with sort/filter/paging. No `any` types.
4. **Build and verify for real — do not skip this.**
   - `docker compose up -d --build`
   - If it fails, diagnose root cause (port conflict, stale DB volume with mismatched credentials, missing env var) rather than masking it. Only run `docker compose down -v` if the volume in question was created fresh during this same work session and holds no real data — never on a volume that might contain real data.
   - `curl http://localhost:8000/health`
   - `curl` every endpoint added this phase, including at least one auth-protected one, and check the actual response body.
   - Check the DB directly (`docker compose exec db mysql ...`) to confirm new tables/seed rows exist. If text looks garbled (`???`), re-check with `--default-character-set=utf8mb4` before concluding it's a real data problem.
5. **Report**, in this exact structure (matches CLAUDE.md §13/§2-output rules):

   ```text
   # 実装内容
   # 作成ファイル
   # 変更ファイル
   # 動作確認方法
   # 次フェーズ
   ```

   End with: `▶ 次へ進める場合は「続き」と出力する`

## Constraints (do not violate)

- One phase per invocation. Never implement multiple phases in one pass even if asked generally to "keep going" — confirm scope first if ambiguous.
- Never add a feature, table, or endpoint that isn't in `system_design.md` / `CLAUDE.md` for the target phase.
- Never leave a phase half-implemented — if blocked, say so explicitly rather than silently stopping partway.
- Never report completion without having actually run the verification commands in this session.
