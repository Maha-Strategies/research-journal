#!/usr/bin/env bash
# Apply the private Atlas Builder schema to a database owned by another
# application. This is intentionally separate from `supabase db push`: the
# target has an established, unrelated migration ledger that this repository
# must not repair, replace, or pretend to own.
#
# All Builder migrations run inside one transaction. If any statement fails,
# Postgres rolls back the entire integration and leaves the host schema intact.

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
temporary_sql="$(mktemp "${TMPDIR:-/tmp}/atlas-builder-integration.XXXXXX.sql")"

cleanup() {
  rm -f "$temporary_sql"
}
trap cleanup EXIT

{
  printf '%s\n' 'begin;'
  for migration in "$project_root"/supabase/migrations/000[1-7]_*.sql; do
    printf '\n-- BEGIN %s\n' "$(basename "$migration")"
    cat "$migration"
    printf '\n-- END %s\n' "$(basename "$migration")"
  done
  printf '%s\n' 'commit;'
} > "$temporary_sql"

supabase db query --linked --file "$temporary_sql"
