# Tasks: Fix Issues and Complete Incomplete Flows

**Input**: Design documents from `/specs/001-fix-issues-complete-flows/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested — test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `FlaskSite/` (api/, controllers/, services/, models/, forms/)
- **Frontend**: `client/src/` (components/, api/, services/, utils/)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Configure logging infrastructure to replace debug prints (needed across all stories)

- [X] T001 Add Python logging configuration to FlaskSite/__init__.py (import logging, set up app logger with appropriate levels for dev/prod)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Fix shared validation and constraints that multiple user stories depend on

**CRITICAL**: These fixes affect the data layer and auth layer used by all user stories.

- [X] T002 [P] Enforce topic_id as required in info creation — update FlaskSite/controllers/info_controller.py to reject requests where topic_id is None (return 400)
- [X] T003 [P] Add DataRequired() validator to NewTopic.Name field in FlaskSite/forms/info_forms.py (line 39)
- [X] T004 [P] Add circular reference check helper to FlaskSite/controllers/topic_controller.py — walk parent chain before creating/updating topic with parent_topic_id, reject with 400 if cycle detected

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 — Secure Topic Deletion (Priority: P1) MVP

**Goal**: Protect the topic delete endpoint with JWT authentication and ownership verification so only topic owners can delete their topics.

**Independent Test**: Attempt to delete a topic belonging to another user → expect 403. Delete own topic → expect 200 with topic removed.

### Implementation for User Story 1

- [X] T005 [US1] Add delete_topic() method to FlaskSite/services/topic_service.py — accept user_id and topic_id, verify topic exists and user_id matches topic.user_id, delete and commit, return success/failure
- [X] T006 [US1] Add delete_topic() controller method to FlaskSite/controllers/topic_controller.py — call topic_service.delete_topic(), return 200 on success, 403 if not owner, 404 if not found
- [X] T007 [US1] Secure the POST /api/v1/delete endpoint in FlaskSite/api/v1/topic.py — add @jwt_required() decorator, extract user_id via get_jwt_identity(), route through topic_controller.delete_topic() instead of direct DB access

**Checkpoint**: Topic deletion is now authenticated and ownership-protected

---

## Phase 4: User Story 2 — Update and Delete Info Entries (Priority: P1)

**Goal**: Implement the missing info update and delete operations so users can modify or remove their own info entries.

**Independent Test**: Create an info entry, update its text content → verify change persists. Delete the entry → verify it no longer appears in search results.

### Implementation for User Story 2

- [X] T008 [P] [US2] Add update_info() method to FlaskSite/services/info_service.py — accept info_id, user_id, and optional fields (key, texts, links); verify ownership; update Info record and replace nested content; commit
- [X] T009 [P] [US2] Add delete_info() method to FlaskSite/services/info_service.py — accept info_id and user_id, verify ownership, delete Info record (cascade handles child content), commit
- [X] T010 [US2] Implement update_info() in FlaskSite/controllers/info_controller.py — replace pass stub with validation logic, call info_service.update_info(), return 200/403/404 with appropriate messages
- [X] T011 [US2] Implement delete_info() in FlaskSite/controllers/info_controller.py — replace pass stub with call to info_service.delete_info(), return 200/403/404
- [X] T012 [US2] Add PUT /api/v1/info/<int:info_id> route to FlaskSite/api/v1/info.py — @jwt_required(), extract user_id, parse JSON body, call info_controller.update_info()
- [X] T013 [US2] Add DELETE /api/v1/info/<int:info_id> route to FlaskSite/api/v1/info.py — @jwt_required(), extract user_id, call info_controller.delete_info()

**Checkpoint**: Full CRUD lifecycle for info entries is now functional

---

## Phase 5: User Story 3 — Validated User Registration and Login (Priority: P1)

**Goal**: Re-enable server-side form validation on auth endpoints and return proper HTTP error codes on failure.

**Independent Test**: Submit registration with empty fields → expect 400 with field errors. Submit duplicate email → expect 409. Successful registration → expect 201 (not 200).

### Implementation for User Story 3

- [X] T014 [P] [US3] Uncomment and activate WTForms validation in POST /api/v1/register route in FlaskSite/api/v1/auth.py — validate RegisterForm, return 400 with form.errors if invalid
- [X] T015 [P] [US3] Uncomment and activate WTForms validation in POST /api/v1/login route in FlaskSite/api/v1/auth.py — validate LoginForm, return 400 with form.errors if invalid
- [X] T016 [US3] Fix FlaskSite/controllers/auth_controller.py register() to return 201 on success, 409 on duplicate user, 500 on unexpected error (never 200 for failure)
- [X] T017 [US3] Fix FlaskSite/controllers/auth_controller.py login() to return 401 on invalid credentials (not 200 with failure message)

**Checkpoint**: Auth endpoints reject all invalid input server-side with proper status codes

---

## Phase 6: User Story 4 — Picture Upload Flow (Priority: P2)

**Goal**: Fix field-naming mismatches between Pic.jsx and InfoContainer.jsx so picture uploads reach the backend correctly.

**Independent Test**: Upload an image with headline and comment via the UI → verify the file appears in instance/uploads and the info entry is retrievable with pic data.

### Implementation for User Story 4

- [X] T018 [US4] Fix field name in client/src/components/Pic.jsx — change initial state from `{ headline: '', comment: '', image: null }` to `{ headline: '', comment: '', pic: null }` to match InfoContainer expectations
- [X] T019 [US4] Fix client/src/components/InfoContainer.jsx handleSubmit() — ensure pics array field names align with Pic.jsx state (headline, comment, pic), and that Pic-File FormData entries correctly reference the file objects from the pics state

**Checkpoint**: Picture upload end-to-end flow works — files are saved, metadata stored in DB

---

## Phase 7: User Story 5 — Topic Search on Topics Page (Priority: P2)

**Goal**: Wire the SearchInput component in TopicsContainer so users can filter their topics list by typing a search term.

**Independent Test**: Create 5+ topics, type a partial name in search → only matching topics appear. Clear search → all topics shown.

### Implementation for User Story 5

- [X] T020 [US5] Add topics state and searchTerm state to client/src/components/TopicsContainer.jsx — add useState for topics (array) and searchTerm (string), add useEffect to fetch topics from /api/v1/topic/all on mount using authApi
- [X] T021 [US5] Pass searchTerm and setSearchTerm props to SearchInput component in client/src/components/TopicsContainer.jsx, and render filtered topics list (filter topics array by searchTerm match on title)

**Checkpoint**: Topic search filters the displayed list in real-time

---

## Phase 8: User Story 6 — Delete Topic from Frontend (Priority: P2)

**Goal**: Connect the DeleteTopic component to the backend API so deletions persist across page refreshes.

**Independent Test**: Delete a topic via UI, refresh page → topic is gone. Backend error → topic stays in list with error shown.

**Depends on**: Phase 3 (US1 — secure topic delete endpoint) must be complete for the backend to accept authenticated delete requests.

### Implementation for User Story 6

- [X] T022 [US6] Pass topics and setTopics props from TopicsContainer state to DeleteTopic component in client/src/components/TopicsContainer.jsx
- [X] T023 [US6] Update client/src/components/DeleteTopic.jsx handleDeleteTopic() — add authApi.post('/api/v1/delete', { topic_id }) call before updating local state, handle errors (show message, don't remove from list on failure)

**Checkpoint**: Topic deletion is persisted via backend API call

---

## Phase 9: User Story 7 — Topic Dropdown in Info Creation (Priority: P3)

**Goal**: Replace hardcoded dropdown options with the user's actual topics fetched from the API.

**Independent Test**: Open info creation form → dropdown shows user's real topic names, not "Option 1, 2, 3".

### Implementation for User Story 7

- [X] T024 [US7] Update client/src/components/InfoSearchKey.jsx — add useEffect with authApi.get('/api/v1/topic/all') to fetch topics on mount, store in local state, replace hardcoded datalist options (lines 45-49) with dynamic options mapped from fetched topics [{id, title}]

**Checkpoint**: Topic dropdown shows real user data

---

## Phase 10: User Story 8 — Remove Debug Output and Use Proper Error Codes (Priority: P3)

**Goal**: Remove all print() statements that expose sensitive data and ensure all error responses use correct HTTP status codes.

**Independent Test**: Trigger error conditions across all endpoints → verify no 200 status for failures. Check server output → no user IDs or keys printed.

### Implementation for User Story 8

- [X] T025 [P] [US8] Remove all print() statements from FlaskSite/controllers/info_controller.py (lines 10-14, 24, 40, 44) — replace with logging.debug() or logging.info() calls using the app logger
- [X] T026 [P] [US8] Remove all print() statements from FlaskSite/controllers/topic_controller.py (lines 8, 28, 36) — replace with logging.debug() calls
- [X] T027 [P] [US8] Remove print() statement from FlaskSite/api/v1/search.py (line 22) — replace with logging.debug() call
- [X] T028 [US8] Audit all controller return statements across FlaskSite/controllers/ — verify no failure path returns status 200, fix any remaining instances

**Checkpoint**: No debug output in production, all error codes are correct

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all stories

- [ ] T029 Run pylint on backend: `pylint . --enable=W --disable=C0103` — fix any regressions to maintain CI score
- [ ] T030 Run frontend tests: `cd client && npm test` — verify no regressions
- [ ] T031 Run quickstart.md manual validation — walk through all 8 test steps in quickstart.md to verify end-to-end flows

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2
- **US2 (Phase 4)**: Depends on Phase 2
- **US3 (Phase 5)**: Depends on Phase 2
- **US4 (Phase 6)**: Depends on Phase 2 (backend-independent, frontend-only)
- **US5 (Phase 7)**: Depends on Phase 2 (frontend-only)
- **US6 (Phase 8)**: Depends on Phase 2 AND Phase 3 (US1 — needs secure delete endpoint)
- **US7 (Phase 9)**: Depends on Phase 2 (frontend-only)
- **US8 (Phase 10)**: Depends on Phase 1 (logging setup)
- **Polish (Phase 11)**: Depends on all desired stories being complete

### User Story Dependencies

- **US1 (P1)**: Independent — can start after Foundational
- **US2 (P1)**: Independent — can start after Foundational
- **US3 (P1)**: Independent — can start after Foundational
- **US4 (P2)**: Independent — frontend-only fix
- **US5 (P2)**: Independent — frontend-only state wiring
- **US6 (P2)**: Depends on US1 — needs the secured backend delete endpoint
- **US7 (P3)**: Independent — frontend-only fix
- **US8 (P3)**: Depends on Phase 1 logging setup only

### Within Each User Story

- Services before controllers (data layer first)
- Controllers before API routes (logic before wiring)
- Backend before frontend (when both are involved)
- Core implementation before integration

### Parallel Opportunities

- T002, T003, T004 (Foundational) can all run in parallel
- US1, US2, US3 can all start in parallel after Foundational
- US4, US5, US7 (frontend-only stories) can all run in parallel
- T008, T009 (info service methods) can run in parallel
- T014, T015 (auth validation) can run in parallel
- T025, T026, T027 (debug print removal) can all run in parallel

---

## Parallel Example: User Story 2

```bash
# Launch service methods in parallel (different methods, same file but no conflicts):
Task: "T008 - Add update_info() to info_service.py"
Task: "T009 - Add delete_info() to info_service.py"

# Then sequentially:
Task: "T010 - Implement update_info() in info_controller.py"
Task: "T011 - Implement delete_info() in info_controller.py"

# Then API routes (can be parallel since different HTTP methods):
Task: "T012 - Add PUT /info/<id> route"
Task: "T013 - Add DELETE /info/<id> route"
```

## Parallel Example: All P1 Stories

```bash
# After Foundational phase, launch all P1 stories in parallel:
# Stream 1: US1 (Topic delete security)
Task: "T005 → T006 → T007"

# Stream 2: US2 (Info update/delete)
Task: "T008+T009 → T010+T011 → T012+T013"

# Stream 3: US3 (Auth validation)
Task: "T014+T015 → T016+T017"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (logging)
2. Complete Phase 2: Foundational (constraints + validation)
3. Complete Phase 3: User Story 1 (secure topic delete)
4. **STOP and VALIDATE**: Test topic delete with auth
5. Deploy/demo if ready — critical security fix is live

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 (secure delete) → Security fix deployed (MVP!)
3. US2 (info CRUD) + US3 (auth validation) → Core fixes complete
4. US4 (pic upload) + US5 (search) + US6 (frontend delete) → Features complete
5. US7 (dropdown) + US8 (debug cleanup) → Polish complete
6. Final validation → Release

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 + US6 (topic delete backend then frontend)
   - Developer B: US2 (info update/delete — largest story)
   - Developer C: US3 + US8 (auth validation + error codes — related concerns)
   - Developer D: US4 + US5 + US7 (all frontend fixes)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- US6 is the only story with a cross-story dependency (needs US1 backend)
