#!/usr/bin/env bash
# Stress-test script for eStatya API
# Usage: ./stress_test.sh [BASE_URL] [CONCURRENCY] [TOTAL_REQUESTS]

BASE_URL="${1:-http://localhost}"
CONCURRENCY="${2:-50}"
TOTAL="${3:-1000}"

ENDPOINTS=(
  "/api/v1/error"
  "/api/v1/"
  "/api/v1/health"
)

PER_ENDPOINT=$((TOTAL / ${#ENDPOINTS[@]}))

echo "============================================"
echo "  eStatya API Stress Test"
echo "============================================"
echo "  Base URL:     $BASE_URL"
echo "  Concurrency:  $CONCURRENCY parallel requests"
echo "  Total:        $TOTAL requests ($PER_ENDPOINT per endpoint)"
echo "============================================"
echo ""

fire_requests() {
  local url="$1"
  local count="$2"
  local concurrent="$3"

  echo ">>> $url — $count requests, $concurrent concurrent"

  local start_time
  start_time=$(date +%s%N)

  local success=0
  local fail=0
  local status_counts=""

  # xargs runs $concurrent curls in parallel
  status_counts=$(seq 1 "$count" \
    | xargs -P "$concurrent" -I{} \
        curl -s -o /dev/null -w "%{http_code}\n" "$url" 2>/dev/null)

  local end_time
  end_time=$(date +%s%N)
  local elapsed_ms=$(( (end_time - start_time) / 1000000 ))
  local elapsed_s
  elapsed_s=$(awk "BEGIN{printf \"%.2f\", $elapsed_ms/1000}")

  success=$(echo "$status_counts" | grep -c '^2..')
  fail=$(echo "$status_counts" | grep -vc '^2..')

  local rps
  rps=$(awk "BEGIN{printf \"%.1f\", $count / ($elapsed_ms/1000)}")

  echo "    Time: ${elapsed_s}s | RPS: ${rps} | OK: ${success} | Fail: ${fail}"

  # Show status code breakdown
  echo -n "    Status codes: "
  echo "$status_counts" | sort | uniq -c | sort -rn \
    | awk '{printf "%s×%s  ", $1, $2}' 
  echo ""
  echo ""
}

for ep in "${ENDPOINTS[@]}"; do
  fire_requests "${BASE_URL}${ep}" "$PER_ENDPOINT" "$CONCURRENCY"
done

echo "============================================"
echo "  Done!"
echo "============================================"
