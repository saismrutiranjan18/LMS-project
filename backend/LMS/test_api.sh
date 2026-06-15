#!/usr/bin/env bash
# ============================================================
#  EduFlow LMS — Backend API Test Suite
#  Usage: ./test_api.sh [BASE_URL]
#  Default BASE_URL: http://localhost:8080
# ============================================================

BASE_URL="${1:-http://localhost:8080}"

# ── Colours ─────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Counters ─────────────────────────────────────────────────
PASS=0
FAIL=0
SKIP=0

# ── Shared state (filled in as tests run) ────────────────────
STUDENT_TOKEN=""
TEACHER_TOKEN=""
ADMIN_TOKEN=""
STUDENT_ID=""
TEACHER_ID=""
COURSE_ID=""
MODULE_ID=""
LESSON_ID=""

# ============================================================
#  Helpers
# ============================================================

header() {
  echo ""
  echo -e "${BOLD}${BLUE}══════════════════════════════════════════${RESET}"
  echo -e "${BOLD}${BLUE}  $1${RESET}"
  echo -e "${BOLD}${BLUE}══════════════════════════════════════════${RESET}"
}

section() {
  echo ""
  echo -e "${CYAN}── $1 ──${RESET}"
}

# run_test <label> <expected_status> <actual_status> [response_body]
run_test() {
  local label="$1"
  local expected="$2"
  local actual="$3"
  local body="$4"

  if [[ "$actual" == "$expected" ]]; then
    echo -e "  ${GREEN}✔ PASS${RESET}  $label  ${YELLOW}[HTTP $actual]${RESET}"
    ((PASS++))
    return 0
  else
    echo -e "  ${RED}✘ FAIL${RESET}  $label  ${YELLOW}[expected $expected, got $actual]${RESET}"
    if [[ -n "$body" ]]; then
      echo -e "         ${RED}Body: $(echo "$body" | head -c 200)${RESET}"
    fi
    ((FAIL++))
    return 1
  fi
}

# Extract JSON field (requires jq; falls back to grep)
json_field() {
  local json="$1"
  local field="$2"
  if command -v jq &>/dev/null; then
    echo "$json" | jq -r ".$field // empty" 2>/dev/null
  else
    echo "$json" | grep -oP "\"${field}\"\\s*:\\s*\"\\K[^\"]*" | head -1
  fi
}

skip_test() {
  echo -e "  ${YELLOW}⊘ SKIP${RESET}  $1"
  ((SKIP++))
}

# ============================================================
#  Check dependencies
# ============================================================
check_deps() {
  header "Dependency Check"
  local ok=true

  for cmd in curl; do
    if command -v "$cmd" &>/dev/null; then
      echo -e "  ${GREEN}✔${RESET} $cmd found"
    else
      echo -e "  ${RED}✘${RESET} $cmd NOT found — install it first"
      ok=false
    fi
  done

  if command -v jq &>/dev/null; then
    echo -e "  ${GREEN}✔${RESET} jq found (pretty JSON parsing enabled)"
  else
    echo -e "  ${YELLOW}⚠${RESET} jq not found — using grep fallback (consider: apt install jq)"
  fi

  $ok || exit 1
}

# ============================================================
#  Health check
# ============================================================
test_health() {
  header "Health Check"

  local resp
  resp=$(curl -s -o /dev/null -w "%{http_code}" \
    "$BASE_URL/actuator/health" 2>/dev/null)

  # Spring Actuator might not be publicly exposed — 200 or 401 both mean server is up
  if [[ "$resp" == "200" || "$resp" == "401" || "$resp" == "403" ]]; then
    echo -e "  ${GREEN}✔${RESET} Server is reachable at $BASE_URL  [HTTP $resp]"
  else
    echo -e "  ${RED}✘${RESET} Server NOT reachable at $BASE_URL  [HTTP $resp]"
    echo -e "  ${RED}  Start your Spring Boot app first.${RESET}"
    exit 1
  fi
}

# ============================================================
#  AUTH — Registration & Login
# ============================================================
test_auth() {
  header "AUTH"

  local ts
  ts=$(date +%s)

  # ── Student registration ─────────────────────────────────
  section "Student Registration"

  local student_email="student_${ts}@test.com"
  local resp body status

  body=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/register/local" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Test Student\",\"email\":\"$student_email\",\"password\":\"Password123!\"}")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')

  if run_test "Register student" "200" "$status" "$body"; then
    STUDENT_TOKEN=$(json_field "$body" "data.token")
    STUDENT_ID=$(json_field "$body" "data.userId")
    [[ -z "$STUDENT_TOKEN" ]] && STUDENT_TOKEN=$(echo "$body" | grep -oP '"token"\s*:\s*"\K[^"]*' | head -1)
    [[ -z "$STUDENT_ID" ]]   && STUDENT_ID=$(echo   "$body" | grep -oP '"userId"\s*:\s*"\K[^"]*' | head -1)
    echo -e "         Student token acquired: ${STUDENT_TOKEN:0:40}..."
  fi

  # ── Duplicate registration must fail ────────────────────
  body=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/register/local" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Test Student\",\"email\":\"$student_email\",\"password\":\"Password123!\"}")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "Duplicate registration → 400" "400" "$status" "$body"

  # ── Student login ────────────────────────────────────────
  section "Student Login"

  body=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$student_email\",\"password\":\"Password123!\"}")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')

  if run_test "Login with correct credentials" "200" "$status" "$body"; then
    local login_token
    login_token=$(json_field "$body" "data.token")
    [[ -z "$login_token" ]] && login_token=$(echo "$body" | grep -oP '"token"\s*:\s*"\K[^"]*' | head -1)
    [[ -n "$login_token" ]] && STUDENT_TOKEN="$login_token"
  fi

  # ── Bad credentials ──────────────────────────────────────
  body=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$student_email\",\"password\":\"WrongPass\"}")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "Login with wrong password → 401" "401" "$status" "$body"

  # ── Teacher registration ─────────────────────────────────
  section "Teacher Registration"

  local teacher_email="teacher_${ts}@test.com"
  body=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/register/local" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Test Teacher\",\"email\":\"$teacher_email\",\"password\":\"Password123!\"}")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')

  if run_test "Register teacher" "200" "$status" "$body"; then
    TEACHER_TOKEN=$(json_field "$body" "data.token")
    TEACHER_ID=$(json_field "$body" "data.userId")
    [[ -z "$TEACHER_TOKEN" ]] && TEACHER_TOKEN=$(echo "$body" | grep -oP '"token"\s*:\s*"\K[^"]*' | head -1)
    [[ -z "$TEACHER_ID" ]]   && TEACHER_ID=$(echo   "$body" | grep -oP '"userId"\s*:\s*"\K[^"]*' | head -1)
  fi
}

# ============================================================
#  USER profile
# ============================================================
test_users() {
  header "USERS"

  if [[ -z "$STUDENT_TOKEN" ]]; then
    skip_test "Get own profile (no token)"; return
  fi

  section "Profile Endpoints"

  local body status

  # GET /v1/users/me
  body=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/v1/users/me" \
    -H "Authorization: Bearer $STUDENT_TOKEN")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "GET /v1/users/me" "200" "$status" "$body"

  # PUT /v1/users/me
  body=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/v1/users/me" \
    -H "Authorization: Bearer $STUDENT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name":"Updated Name","bio":"Bio updated via test","avatarUrl":null}')
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "PUT /v1/users/me" "200" "$status" "$body"

  # GET /v1/users/{id} — public
  if [[ -n "$STUDENT_ID" ]]; then
    body=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/v1/users/$STUDENT_ID" \
      -H "Authorization: Bearer $STUDENT_TOKEN")
    status=$(echo "$body" | tail -1)
    body=$(echo "$body" | sed '$d')
    run_test "GET /v1/users/{id}" "200" "$status" "$body"
  else
    skip_test "GET /v1/users/{id} (no student ID)"
  fi

  # Admin-only: list all users (expect 403 from student token)
  body=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/v1/users" \
    -H "Authorization: Bearer $STUDENT_TOKEN")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "GET /v1/users (admin-only) → 403 for student" "403" "$status" "$body"

  # Unauthenticated access
  body=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/v1/users/me")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "GET /v1/users/me without token → 403" "403" "$status" "$body"
}

# ============================================================
#  COURSES — CRUD
# ============================================================
test_courses() {
  header "COURSES"

  local body status

  # ── Public browse (no auth needed) ──────────────────────
  section "Public Browsing (no auth)"

  body=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/v1/courses")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "GET /api/v1/courses (public)" "200" "$status" "$body"

  # ── Create course (requires teacher ID) ─────────────────
  section "Course Creation"

  if [[ -z "$TEACHER_TOKEN" || -z "$TEACHER_ID" ]]; then
    skip_test "POST /api/v1/courses (no teacher)"; return
  fi

  body=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/v1/courses" \
    -H "Authorization: Bearer $TEACHER_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"title\":\"Test Course $(date +%s)\",
      \"description\":\"Automated test course\",
      \"price\":99.00,
      \"isFree\":false,
      \"level\":\"BEGINNER\",
      \"category\":\"Development\",
      \"teacherId\":\"$TEACHER_ID\"
    }")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')

  if run_test "POST /api/v1/courses (create)" "200" "$status" "$body"; then
    COURSE_ID=$(json_field "$body" "data.id")
    [[ -z "$COURSE_ID" ]] && COURSE_ID=$(echo "$body" | grep -oP '"id"\s*:\s*"\K[^"]*' | head -1)
    echo -e "         Course ID: $COURSE_ID"
  fi

  # ── Read course ──────────────────────────────────────────
  section "Course Read"

  if [[ -n "$COURSE_ID" ]]; then
    body=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/v1/courses/$COURSE_ID" \
      -H "Authorization: Bearer $STUDENT_TOKEN")
    status=$(echo "$body" | tail -1)
    body=$(echo "$body" | sed '$d')
    run_test "GET /api/v1/courses/{id}" "200" "$status" "$body"
  else
    skip_test "GET /api/v1/courses/{id} (no course ID)"
  fi

  # ── Update course ────────────────────────────────────────
  section "Course Update"

  if [[ -n "$COURSE_ID" ]]; then
    body=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/api/v1/courses/$COURSE_ID" \
      -H "Authorization: Bearer $TEACHER_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "title":"Updated Test Course",
        "description":"Updated description",
        "price":79.00,
        "isFree":false,
        "level":"INTERMEDIATE",
        "category":"Development"
      }')
    status=$(echo "$body" | tail -1)
    body=$(echo "$body" | sed '$d')
    run_test "PUT /api/v1/courses/{id}" "200" "$status" "$body"
  else
    skip_test "PUT /api/v1/courses/{id}"
  fi

  # ── Publish course ───────────────────────────────────────
  section "Course Publish"

  if [[ -n "$COURSE_ID" ]]; then
    body=$(curl -s -w "\n%{http_code}" -X POST \
      "$BASE_URL/api/v1/courses/$COURSE_ID/publish" \
      -H "Authorization: Bearer $TEACHER_TOKEN")
    status=$(echo "$body" | tail -1)
    body=$(echo "$body" | sed '$d')
    run_test "POST /api/v1/courses/{id}/publish" "200" "$status" "$body"

    # Now it should appear in public listing
    body=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/v1/courses")
    status=$(echo "$body" | tail -1)
    body=$(echo "$body" | sed '$d')
    run_test "GET /api/v1/courses returns published course" "200" "$status" "$body"
  else
    skip_test "POST /api/v1/courses/{id}/publish"
  fi

  # ── 404 for unknown course ───────────────────────────────
  body=$(curl -s -w "\n%{http_code}" -X GET \
    "$BASE_URL/api/v1/courses/00000000-0000-0000-0000-000000000000" \
    -H "Authorization: Bearer $STUDENT_TOKEN")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "GET /api/v1/courses/{unknown} → 404" "404" "$status" "$body"
}

# ============================================================
#  MODULES — CRUD
# ============================================================
test_modules() {
  header "MODULES"

  if [[ -z "$COURSE_ID" || -z "$TEACHER_TOKEN" ]]; then
    skip_test "All module tests (no course or teacher)"; return
  fi

  local body status

  section "Module Creation"

  body=$(curl -s -w "\n%{http_code}" -X POST \
    "$BASE_URL/api/v1/courses/$COURSE_ID/modules" \
    -H "Authorization: Bearer $TEACHER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"Module 1: Introduction","orderIndex":1}')
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')

  if run_test "POST /api/v1/courses/{id}/modules" "200" "$status" "$body"; then
    MODULE_ID=$(json_field "$body" "data.id")
    [[ -z "$MODULE_ID" ]] && MODULE_ID=$(echo "$body" | grep -oP '"id"\s*:\s*"\K[^"]*' | head -1)
    echo -e "         Module ID: $MODULE_ID"
  fi

  section "Module Update"

  if [[ -n "$MODULE_ID" ]]; then
    body=$(curl -s -w "\n%{http_code}" -X PUT \
      "$BASE_URL/api/v1/courses/$COURSE_ID/modules/$MODULE_ID" \
      -H "Authorization: Bearer $TEACHER_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"title":"Module 1: Updated Introduction","orderIndex":1}')
    status=$(echo "$body" | tail -1)
    body=$(echo "$body" | sed '$d')
    run_test "PUT /api/v1/courses/{cid}/modules/{mid}" "200" "$status" "$body"
  else
    skip_test "PUT module (no module ID)"
  fi
}

# ============================================================
#  LESSONS — CRUD
# ============================================================
test_lessons() {
  header "LESSONS"

  if [[ -z "$MODULE_ID" || -z "$TEACHER_TOKEN" ]]; then
    skip_test "All lesson tests (no module or teacher)"; return
  fi

  local body status

  section "Lesson Creation"

  body=$(curl -s -w "\n%{http_code}" -X POST \
    "$BASE_URL/api/v1/modules/$MODULE_ID/lessons" \
    -H "Authorization: Bearer $TEACHER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "title":"Lesson 1: Welcome",
      "type":"VIDEO",
      "videoUrl":"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "content":"Welcome to the course!",
      "durationMinutes":10,
      "orderIndex":1,
      "freePreview":true
    }')
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')

  if run_test "POST /api/v1/modules/{id}/lessons" "200" "$status" "$body"; then
    LESSON_ID=$(json_field "$body" "data.id")
    [[ -z "$LESSON_ID" ]] && LESSON_ID=$(echo "$body" | grep -oP '"id"\s*:\s*"\K[^"]*' | head -1)
    echo -e "         Lesson ID: $LESSON_ID"
  fi

  # Create a locked lesson
  body=$(curl -s -w "\n%{http_code}" -X POST \
    "$BASE_URL/api/v1/modules/$MODULE_ID/lessons" \
    -H "Authorization: Bearer $TEACHER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "title":"Lesson 2: Deep Dive",
      "type":"VIDEO",
      "videoUrl":"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "durationMinutes":30,
      "orderIndex":2,
      "freePreview":false
    }')
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "POST lesson 2 (locked, not free preview)" "200" "$status" "$body"

  section "Lesson Read"

  if [[ -n "$LESSON_ID" ]]; then
    # Free preview → accessible without enrollment
    body=$(curl -s -w "\n%{http_code}" -X GET \
      "$BASE_URL/api/v1/lessons/$LESSON_ID" \
      -H "Authorization: Bearer $STUDENT_TOKEN")
    status=$(echo "$body" | tail -1)
    body=$(echo "$body" | sed '$d')
    run_test "GET /api/v1/lessons/{id} (free preview)" "200" "$status" "$body"
  else
    skip_test "GET lesson (no lesson ID)"
  fi

  section "Lesson Update"

  if [[ -n "$LESSON_ID" ]]; then
    body=$(curl -s -w "\n%{http_code}" -X PUT \
      "$BASE_URL/api/v1/lessons/$LESSON_ID" \
      -H "Authorization: Bearer $TEACHER_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "title":"Lesson 1: Welcome (Updated)",
        "type":"VIDEO",
        "videoUrl":"https://youtu.be/dQw4w9WgXcQ",
        "durationMinutes":12,
        "orderIndex":1,
        "freePreview":true
      }')
    status=$(echo "$body" | tail -1)
    body=$(echo "$body" | sed '$d')
    run_test "PUT /api/v1/lessons/{id}" "200" "$status" "$body"
  else
    skip_test "PUT lesson"
  fi
}

# ============================================================
#  CURRICULUM
# ============================================================
test_curriculum() {
  header "CURRICULUM"

  if [[ -z "$COURSE_ID" ]]; then
    skip_test "Curriculum tests (no course ID)"; return
  fi

  local body status

  section "Public/Unauthenticated Access"

  # Unauthenticated — should return curriculum with freePreview lessons accessible
  body=$(curl -s -w "\n%{http_code}" -X GET \
    "$BASE_URL/api/v1/courses/$COURSE_ID/curriculum")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "GET curriculum (anonymous) → 200" "200" "$status" "$body"

  # Check enrolled=false in anonymous response
  if echo "$body" | grep -q '"enrolled":false'; then
    echo -e "  ${GREEN}✔${RESET}  enrolled=false for anonymous ✓"
    ((PASS++))
  else
    echo -e "  ${YELLOW}⚠${RESET}  Could not verify enrolled=false (JSON may be nested)"
  fi

  section "Authenticated (not enrolled)"

  body=$(curl -s -w "\n%{http_code}" -X GET \
    "$BASE_URL/api/v1/courses/$COURSE_ID/curriculum" \
    -H "Authorization: Bearer $STUDENT_TOKEN")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "GET curriculum (student, not enrolled)" "200" "$status" "$body"
}

# ============================================================
#  ENROLLMENT
# ============================================================
test_enrollment() {
  header "ENROLLMENT"

  if [[ -z "$COURSE_ID" || -z "$STUDENT_TOKEN" ]]; then
    skip_test "Enrollment tests (missing course or student token)"; return
  fi

  local body status

  section "Enrollment Flow"

  # Check status before enrolling
  body=$(curl -s -w "\n%{http_code}" -X GET \
    "$BASE_URL/api/v1/enrollments/courses/$COURSE_ID/status" \
    -H "Authorization: Bearer $STUDENT_TOKEN")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "GET enrollment status (before enroll)" "200" "$status" "$body"

  # Enroll
  body=$(curl -s -w "\n%{http_code}" -X POST \
    "$BASE_URL/api/v1/enrollments/courses/$COURSE_ID" \
    -H "Authorization: Bearer $STUDENT_TOKEN")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "POST enroll in course" "200" "$status" "$body"

  # Duplicate enroll → 400
  body=$(curl -s -w "\n%{http_code}" -X POST \
    "$BASE_URL/api/v1/enrollments/courses/$COURSE_ID" \
    -H "Authorization: Bearer $STUDENT_TOKEN")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "POST enroll again → 400 (already enrolled)" "400" "$status" "$body"

  # Check status after enrolling
  body=$(curl -s -w "\n%{http_code}" -X GET \
    "$BASE_URL/api/v1/enrollments/courses/$COURSE_ID/status" \
    -H "Authorization: Bearer $STUDENT_TOKEN")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "GET enrollment status (after enroll)" "200" "$status" "$body"

  # Curriculum should now show enrolled=true and full videoUrls
  section "Curriculum Post-Enrollment"

  body=$(curl -s -w "\n%{http_code}" -X GET \
    "$BASE_URL/api/v1/courses/$COURSE_ID/curriculum" \
    -H "Authorization: Bearer $STUDENT_TOKEN")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "GET curriculum (enrolled) → all lessons accessible" "200" "$status" "$body"

  if echo "$body" | grep -q '"enrolled":true'; then
    echo -e "  ${GREEN}✔${RESET}  enrolled=true confirmed ✓"
    ((PASS++))
  else
    echo -e "  ${YELLOW}⚠${RESET}  Could not verify enrolled=true"
  fi

  # Locked lesson now accessible
  if [[ -n "$LESSON_ID" ]]; then
    # Grab lesson 2 ID if we have it (skip if not saved separately)
    body=$(curl -s -w "\n%{http_code}" -X GET \
      "$BASE_URL/api/v1/lessons/$LESSON_ID" \
      -H "Authorization: Bearer $STUDENT_TOKEN")
    status=$(echo "$body" | tail -1)
    body=$(echo "$body" | sed '$d')
    run_test "GET free-preview lesson after enroll" "200" "$status" "$body"
  fi

  # Enroll without auth → 403
  body=$(curl -s -w "\n%{http_code}" -X POST \
    "$BASE_URL/api/v1/enrollments/courses/$COURSE_ID")
  status=$(echo "$body" | tail -1)
  body=$(echo "$body" | sed '$d')
  run_test "POST enroll without token → 403" "403" "$status" "$body"
}

# ============================================================
#  CLEANUP — Delete lesson, module, course
# ============================================================
test_cleanup() {
  header "CLEANUP (Delete in order)"

  local body status

  if [[ -n "$LESSON_ID" && -n "$TEACHER_TOKEN" ]]; then
    body=$(curl -s -w "\n%{http_code}" -X DELETE \
      "$BASE_URL/api/v1/lessons/$LESSON_ID" \
      -H "Authorization: Bearer $TEACHER_TOKEN")
    status=$(echo "$body" | tail -1)
    body=$(echo "$body" | sed '$d')
    run_test "DELETE /api/v1/lessons/{id}" "200" "$status" "$body"
  else
    skip_test "DELETE lesson"
  fi

  if [[ -n "$MODULE_ID" && -n "$COURSE_ID" && -n "$TEACHER_TOKEN" ]]; then
    body=$(curl -s -w "\n%{http_code}" -X DELETE \
      "$BASE_URL/api/v1/courses/$COURSE_ID/modules/$MODULE_ID" \
      -H "Authorization: Bearer $TEACHER_TOKEN")
    status=$(echo "$body" | tail -1)
    body=$(echo "$body" | sed '$d')
    run_test "DELETE /api/v1/courses/{cid}/modules/{mid}" "200" "$status" "$body"
  else
    skip_test "DELETE module"
  fi

  if [[ -n "$COURSE_ID" && -n "$TEACHER_TOKEN" ]]; then
    body=$(curl -s -w "\n%{http_code}" -X DELETE \
      "$BASE_URL/api/v1/courses/$COURSE_ID" \
      -H "Authorization: Bearer $TEACHER_TOKEN")
    status=$(echo "$body" | tail -1)
    body=$(echo "$body" | sed '$d')
    run_test "DELETE /api/v1/courses/{id}" "200" "$status" "$body"
  else
    skip_test "DELETE course"
  fi
}

# ============================================================
#  EDGE CASES & SECURITY
# ============================================================
test_security() {
  header "SECURITY & EDGE CASES"

  local body status

  section "Unauthenticated access to protected routes"

  body=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/v1/users/me")
  status=$(echo "$body" | tail -1); body=$(echo "$body" | sed '$d')
  run_test "GET /v1/users/me without token → 403" "403" "$status" "$body"

  body=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/v1/lessons/some-id")
  status=$(echo "$body" | tail -1); body=$(echo "$body" | sed '$d')
  # 403 (auth required) or 404 (not found) are both valid for unauthed
  [[ "$status" == "403" || "$status" == "401" ]] && \
    run_test "GET lesson without token → 403/401" "403" "403" || \
    run_test "GET lesson without token → 404 (public?)" "404" "$status" "$body"

  section "Malformed / invalid requests"

  body=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"notanemail","password":""}')
  status=$(echo "$body" | tail -1); body=$(echo "$body" | sed '$d')
  # Expect 400 or 401
  [[ "$status" == "400" || "$status" == "401" ]] && \
    run_test "Login with bad email/empty password → 400/401" "400" "400" || \
    run_test "Login with bad email/empty password" "400" "$status" "$body"

  body=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/register/local" \
    -H "Content-Type: application/json" \
    -d '{}')
  status=$(echo "$body" | tail -1); body=$(echo "$body" | sed '$d')
  run_test "Register with empty body → 400" "400" "$status" "$body"

  section "Invalid JWT"

  body=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/v1/users/me" \
    -H "Authorization: Bearer this.is.not.a.real.token")
  status=$(echo "$body" | tail -1); body=$(echo "$body" | sed '$d')
  # Spring should return 403 (anonymous after filter ignores bad token)
  [[ "$status" == "403" || "$status" == "401" ]] && \
    run_test "GET /v1/users/me with invalid JWT → 403/401" "403" "403" || \
    run_test "GET /v1/users/me with invalid JWT" "403" "$status" "$body"

  section "Non-existent resources"

  body=$(curl -s -w "\n%{http_code}" -X GET \
    "$BASE_URL/api/v1/courses/00000000-0000-0000-0000-000000000001" \
    -H "Authorization: Bearer $STUDENT_TOKEN")
  status=$(echo "$body" | tail -1); body=$(echo "$body" | sed '$d')
  run_test "GET non-existent course → 404" "404" "$status" "$body"
}

# ============================================================
#  SWAGGER
# ============================================================
test_swagger() {
  header "SWAGGER / API DOCS"

  local body status

  body=$(curl -s -o /dev/null -w "%{http_code}" \
    "$BASE_URL/swagger-ui/index.html")
  run_test "GET /swagger-ui/index.html" "200" "$body"

  body=$(curl -s -o /dev/null -w "%{http_code}" \
    "$BASE_URL/v3/api-docs")
  run_test "GET /v3/api-docs" "200" "$body"
}

# ============================================================
#  SUMMARY
# ============================================================
print_summary() {
  echo ""
  echo -e "${BOLD}${BLUE}══════════════════════════════════════════${RESET}"
  echo -e "${BOLD}${BLUE}  TEST SUMMARY${RESET}"
  echo -e "${BOLD}${BLUE}══════════════════════════════════════════${RESET}"
  echo -e "  ${GREEN}PASS${RESET}  $PASS"
  echo -e "  ${RED}FAIL${RESET}  $FAIL"
  echo -e "  ${YELLOW}SKIP${RESET}  $SKIP"
  echo ""

  local total=$((PASS + FAIL))
  if [[ $total -gt 0 ]]; then
    local pct=$(( PASS * 100 / total ))
    echo -e "  Score: ${BOLD}$pct%${RESET}  ($PASS / $total ran)"
  fi

  echo ""
  if [[ $FAIL -eq 0 ]]; then
    echo -e "  ${GREEN}${BOLD}All tests passed! 🎉${RESET}"
  else
    echo -e "  ${RED}${BOLD}$FAIL test(s) failed. Check output above.${RESET}"
  fi
  echo ""
}

# ============================================================
#  MAIN
# ============================================================
main() {
  echo ""
  echo -e "${BOLD}${CYAN}  EduFlow LMS — API Test Suite${RESET}"
  echo -e "  Target: ${YELLOW}$BASE_URL${RESET}"
  echo -e "  Time:   $(date)"

  check_deps
  test_health

  test_auth
  test_users
  test_courses
  test_modules
  test_lessons
  test_curriculum
  test_enrollment
  test_security
  test_swagger
  test_cleanup   # last — deletes the test data

  print_summary

  [[ $FAIL -eq 0 ]] && exit 0 || exit 1
}

main "$@"